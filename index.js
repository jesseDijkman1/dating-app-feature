const express = require("express")
const path = require("path")

// Process.env.port is used by heroku
const PORT = process.env.PORT || 3000

const app = express()

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "./templates"))

app.get("/", (req, res) => {
  res.render("index")
})

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`)
})
