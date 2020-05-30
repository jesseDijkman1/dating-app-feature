const express = require("express")
const path = require("path")

// Workspace modules
const routes = require("./modules/routes.js")

// Process.env.port is used by heroku
const PORT = process.env.PORT || 3000

const app = express()

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "./templates"))

// Init routes
routes(app)

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`)
})
