const express = require("express")
const router = express.Router()

// const User = require("../models/User.js")

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

// Local Data Middleware
// async function localUserData(req, res, next) {
//   try {
//     const user = await User.findById(req.session.userId)

//     next()
//   } catch (err) {
//     res.send("500")
//   }
// }

router.get("/", isLoggedIn, (req, res) => {
  res.render("index", {
    user: {
      id: req.session.userId,
      name: req.session.userName,
    },
  })
})

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login", { errors: [], values: {} })
})

router.get("/register", isLoggedOut, (req, res) => {
  res.render("register", { errors: [], values: {} })
})

module.exports = router
