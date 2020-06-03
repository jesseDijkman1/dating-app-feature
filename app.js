const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const session = require("express-session")

require("dotenv").config()

// Port configuration (Heroku)
const PORT = process.env.PORT || 3000

const app = express()

// Express Session
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
)

// Bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// EJS
app.use(expressLayouts)
app.set("view engine", "ejs")

// Static Files
app.use("/src", express.static("src"))

// Routes
app.use(require("./routes"))
app.use("/chat", require("./routes/chat"))
app.use("/register", require("./routes/register"))
app.use("/login", require("./routes/login"))
app.use("/user", require("./routes/user"))
app.use("/matches", require("./routes/matches"))
app.use("/giphy", require("./routes/giphy"))

// 404
app.use("/*", require("./routes/404"))

app.post("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/login")
})

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
