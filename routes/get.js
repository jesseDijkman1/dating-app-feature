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
  const age = req.session.userAge
  const name = req.session.userName
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

router.get("/matches", isLoggedIn, async (req, res) => {
  const id = req.session.userId
  try {
    const { matches = [] } = await userModel.findById(id)

    const usersPromises = matches.map(async (matchId) => {
      return new Promise((resolve, reject) => {
        void (async function () {
          try {
            resolve(await userModel.findById(matchId))
          } catch (err) {
            reject(err)
          }
        })()
      })
    })

    const users = await Promise.all(usersPromises)

    res.render("matches", {
      user: {
        id: req.session.userId,
        name: req.session.userName,
      },
      matches: users || [],
    })
  } catch (error) {
    console.log(error)
  }
})

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login", { errors: [], values: {} })
})

router.get("/register", isLoggedOut, (req, res) => {
  res.render("register", { errors: [], values: {} })
})

router.get("/logout", (req, res) => {
  req.session.destroy()

  res.redirect("/login")
})

router.get("/*", (req, res) => {
  res.status(404)
  res.send("404 page not found")
})

module.exports = router
