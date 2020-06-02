const express = require("express")
const router = express.Router()

const userModel = require("../models/User.js")

router.get("/matches", isLoggedIn, async (req, res) => {
  const id = req.session.userId
  try {
    const { matches = [] } = await userModel.findById(id)

    const usersPromises = matches.map(async ({ userId, matchId }) => {
      return new Promise((resolve, reject) => {
        void (async function () {
          try {
            resolve([await userModel.findById(userId), matchId])
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
