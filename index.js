const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")

require("dotenv").config()

// Port configuration (Heroku)
const PORT = process.env.PORT || 3000

// Express Init
const app = express()

// EJS Middleware
app.use(expressLayouts)
app.set("view engine", "ejs")

// Routes Middleware
app.use(require("./routes/get.js"))

app.listen(PORT, async () => {
  console.log(`Listening to port: ${PORT}`)

  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected to MongoDB")
  } catch (err) {
    console.log(err)
  }
})
