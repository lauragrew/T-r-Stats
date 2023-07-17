// routes/teamRoutes.js
const express = require("express");
const teamController = require("../controllers/teamController");
const authController = require("../controllers/authController");
const Team = require("../models/teamModel"); // Add this line
const Player = require("../models/playerModel"); // Add this line

const router = express.Router();

router.use(authController.protect); // Middleware to protect routes (user must be logged in)

router
  .route("/")
  .post(teamController.createTeamWithPlayers)
  .get(teamController.getAllTeams);
router
  .route("/:id")
  .get(teamController.getOneTeam)

  .delete(teamController.deleteTeam)
  .patch(teamController.updateTeam);

// Get all players in a specific team
router.get("/:teamId/players", teamController.getAllPlayersInTeam);

router.post("/player", teamController.updatePlayerNumber);

module.exports = router;
