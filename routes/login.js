const express = require("express")
const router = express.Router()

const User = require("../models/User.js")

function isLoggedOut(req, res, next) {
  if (!req.session.loggedin) {
    return next()
  }

  res.redirect("/")
}

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login", { errors: [], values: {} })
})

router.post("/userLogin", async (req, res) => {
  const { email, password } = req.body
  try {
    const foundUser = await User.findOne({ email })

    if (foundUser.password == password) {
      // Store current user data
      req.session.loggedin = true
      req.session.userId = foundUser._id
      req.session.userName = foundUser.name
      req.session.userAge = foundUser.age
      req.session.userGender = foundUser.gender
      req.session.userSexuality = foundUser.sexuality

      res.redirect("/")
    } else {
      res.render("login", { errors: ["password"], values: { email } })
    }
  } catch (err) {
    console.log("Error", err)

    res.render("login", { errors: ["email"], values: { email } })
  }
})

router.post("/logout", (req, res) => {
  req.session.destroy()

  res.redirect("/login")
})
