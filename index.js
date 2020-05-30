const express = require("express")

// Process.env.port is used by heroku
const PORT = process.env.PORT || 3000

const app = express()

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`)
})
