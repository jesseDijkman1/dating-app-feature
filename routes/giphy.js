const axios = require("axios")
const express = require("express")
const router = express.Router()

// These routes are used for retrieving data with JavaScript or othertools
router.post("/trending", async (req, res) => {
  const url = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}`
  try {
    const response = await axios.get(url)

    res.status(200).json(response.data)
  } catch (error) {
    res.status(400).send("Bad Request", error)
  }
})

module.exports = router
