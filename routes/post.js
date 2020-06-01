const { validate } = require("email-validator")
const express = require("express")
const router = express.Router()

const User = require("../models/User.js")
const Match = require("../models/Match.js")

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

router.post("/userRegister", async (req, res) => {
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

router.post("/logout", (req, res) => {
  req.session.destroy()

  res.redirect("/login")
})

router.post("/like", async (req, res) => {
  // Get the likes given likes of the liked user
  const currentUserId = req.session.userId
  const likedUserId = req.body.id

  const likedUser = await User.findById(likedUserId)
  const currentUser = await User.findById(currentUserId)

  // It's a match
  if (
    Array.isArray(likedUser.likesGiven) &&
    likedUser.likesGiven.includes(currentUserId)
  ) {
    if (likedUser.matches == undefined) likedUser.matches = []
    if (currentUser.matches == undefined) currentUser.matches = []

    const existingMatch = await Match.find({
      users: { $in: [currentUserId, likedUserId] },
    })

    if (existingMatch.length > 0) console.log("Already matched")

    const match = new Match({
      users: [currentUserId, likedUserId],
      messages: [],
    })

    match.save()

    // Store match in liked user
    likedUser.matches.push({ userId: currentUserId, matchId: match._id })
    likedUser.likesGiven = likedUser.likesGiven.filter(
      (_id) => _id != currentUserId
    )
    likedUser.save()

    // Store match in current user
    currentUser.matches.push({
      userId: likedUserId,
      matchId: match._id,
    })
    currentUser.likesReceived = currentUser.likesReceived.filter(
      (_id) => _id != likedUserId
    )
    currentUser.save()

    res.status(200)
    res.redirect("/")
    return
  }

  if (likedUser.likesReceived == undefined) likedUser.likesReceived = []
  if (currentUser.likesGiven == undefined) currentUser.likesGiven = []

  likedUser.likesReceived.push(currentUserId)
  currentUser.likesGiven.push(likedUserId)

  likedUser.save()
  currentUser.save()

  res.status(200)
  res.redirect("/")
})
module.exports = router
