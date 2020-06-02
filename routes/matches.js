const express = require("express")
const router = express.Router()

// Middleware
const { isLoggedIn } = require("../middleware")

// Model
const User = require("../models/User.js")
const Match = require("../models/Match.js")

router.get("/", isLoggedIn, async (req, res) => {
  const id = req.session.userId

  let user,
    usersPromises = undefined
  try {
    user = await User.findById(id)
  } catch (error) {
    return res.status(500).send("Internal Server Error")
  }

  if (user.matches.length > 0) {
    usersPromises = user.matches.map(({ userId, matchId }) => {
      return new Promise((resolve, reject) => {
        void (async () => {
          try {
            const _user = await User.findById(userId)

            // If the matched user doesn't exist, remove from match
            if (!_user) {
              try {
                await Match.findOneAndDelete({ _id: matchId })
              } catch (error) {
                console.log(
                  "Something went wrong while trying to delete match",
                  matchId
                )
              }

              user.matches = user.matches.filter(
                (matchObj) => matchObj.userId != userId
              )
              user.save()

              resolve(null)
            }

            resolve({ ...(await User.findById(userId))._doc, matchId })
          } catch (error) {
            reject(error)
          }
        })()
      })
    })
  }

  if (usersPromises == undefined)
    return res.status(200).render("matches", { matches: [] })

  try {
    const users = await Promise.all(usersPromises)
    const filteredUsers = users.filter((user) => user != null)

    const renderData = { matches: filteredUsers || [] }

    res.status(200).render("matches", renderData)
  } catch (error) {
    res.status(500).send("Internal Server Error", error)
  }
})

module.exports = router
