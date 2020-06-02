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
  if (otherUser.likesGiven.includes(userId)) {
    const match = new Match({
      users: [userId, otherUserId],
      messages: [],
    })

    match.save()

    // Store match in other user
    otherUser.matches.push({ userId: userId, matchId: match._id })

    // Store match in current user
    user.matches.push({
      userId: otherUserId,
      matchId: match._id,
    })
  }

  otherUser.likesReceived.push(userId)
  user.likesGiven.push(otherUserId)

  try {
    await Promise.all([otherUser.save(), user.save()])

    res.status(200).redirect("/")
  } catch (err) {
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router
