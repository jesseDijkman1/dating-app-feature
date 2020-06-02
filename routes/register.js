const { validate } = require("email-validator")
const express = require("express")
const router = express.Router()

// Middleware
const { isLoggedOut } = require("../middleware")

// Models
const User = require("../models/User.js")

// Register Page
router.get("/", isLoggedOut, (req, res) =>
  res.status(200).render("register", { errors: [], values: {} })
)

// Register New User
router.post("/", async (req, res) => {
  const {
    email,
    name,
    age,
    gender,
    sexuality,
    password,
    password_check,
  } = req.body

  const inputErrors = []

  // No error messages, just logic for making the borders red

  if (!email || !validate(email) || !!(await User.findOne({ email }))) {
    inputErrors.push("email")
  }

  // Extremely simple name validation (must be letters, and atleast 2)
  if (!name || !new RegExp(/[A-Za-z]{1,}\s?[A-Za-z]{1,}/).test(name)) {
    inputErrors.push("name")
  }

  if (!age || parseInt(age) < 18) {
    inputErrors.push("age")
  }

  if (!password || !password_check || password !== password_check) {
    inputErrors.push("password", "password_check")
  }

  // If errors render register with errors
  if (inputErrors.length > 0) {
    const renderData = { errors: inputErrors, values: req.body }

    return res.status(400).render("register", renderData)
  }

  try {
    const newUser = new User({
      email,
      name,
      age,
      gender,
      sexuality,
      password,
      likesReceived: [],
      likesGiven: [],
      matches: [],
    })

    await newUser.save()

    res.status(200).redirect("/login")
  } catch (err) {
    res.status(500).send("Internal Server Error")
  }
})

module.exports = router
