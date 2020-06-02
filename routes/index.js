const express = require("express")
const router = express.Router()

// Middleware
const { isLoggedIn } = require("../middleware")

// Models
const User = require("../models/User.js")

// Gender Query Helper
function getGenderQuery(sexuality, gender) {
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
  const id = req.session.userId
  const name = req.session.userName
  const sexuality = req.session.userSexuality
  const gender = req.session.userGender

  try {
    // Need to fix that matched users still show up in the list (maches needs to be split up into two array matchIds and userIds)
    const otherUsers =
      (await User.find({
        _id: { $ne: id },
        gender: getGenderQuery(sexuality, gender),
        likesReceived: { $nin: [id] },
        matches: { $nin: [id] },
        sexuality,
      })) || []

    const renderData = {
      user: { id, name },
      users: otherUsers,
    }

    res.status(200).render("index", renderData)
  } catch (error) {
    res.status(500).send("Internal Server Error", error)
  }
})

module.exports = router
