const express = require("express")
const router = express.Router()

// Middleware
const { isLoggedOut } = require("../middleware")

// Models
const User = require("../models/User.js")

// Login Page
router.get("/", isLoggedOut, (req, res) =>
  res.status(200).render("login", { errors: [], values: {} })
)

// Login User
router.post("/", async (req, res) => {
  const { email, password } = req.body

  try {
    const foundUser = await User.findOne({ email })

    if (foundUser.password == password) {
      // Store current user data in session
      req.session.loggedin = true
      req.session.userId = foundUser._id
      req.session.userName = foundUser.name
      req.session.userAge = foundUser.age
      req.session.userGender = foundUser.gender
      req.session.userSexuality = foundUser.sexuality

      return res.status(200).redirect("/")
    }

    const renderData = { errors: ["password"], values: { email } }

    res.status(401).render("login", renderData)
  } catch (err) {
    const renderData = { errors: ["email"], values: { email } }
    res.status(401).render("login", renderData)
  }
})

module.exports = router
