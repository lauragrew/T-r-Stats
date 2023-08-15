// endGame.js
document.addEventListener("DOMContentLoaded", () => {
  const endGameButton = document.getElementById("end-game-btn");

  endGameButton.addEventListener("click", async () => {
    const gameSetupId = endGameButton.getAttribute("data-game-setup-id");

    try {
      const response = await axios.post(`/api/v1/stats/endGame/${gameSetupId}`);
      if (response.data.success) {
        // Display a success message
        Swal.fire({
          icon: "success",
          title: "Game Ended",
          text: "The game has been successfully ended. You can no longer record stats on this game.",
          confirmButtonText: "OK",
        }).then(() => {
          // Redirect back to the recordGame page after ending the game
          window.location.href = "/recordGames";
        });
      } else {
        console.log("Failed to end the game.");
      }
    } catch (error) {
      console.error("Error ending game:", error);
    }
  });
});
