// Define the getUrlParameter function to extract URL parameters
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

document.addEventListener("DOMContentLoaded", () => {
  const recordStatButtons = document.querySelectorAll(".record-stat");

  recordStatButtons.forEach((button) => {
    button.addEventListener("click", handleRecordStat);
  });

  async function handleRecordStat(event) {
    const button = event.target.closest(".record-stat-btn");
    if (!button) return;

    const playerId = button.dataset.playerId;
    const position = button.dataset.position;
    const playerNumber = button.querySelector(".player-number").textContent;

    const gameSetupId = getUrlParameter("gameSetupId");
    const selectedGameSetupId = gameSetupId;

    const statDropdown = document.createElement("select");
    statDropdown.classList.add("stat-dropdown");
    statDropdown.innerHTML = `
      <option value="">-- Select Stat Type --</option>
      <option value="Tackle">Tackle</option>
      <option value="Save">Save</option>
      <option value="Turnover for">Turnover for</option>
      <option value="Turnover against">Turnover against</option>
      <option value="Goal">Goal</option>
      <option value="Point">Point</option>
      <option value="Free conceded">Free Conceded</option>
      <option value="Dropped short">Dropped short</option>
      <option value="Wide">Wide</option>
      <option value="Kickout won">Kickout won</option>
      <option value="Kickout lost">Kickout lost</option>
      <!-- Add more stat types as needed -->
    `;

    Swal.fire({
      title: `Record Stat for ${position} - No. ${playerNumber}`,
      html: statDropdown,
      confirmButtonText: "Save",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const statType = statDropdown.value;
        if (!statType) {
          Swal.showValidationMessage("Please select a stat type.");
        }
        return { gameSetupId: selectedGameSetupId, statType };
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const { gameSetupId, statType } = result.value;
      saveStatToServer(gameSetupId, playerId, position, statType);
    });
  }

  async function saveStatToServer(gameSetupId, playerId, position, statType) {
    try {
      const response = await axios.post("/api/v1/stats/saveStat", {
        gameSetupId,
        playerId,
        position,
        statType,
        date: new Date(), // Add the current date
      });

      if (response.status === 200) {
        // Find the playerSetup in the gameSetup for the specific player
        const gameSetup = response.data.gameSetup;
        const playerSetup = gameSetup.playerSetup.find(
          (player) => player.playerId === playerId
        );

        if (!playerSetup) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Player setup not found.",
          });
          return;
        }

        const playerName = playerSetup.playerName; // Get the player's name from playerSetup
        const playerNumber = playerSetup.playerNumber; // Get the player's number from player
        Swal.fire({
          icon: "success",
          title: "Stat Saved!",
          text: `You recorded a ${statType} for ${playerName} at position ${position} - No. ${playerNumber}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to save stat. Please try again.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save stat. Please try again.",
      });
    }
  }
});
