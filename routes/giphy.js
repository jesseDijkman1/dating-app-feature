const axios = require("axios")
const express = require("express")
const router = express.Router()

router.get("/giphy/trending", async (req, res) => {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}`

  const response = await axios.get(url)

  res.json(response.data)
})
