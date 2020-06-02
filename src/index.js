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

function giphyElement(imgSrc, giphyId, chatId, userId) {
  return `
    <form action="/message/giphy" method="POST">
      <input type="hidden" name="giphySrc" value="${imgSrc}">
      <input type="hidden" name="chatId" value="${chatId}">
      <input type="hidden" name="userId" value="${userId}">
      <img src="${imgSrc}">

      <button type="submit">Send giphy</button>
    </div>
  `
}

// Open giphy section
async function toggleGiphySection() {
  const { data } = await getTrendingGiphys()
  const matchId = giphyOverviewContainer.getAttribute("data-match-id")
  const userId = giphyOverviewContainer.getAttribute("data-user-id")

  data.forEach((giphy) => {
    const previewUrl = giphy.images.preview_gif.url
    const giphyId = giphy.id

    const giphyBlock = giphyElement(previewUrl, giphyId, matchId, userId)

    giphyOverviewContainer.innerHTML += giphyBlock
  })

  // data.forEach((obj) => {
  // const previewUrl =

  // const giphyFormContainer = document.createElement("FORM")
  // giphyFormContainer.action = "/message/giphy"
  // giphy

  // const imgElement = document.createElement("IMG")

  // imgElement.src = previewUrl

  //   giphyOverviewContainer.appendChild(imgElement)
  // })
}

function updateOverview(html) {
  // giphyOverviewContainer
}
