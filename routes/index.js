const express = require("express")
const router = express.Router()

// Middleware
const { isLoggedIn } = require("../middleware")

// Models
const User = require("../models/User.js")

function getMatchingGender(sexuality, gender) {
  /*eslint indent: 0*/
  /*eslint no-unreachable: 0*/

  switch (sexuality) {
    case "heterosexual":
      return gender == "male" ? "female" : "male"
      break
    case "homosexual":
      return gender == "male" ? "male" : "female"
    default:
      return /female|male/i
      break
  }
}

// Home Page
router.get("/", isLoggedIn, async (req, res) => {
  const userId = req.session.userId
  const userName = req.session.userName
  const userSexuality = req.session.userSexuality
  const userGender = req.session.userGender

  try {
    // Need to fix that matched users still show up in the list (maches needs to be split up into two array matchIds and userIds)
    const otherUsers =
      (await User.find({
        _id: { $ne: userId },
        gender: getMatchingGender(userSexuality, userGender),
        likesReceived: { $nin: [userId] },
        sexuality: userSexuality,
      })) || []

    const renderData = { userId, userName, otherUsers }

    res.status(200).render("index", renderData)
  } catch (error) {
    res.status(500).send("Internal Server Error", error)
  }
})

module.exports = router
