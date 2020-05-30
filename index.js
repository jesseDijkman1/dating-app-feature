const express = require("express")
const path = require("path")
const mongoose = require("mongoose")

require("dotenv").config()

// Mongo connnection
void (async function () {
  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected to MongoDB")
  } catch (err) {
    console.log(err)
  }
})()

// Models
const User = require("./models/User.js")

async function addPeter() {
  const peter = new User({
    name: "Peter",
    age: 21,
    gender: "male",
    sexuality: "hetero",
  })

  try {
    await peter.save()
    // If success
    console.log("Added", peter, t)
  } catch (err) {
    console.log(err)
  }
}

addPeter()

// Workspace modules
const routes = require("./modules/routes.js")

// Process.env.port is used by heroku
const PORT = process.env.PORT || 3000

const app = express()

app.set("view engine", "ejs")
app.set("views", path.resolve(__dirname, "./templates"))

// Init routes
routes(app)

// const Cat = mongoose.model("Cat", { name: String })

// const kitty = new Cat({ name: "Zildjian" })
// kitty.save().then(() => console.log("meow"))

app.listen(PORT, () => {
  console.log(`Listening to port: ${PORT}`)
})
