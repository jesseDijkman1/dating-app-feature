const express = require("express")
const router = express.Router()

const User = require("../models/User.js")
const Match = require("../models/Match.js")

router.post("/like", async (req, res) => {
  // Get the likes given likes of the liked user
  const currentUserId = req.session.userId
  const likedUserId = req.body.id

  const likedUser = await User.findById(likedUserId)
  const currentUser = await User.findById(currentUserId)

  // It's a match
  if (
    Array.isArray(likedUser.likesGiven) &&
    likedUser.likesGiven.includes(currentUserId)
  ) {
    if (likedUser.matches == undefined) likedUser.matches = []
    if (currentUser.matches == undefined) currentUser.matches = []

    const existingMatch = await Match.find({
      users: { $in: [currentUserId, likedUserId] },
    })

    if (existingMatch.length > 0) console.log("Already matched")

    const match = new Match({
      users: [currentUserId, likedUserId],
      messages: [],
    })

    match.save()

    // Store match in liked user
    likedUser.matches.push({ userId: currentUserId, matchId: match._id })
    likedUser.likesGiven = likedUser.likesGiven.filter(
      (_id) => _id != currentUserId
    )
    likedUser.save()

    // Store match in current user
    currentUser.matches.push({
      userId: likedUserId,
      matchId: match._id,
    })
    currentUser.likesReceived = currentUser.likesReceived.filter(
      (_id) => _id != likedUserId
    )
    currentUser.save()

    res.status(200)
    res.redirect("/")
    return
  }

  if (likedUser.likesReceived == undefined) likedUser.likesReceived = []
  if (currentUser.likesGiven == undefined) currentUser.likesGiven = []

  likedUser.likesReceived.push(currentUserId)
  currentUser.likesGiven.push(likedUserId)

  likedUser.save()
  currentUser.save()

  res.status(200)
  res.redirect("/")
})

module.exports = router
