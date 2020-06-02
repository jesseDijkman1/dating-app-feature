const express = require("express")
const router = express.Router()

const userModel = require("../models/User.js")
const Match = require("../models/Match.js")

function isLoggedIn(req, res, next) {
  if (req.session.loggedin) {
    return next()
  }

  res.redirect("/login")
}

function isLoggedOut(req, res, next) {
  if (!req.session.loggedin) {
    return next()
  }

  res.redirect("/")
}

async function isMatched(req, res, next) {
  const id = req.session.userId
  const chatId = req.params.id

  try {
    const user = await userModel.findById(id)

    const found = user.matches.find(({ matchId }) => matchId == chatId)

    if (!found) return res.status(401).end()

    next()
  } catch (err) {
    console.log(err)
  }
}

function isAuthorized(req, res, next) {
  const { userId } = req.body

  if (userId == req.session.userId) {
    return next()
  }

  return res.status(401).end()
}

router.get("/:id", isLoggedIn, isMatched, async (req, res) => {
  const matchId = req.params.id
  const { users, messages } = await Match.findById(matchId).sort({
    date: "descending",
  })

  const otherUserId = users.filter((u) => u != req.session.userId).join()
  const otherUser = await userModel.findById(otherUserId)

  res.render("chat", {
    matchId,
    userId: req.session.userId,
    otherUser,
    messages,
  })
})

router.post("/message", isAuthorized, async (req, res) => {
  const { chatId, text } = req.body

  try {
    const match = await Match.findById(chatId)

    match.messages.push({
      userId: req.session.userId,
      content: text,
      date: new Date(Date.now()),
    })
    match.save()

    res.status(200)
    res.redirect(`/chat/${chatId}`)
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
})

router.post("/message/giphy", isAuthorized, async (req, res) => {
  const { chatId, giphySrc } = req.body

  try {
    const match = await Match.findById(chatId)

    match.messages.push({
      userId: req.session.userId,
      content: null,
      giphySrc,
      date: new Date(Date.now()),
    })

    match.save()

    res.status(200)
    res.redirect(`/chat/${chatId}`)
  } catch (error) {
    console.log(error)

    res.status(500).end()
  }
})

router.get("/:id/giphy", isLoggedIn, isMatched, async (req, res) => {
  const matchId = req.params.id

  // Get the seached query (if it exists)
  const searchQuery = req.query.query || undefined

  if (!searchQuery) {
    // Get the trending giphys
    const url = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}`

    const response = await axios.get(url)

    console.log(response)

    const giphys = response.data.data.map((giphy) => {
      return {
        alt: giphy.title,
        src: giphy.images.original.url,
        id: giphy.id,
      }
    })

    res.render("giphy-overview", {
      matchId,
      userId: req.session.userId,
      giphys,
    })
  }
})
