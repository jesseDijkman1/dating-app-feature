const giphyStartBtn = document.getElementById("giphy-open")
const giphyOverviewContainer = document.getElementById("giphy-grid")
const giphySearchInput = document.getElementById("giphy-search-input")

// Event listeners
giphyStartBtn.addEventListener("click", toggleGiphySection)

// Giphy search
function getTrendingGiphys() {
  return new Promise((resolve, reject) => {
    void (async function () {
      try {
        const response = await fetch("/giphy/trending")
        const data = await response.json()

        resolve(data)
      } catch (err) {
        console.error(err, "Something went wrong on the server")
        resolve([])
      }
    })()
  })
}

// Open giphy section
async function toggleGiphySection() {
  const { data } = await getTrendingGiphys()

  data.forEach((obj) => {
    const previewUrl = obj.images.preview_gif.url

    const imgElement = document.createElement("IMG")
    imgElement.src = previewUrl

    giphyOverviewContainer.appendChild(imgElement)
  })
}

function updateOverview(html) {
  // giphyOverviewContainer
}
