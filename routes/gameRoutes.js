// routes/gameRoutes.js
const express = require("express");
const gameController = require("../controllers/gameController");
const authController = require("../controllers/authController");

const router = express.Router();

// Game setup route
router
  .route("/setup")
  .get(authController.protect, gameController.getAllTeams) // Get all teams for the game setup screen
  .post(authController.protect, gameController.createTeamAndPlayers);

// Add players to a team
router.post(
  "/addPlayerToTeam",
  authController.protect,
  gameController.addPlayerToTeam
);

module.exports = router;
