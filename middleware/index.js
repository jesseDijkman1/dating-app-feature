const User = require("../models/User")
const Match = require("../models/Match")

exports.isLoggedIn = (req, res, next) =>
  req.session.loggedin ? next() : res.redirect("/login")

exports.isLoggedOut = (req, res, next) =>
  !req.session.loggedin ? next() : res.redirect("/login")

exports.isMatched = async (req, res, next) => {
  const _userId = req.session.userId,
    _matchId = req.params.id

  try {
    const { matches } = await User.findById(_userId)

    if (matches.find(({ matchId }) => matchId == _matchId) !== undefined)
      return next()

    res.status(401).send("Not authorized")
  } catch (error) {
    res.status(500).send("Internal Server Error", error)
  }
}

exports.isAlreadyMatch = async (req, res, next) => {
  const userId = req.body.userId
  const otherUserId = req.body.otherUserId

  try {
    const existingMatch = await Match.find({
      users: { $in: [userId, otherUserId] },
    })

    if (existingMatch.length == 0) return next()

    res.status(409).send("Is already a match")
  } catch (error) {
    res.status(500).send("Internal Server Error", error)
  }
}

exports.isAuthorized = (req, res, next) =>
  req.body.userId == req.session.userId
    ? next()
    : res.status(401).send("Not authorized")
