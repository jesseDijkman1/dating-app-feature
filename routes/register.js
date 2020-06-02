const { validate } = require("email-validator")
const express = require("express")
const router = express.Router()

const User = require("../models/User.js")

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

router.get("/register", isLoggedOut, (req, res) => {
  res.render("register", { errors: [], values: {} })
})

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
    res.render("register", { errors: inputErrors, values: req.body })
  } else {
    try {
      const newUser = new User({
        email,
        name,
        age,
        gender,
        sexuality,
        password,
      })
      await newUser.save()

      console.log("Added new user to database", newUser)
    } catch (err) {
      console.log(err)
    }

    res.redirect("/")
  }
})
