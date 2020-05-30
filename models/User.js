const mongoose = require("mongoose")

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  sexuality: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: false,
  },
  age: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  matches: {
    type: Array,
    default: undefined,
  },
})

const User = mongoose.model("User", Schema)

module.exports = User
