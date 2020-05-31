const express = require("express")
const router = express.Router()

const { validate } = require("email-validator")

router.post("/userLogin", (req, res) => {})

router.post("/userRegister", (req, res) => {
  const { email, name, age, password, password_check } = req.body
  const inputErrors = []

  // No error messages, just logic for making the borders red

  if (!email || !validate(email)) {
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
    return res.render("register", { errors: inputErrors, values: req.body })
  }

  res.redirect("/")
})

module.exports = router
