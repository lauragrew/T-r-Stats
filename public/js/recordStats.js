// JS for the recordStat page including a timer function, recording a stat function, fetching the the gamesetup and squad IDs and saving the stat information

document.addEventListener("DOMContentLoaded", () => {
  // Get all the "Record Stat" buttons
  const recordStatButtons = document.querySelectorAll(".record-stat");

  // Add event listener to each button
  recordStatButtons.forEach((button) => {
    button.addEventListener("click", handleRecordStat);
  });

  // Timer function

  // Timer variables
  let timerInterval;
  let timerPaused = false;
  let remainingTime = 30 * 60; // Initial time in seconds (30 minutes)

  // Start/Restart Timer Button click event
  const startTimerBtn = document.getElementById("start-timer-btn");
  startTimerBtn.addEventListener("click", () => {
    // Reset the timer to the selected half duration
    const selectedDuration = document.getElementById(
      "half-duration-dropdown"
    ).value;
    remainingTime = selectedDuration * 60;
    timerPaused = false;

    // Update the timer display
    updateTimerDisplay();

    // Start the timer interval
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
  });

  // Pause Timer Button click event
  const pauseTimerBtn = document.getElementById("pause-timer-btn");
  pauseTimerBtn.addEventListener("click", () => {
    timerPaused = !timerPaused;

    // If the timer is paused, clear the timer interval
    if (timerPaused) {
      clearInterval(timerInterval);
    } else {
      // If the timer is resumed, restart the timer interval
      timerInterval = setInterval(updateTimer, 1000);
    }
  });

  // Timer Reset Button click event
  const resetTimerBtn = document.getElementById("reset-timer-btn");
  resetTimerBtn.addEventListener("click", () => {
    // Reset the timer to the selected half duration
    const selectedDuration = document.getElementById(
      "half-duration-dropdown"
    ).value;
    remainingTime = selectedDuration * 60;
    timerPaused = false;

    // Update the timer display
    updateTimerDisplay();
  });

  // Function to update the timer display
  function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    document.getElementById("timer").textContent = formattedTime;
  }

  // Function to update the timer
  function updateTimer() {
    if (!timerPaused) {
      remainingTime--;

      // If the timer reaches 0, stop the interval and show a message
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        Swal.fire({
          icon: "info",
          title: "Time's Up!",
          text: "The first half has ended. Please start the second half timer.",
        });
      }

      // Update the timer display
      updateTimerDisplay();
    }
  }

  // fucntion to handle recording a stat
  async function handleRecordStat(event) {
    // Get the player ID and position from the button's data attributes
    const playerId = event.target.dataset.playerId;
    const position = event.target.dataset.position;

    // Log the player ID and position to the console for debugging
    console.log("Player ID:", playerId);
    console.log("Position:", position);

    // Fetch the GameSetup ID and Squad ID from the backend - function to fetch this below
    const { gameSetupId, squadId } = await fetchGameSetupAndSquadIds(
      playerId,
      position
    );

    // Create the dropdown menu for stat types
    const statDropdown = document.createElement("select");
    statDropdown.classList.add("stat-dropdown");
    statDropdown.innerHTML = `
      <option value="">-- Select Stat Type --</option>
      <option value="Tackle">Tackle</option>
      <option value="Save">Save</option>
      <option value="Turnover for">Turnover for</option>
      <option value="Turnover Against">Turnover Against</option>
      <option value="Goal">Goal</option>
      <option value="Point">Point</option>
      <option value="Dropped Short">Dropped Short</option>
      <option value="Wide">Wide</option>
      <option value="Free Conceded">Free Conceded</option>
      <option value="Kickout Won">Kickout Won</option>
      <option value="Kickout Lost">Kickout Lost</option>
      <!-- Add more stat types as needed -->
    `;

    // Show the dropdown menu as a SweetAlert modal
    Swal.fire({
      title: `Record Stat for ${position}`,
      html: statDropdown,
      confirmButtonText: "Save",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      preConfirm: () => {
        const statType = statDropdown.value;
        if (!statType) {
          Swal.showValidationMessage("Please select a stat type.");
        }
        return { statType };
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      const { statType } = result.value;
      // Save the stat
      saveStat(gameSetupId, playerId, position, squadId, statType);
    });
  }

  // function to get the gamesetup and squad IDs
  async function fetchGameSetupAndSquadIds(playerId, position, statType) {
    try {
      // Get the gameSetupId from the URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const gameSetupId = urlParams.get("gameSetupId");

      // Make an API request to fetch the gamesetupID and squadID
      const response = await axios.get(
        `/api/v1/stats/fetchGameSetupAndSquadIds?gameSetupId=${gameSetupId}`
      );

      // Take the squadID from the response
      const { squadId } = response.data;

      // Return the gamesetupID and squadID
      return { gameSetupId, squadId };
    } catch (error) {
      // handle errors
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data. Please try again.",
      });
    }
  }

  // function to save a stat to the database with the gamesetupID, playerID, position, squadID and stat type
  async function saveStat(gameSetupId, playerId, position, squadId, statType) {
    try {
      // Make an API request to save the stat
      const response = await axios.post("/api/v1/stats/saveStat", {
        gameSetupId,
        playerId,
        position,
        squadId,
        statType,
      });

      // If the stat is saved successfully, show a success message to the user (sweetAlert)
      Swal.fire({
        icon: "success",
        title: "Stat Saved!",
        text: `You recorded a ${statType} for ${position}.`,
      });
    } catch (error) {
      // handle errors
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save stat. Please try again.",
      });
    }
  }
});
