// index.js - Shadow's Unblocked Games

// Function to create a game card
function createGameCard(game) {
  const card = document.createElement("div");
  card.className = "game-card";

  const img = document.createElement("img");
  img.src = game.image;
  img.alt = game.name;
  img.className = "game-image";

  const title = document.createElement("div");
  title.textContent = game.name;
  title.className = "game-title";

  card.appendChild(img);
  card.appendChild(title);

  // On click, open the game via proxy
  card.addEventListener("click", () => {
    openGame(game.url);
  });

  return card;
}

// Function to open the game in the proxy iframe
function openGame(url) {
  const proxyFrame = document.getElementById("proxy-frame");
  const overlay = document.getElementById("overlay");
  proxyFrame.src = `https://your-proxy-domain.com/proxy/${btoa(url)}`;
  overlay.style.display = "block";
}

// Function to close the proxy overlay
function closeGame() {
  const proxyFrame = document.getElementById("proxy-frame");
  const overlay = document.getElementById("overlay");
  proxyFrame.src = "";
  overlay.style.display = "none";
}

// Initialize the game grid
function initGameGrid() {
  const gameGrid = document.getElementById("game-grid");
  games.forEach(game => {
    const gameCard = createGameCard(game);
    gameGrid.appendChild(gameCard);
  });
}

// Event listener for the back button
document.getElementById("back-btn").addEventListener("click", closeGame);

// Initialize the game grid on page load
document.addEventListener("DOMContentLoaded", initGameGrid);
