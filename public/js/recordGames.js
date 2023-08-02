// recordGames.js

// Function to toggle the player list visibility
function togglePlayerList(gameSetupId) {
  const playerList = document.getElementById(`playerList_${gameSetupId}`);
  playerList.classList.toggle("hidden");
}

// This function will redirect to the "Record Stats" page, passing the gameSetupId as a query parameter in the URL.
function recordGameStats(gameSetupId) {
  // Redirect to the recordStats page with the game setup ID as a query parameter
  window.location.href = `/recordStats?gameSetupId=${gameSetupId}`;
}

// Add event listeners to the View Players buttons
const viewPlayersButtons = document.querySelectorAll("[data-game-setup-id]");
viewPlayersButtons.forEach((button) => {
  const gameSetupId = button.dataset.gameSetupId;
  button.addEventListener("click", () => {
    togglePlayerList(gameSetupId);
  });
});
