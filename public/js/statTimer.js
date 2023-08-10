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
