const express = require("express");
const playerController = require("../controllers/playerController");
const authController = require("../controllers/authController");

const router = express.Router();

// Middleware to protect routes (user must be logged in)
router.use(authController.protect);

// Route for creating a player
router.post("/createPlayerProfile/:squadId", playerController.createPlayer);
// Route for deleting a player
router.delete("/:playerId", playerController.deletePlayer);
// Route for getting players by squad
router.get("/", playerController.getPlayersBySquad);

module.exports = router;
