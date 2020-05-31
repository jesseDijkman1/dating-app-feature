const { validate } = require("email-validator")
const express = require("express")
const router = express.Router()

const User = require("../models/User.js")

router.post("/userLogin", async (req, res) => {
  const { email, password } = req.body

  try {
    const foundUser = await User.findOne({ email })

    if (foundUser.password == password) {
      // Store data for rendering and further routing
      req.session.loggedin = true
      req.session.userId = foundUser._id
      req.session.userName = foundUser.name

      res.redirect("/")
    } else {
      res.render("login", { errors: ["password"], values: { email } })
    }
  } catch (err) {
    console.log("Error", err)

    res.render("login", { errors: ["email"], values: { email } })
  }
})

router.post("/userRegister", async (req, res) => {
  const { email, name, age, password, password_check } = req.body
  const inputErrors = []

  // No error messages, just logic for making the borders red

  if (!email || !validate(email) || !!(await User.findOne({ email }))) {
    inputErrors.push("email")
  }

  // Extremely simple name validation (must be letters, and atleast 2)
  if (!name || !new RegExp(/[A-Za-z]{2,}\s?[A-Za-z]{2,}/).test(name)) {
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
    res.render("register", { errors: inputErrors, values: req.body })
  } else {
    try {
      const newUser = new User({ email, name, age, password })
      await newUser.save()

      console.log("Added new user to database", newUser)
    } catch (err) {
      console.log(err)
    }

    res.redirect("/")
  }
})

module.exports = router
