// timer variables
let timerInterval;
let timerPaused = false;
let remainingTime = 30 * 60; // Initial time in seconds (30 minutes)

// start/restart timer button click event
const startTimerBtn = document.getElementById("start-timer-btn");
startTimerBtn.addEventListener("click", () => {
  // reset the timer to the selected half duration
  const selectedDuration = document.getElementById(
    "half-duration-dropdown"
  ).value;
  remainingTime = selectedDuration * 60;
  timerPaused = false;

  // update the timer display
  updateTimerDisplay();

  // start the timer
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
});

// pause timer button click
const pauseTimerBtn = document.getElementById("pause-timer-btn");
pauseTimerBtn.addEventListener("click", () => {
  timerPaused = !timerPaused;

  // if the timer is paused, clear the timer
  if (timerPaused) {
    clearInterval(timerInterval);
  } else {
    // if the timer is resumed, restart the timer
    timerInterval = setInterval(updateTimer, 1000);
  }
});

// timer reset button click
const resetTimerBtn = document.getElementById("reset-timer-btn");
resetTimerBtn.addEventListener("click", () => {
  // reset the timer to the selected half duration
  const selectedDuration = document.getElementById(
    "half-duration-dropdown"
  ).value;
  remainingTime = selectedDuration * 60;
  timerPaused = false;

  // update the timer display
  updateTimerDisplay();
});

// function to update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  document.getElementById("timer").textContent = formattedTime;
}

// function to update the timer
function updateTimer() {
  if (!timerPaused) {
    remainingTime--;

    // if the timer reaches 0, stop the interval and show a message
    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      Swal.fire({
        icon: "info",
        title: "Time's Up!",
        text: "The first half has ended. Please start the second half timer.",
      });
    }

    // update the timer display
    updateTimerDisplay();
  }
}
