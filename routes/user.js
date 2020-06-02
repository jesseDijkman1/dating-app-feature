const express = require("express")
const router = express.Router()

// Middleware
const { isAuthorized, isAlreadyMatch } = require("../middleware")

// Models
const User = require("../models/User.js")
const Match = require("../models/Match.js")

router.post("/like", isAuthorized, isAlreadyMatch, async (req, res) => {
  const userId = req.body.userId
  const otherUserId = req.body.otherUserId

  let user, otherUser
  try {
    user = await User.findById(userId)
    otherUser = await User.findById(otherUserId)
  } catch (error) {
    res.status(400).send("Bad Request", error)
  }

  // It's a match
  if (
    Array.isArray(otherUser.likesGiven) &&
    otherUser.likesGiven.includes(userId)
  ) {
    if (otherUser.matches == undefined) otherUser.matches = []
    if (user.matches == undefined) user.matches = []

    const match = new Match({
      users: [userId, otherUserId],
      messages: [],
    })

    match.save()

    // Store match in other user
    otherUser.matches.push({ userId: userId, matchId: match._id })
    otherUser.likesGiven = otherUser.likesGiven.filter((_id) => _id != userId)
    otherUser.save()

    // Store match in current user
    user.matches.push({
      userId: otherUserId,
      matchId: match._id,
    })
    user.likesReceived = user.likesReceived.filter((_id) => _id != otherUserId)
    user.save()

    res.status(200).redirect("/matches")
  }

  if (otherUser.likesReceived == undefined) otherUser.likesReceived = []
  if (user.likesGiven == undefined) user.likesGiven = []

  otherUser.likesReceived.push(userId)
  user.likesGiven.push(otherUserId)

  otherUser.save()
  user.save()

  res.status(200).redirect("/")
})

module.exports = router
