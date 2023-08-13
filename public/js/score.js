// Get the home and opposition score elements
const homeScoreText = document.querySelector("#home-score-text");
const oppositionScoreText = document.querySelector("#opposition-score-text");

// Initial scores
let homeScoreGoal = 0;
let homeScorePoint = 0;
let oppositionScoreGoal = 0;
let oppositionScorePoint = 0;

// Function to update the score display
function updateScoreDisplay() {
  homeScoreText.textContent = `${homeScoreGoal}:${homeScorePoint}`;
  oppositionScoreText.textContent = `${oppositionScoreGoal}:${oppositionScorePoint}`;
}

// Function to handle recording a goal for the home team
function recordHomeTeamGoal() {
  homeScoreGoal += 1;
  updateScoreDisplay();
}

// Function to handle recording a point for the home team
function recordHomeTeamPoint() {
  homeScorePoint += 1;
  updateScoreDisplay();
}

// Function to handle recording a goal for the opposition team
function recordOppositionTeamGoal() {
  oppositionScoreGoal += 1;
  updateScoreDisplay();
}

// Function to handle recording a point for the opposition team
function recordOppositionTeamPoint() {
  oppositionScorePoint += 1;
  updateScoreDisplay();
}

// Function to reset scores for the home team
function resetHomeTeamScores() {
  homeScoreGoal = 0;
  homeScorePoint = 0;
  updateScoreDisplay();
}

// Function to reset scores for the opposition team
function resetOppositionTeamScores() {
  oppositionScoreGoal = 0;
  oppositionScorePoint = 0;
  updateScoreDisplay();
}

// Attach click event listeners to the buttons
const selectedTeamGoalButton = document.querySelector(
  "#record-selected-team-goal"
);
const selectedTeamPointButton = document.querySelector(
  "#record-selected-team-point"
);
const oppositionTeamGoalButton = document.querySelector(
  "#record-opposition-team-goal"
);
const oppositionTeamPointButton = document.querySelector(
  "#record-opposition-team-point"
);
const resetHomeTeamButton = document.querySelector("#reset-home-team-scores");
const resetOppositionTeamButton = document.querySelector(
  "#reset-opposition-team-scores"
);

selectedTeamGoalButton.addEventListener("click", recordHomeTeamGoal);
selectedTeamPointButton.addEventListener("click", recordHomeTeamPoint);
oppositionTeamGoalButton.addEventListener("click", recordOppositionTeamGoal);
oppositionTeamPointButton.addEventListener("click", recordOppositionTeamPoint);
resetHomeTeamButton.addEventListener("click", resetHomeTeamScores);
resetOppositionTeamButton.addEventListener("click", resetOppositionTeamScores);
