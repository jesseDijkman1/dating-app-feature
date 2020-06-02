const User = require("../models/User")

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
  } catch (err) {
    res.status(500).send("Server Error", err)
  }
}

exports.isAuthorized = (req, res, next) =>
  req.body == req.session.userId
    ? next()
    : res.status(401).send("Not authorized")
