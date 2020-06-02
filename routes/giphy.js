const axios = require("axios")
const express = require("express")
const router = express.Router()

// Middleware
const { isAuthorized } = require("../middleware")

// Return the trending giphies to the front end
router.post("/trending", isAuthorized, async (req, res) => {
  const URL = `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_API_KEY}`
  try {
    const response = await axios.get(URL)

    res.status(200).json(response.data)
  } catch (error) {
    res.status(400).send("Bad Request", error)
  }
})

// Search giphy and redirect to accessible giphy overview page
router.post("/search", isAuthorized, async (req, res) => {
  const { matchId, userId, query } = req.body
  const URL = `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${query}`

  try {
    const response = await axios.get(URL)
    const giphies = response.data.data.map((giphy) => ({
      alt: giphy.title,
      src: giphy.images.original.url,
      id: giphy.id,
    }))

    const renderData = { matchId, userId, giphies }

    res.status(200).render("giphy-overview", renderData)
  } catch (error) {
    res.status(400).send("Bad Request", error)
  }
})

module.exports = router
