// Function to handle the "Record Stat" button click event
function recordStat(playerId, position) {
  // Implement the code to record the stat for the given player (using the playerId and position)
  console.log("Recorded stat for player:", playerId, "Position:", position);
  // You can use AJAX to send the stat data to the backend and save it in the database
}

// Add event listeners to the "Record Stat" buttons
const recordStatButtons = document.querySelectorAll(".record-stat-btn");
recordStatButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const playerId = button.dataset.playerId;
    const position = button.dataset.position;
    recordStat(playerId, position);
  });
});
