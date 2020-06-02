const express = require("express")
const router = express.Router()

const userModel = require("../models/User.js")

// Authentication Middleware
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

router.get("/", isLoggedIn, async (req, res) => {
  // Get other users for matching page
  const id = req.session.userId
  const sexuality = req.session.userSexuality
  const gender = req.session.userGender

  // For now only filter by sexuality and gender
  let otherUsers
  try {
    let genderQuery
    if (sexuality == "heterosexual") {
      if (gender == "male") {
        genderQuery = "female"
      } else {
        genderQuery = "male"
      }
    } else if (sexuality == "homosexual") {
      if (gender == "male") {
        genderQuery = "male"
      } else {
        genderQuery = "female"
      }
    } else {
      genderQuery = /female|male/i
    }

    // Need to fix that matched users still show up in the list (maches needs to be split up into two array matchIds and userIds)
    otherUsers = await userModel.find({
      _id: { $ne: id },
      gender: genderQuery,
      likesReceived: { $nin: [id] },
      matches: { $nin: [id] },
      sexuality,
    })
  } catch (err) {
    console.log(err)
  }

  res.render("index", {
    user: {
      id: req.session.userId,
      name: req.session.userName,
    },
    users: otherUsers || [],
  })
})
