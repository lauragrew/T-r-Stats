// Function to toggle the player list visibility
function togglePlayerList(gameSetupId) {
  const playerList = document.getElementById(`playerList_${gameSetupId}`);
  playerList.classList.toggle("hidden");
}

// Add event listeners to the View Players buttons
const viewPlayersButtons = document.querySelectorAll("[data-game-setup-id]");
viewPlayersButtons.forEach((button) => {
  const gameSetupId = button.dataset.gameSetupId;
  button.addEventListener("click", () => {
    togglePlayerList(gameSetupId);
  });
});
