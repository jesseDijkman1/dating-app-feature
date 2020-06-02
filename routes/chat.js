const axios = require("axios")
const express = require("express")
const router = express.Router()

// Middleware
const { isLoggedIn, isMatched, isAuthorized } = require("../middleware")

// Models
const User = require("../models/User.js")
const Match = require("../models/Match.js")

// Chat Page
router.get("/:id", isLoggedIn, isMatched, async (req, res) => {
  const matchId = req.params.id
  const userId = req.session.userId

  try {
    const { users, messages } = await Match.findById(matchId).sort({
      date: "desc",
    })
    const otherUserId = users.filter((uid) => uid != userId)[0]
    const otherUser = await User.findById(otherUserId)

    const renderData = { matchId, userId, otherUser, messages }

    res.status(200).render("chat", renderData)
  } catch (error) {
    console.error(error)

    res.status(400).send("Bad request", error)
  }
})

// New Message
router.post("/message", isAuthorized, async (req, res) => {
  const { matchId, userId, message } = req.body

  try {
    const match = await Match.findById(matchId)

    match.messages.push({
      userId,
      message,
      date: new Date(Date.now()),
    })
    match.save()

    res.status(200).redirect(`/chat/${matchId}`)
  } catch (error) {
    res.status(400).send("Bad Request", error)
  }
})

// Giphy Message
router.post("/message/giphy", isAuthorized, async (req, res) => {
  const { matchId, userId, giphySrc } = req.body

  try {
    const match = await Match.findById(matchId)

    match.messages.push({
      userId,
      content: null,
      giphySrc,
      date: new Date(Date.now()),
    })

    match.save()

    res.status(200).redirect(`/chat/${matchId}`)
  } catch (error) {
    res.status(400).send("Bad Request", error)
  }
})

// This route exists to make it possible to send giphys without relying on JavaScript
router.get("/:id/giphy", isLoggedIn, isMatched, async (req, res) => {
  const matchId = req.params.id
  const userId = req.session.userId
  const searchQuery = req.query.search || undefined

  // If no search query => show trending giphies
  if (!searchQuery) {
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}`
    const response = await axios.get(url)

    const giphies = response.data.data.map((giphy) => {
      return {
        alt: giphy.title,
        src: giphy.images.original.url,
        id: giphy.id,
      }
    })

    const renderData = { matchId, userId, giphies }

    res.render("giphy-overview", renderData)
  }
})

module.exports = router