// function to toggle the player list visibility in recordGames.pug page
function togglePlayerList(gameSetupId) {
  const playerList = document.getElementById(`playerList_${gameSetupId}`);
  playerList.classList.toggle("hidden");
}

// function to redirect to the recordStats page, passing the gameSetupId as a query parameter in the URL
function recordGameStats(gameSetupId) {
  window.location.href = `/recordStats?gameSetupId=${gameSetupId}`;
}

// add event listeners to the 'View Players' buttons - then toggle the list of players
const viewPlayersButtons = document.querySelectorAll("[data-game-setup-id]");
viewPlayersButtons.forEach((button) => {
  const gameSetupId = button.dataset.gameSetupId;
  button.addEventListener("click", () => {
    togglePlayerList(gameSetupId);
  });
});

// calculate the height of each game setup card
const cardHeight = 100;

// calculate the total height of the game setups
const totalHeight = cardHeight * viewPlayersButtons.length;

// set the container's height to the total height
const container = document.querySelector("#record-game-setup-container");
container.style.height = `${totalHeight}px`;
