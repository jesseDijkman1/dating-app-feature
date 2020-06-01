const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
  users: {
    type: Array,
    required: true,
  },
  messages: {
    type: Array,
    default: undefined,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

const Match = mongoose.model("Match", Schema)

module.exports = Match
