// get all the record stat buttons

document.addEventListener("DOMContentLoaded", () => {
  // Get all the "Record Stat" buttons
  const recordStatButtons = document.querySelectorAll(".record-stat");

  // Add event listener to each button
  recordStatButtons.forEach((button) => {
    button.addEventListener("click", handleRecordStat);
  });

  // timer function

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

  async function handleRecordStat(event) {
    // Get the selected stat type from the dropdown menu
    const dropdown = event.target.nextElementSibling;
    const statType = dropdown.value;

    // If no stat type is selected, show an error message
    if (!statType) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please select a stat type.",
      });
      return;
    }

    // Get the player ID and position from the button's data attributes
    const playerId = event.target.dataset.playerId;
    const position = event.target.dataset.position;

    // Log the player ID and position to the console for debugging
    console.log("Player ID:", playerId);
    console.log("Position:", position);

    // Fetch the GameSetup ID and Squad ID from the backend
    const { gameSetupId, squadId } = await fetchGameSetupAndSquadIds(
      playerId,
      position,
      statType
    );

    // Save the stat
    saveStat(gameSetupId, playerId, position, squadId, statType);
  }

  async function fetchGameSetupAndSquadIds(playerId, position, statType) {
    try {
      // Get the gameSetupId from the URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const gameSetupId = urlParams.get("gameSetupId");

      // Make an API request to fetch the required data
      const response = await axios.get(
        `/api/v1/stats/fetchGameSetupAndSquadIds?gameSetupId=${gameSetupId}`
      );

      // Extract the required data from the response
      const { squadId } = response.data; // Remove the second declaration of gameSetupId

      // Return the extracted data
      return { gameSetupId, squadId };
    } catch (error) {
      // If there's an error, show an error message to the user
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data. Please try again.",
      });
    }
  }

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

      // If the stat is saved successfully, show a success message to the user
      Swal.fire({
        icon: "success",
        title: "Stat Saved!",
        text: `You recorded a ${statType} for ${position}.`,
      });
    } catch (error) {
      // If there's an error, show an error message to the user
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save stat. Please try again.",
      });
    }
  }
});
