const express = require("express");
const playerController = require("../controllers/playerController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post("/createPlayerProfile/:squadId", playerController.createPlayer);
// Route for deleting a player
router.delete("/:playerId", playerController.deletePlayer);

// Define the route handler for getting players by squad
router.get("/", playerController.getPlayersBySquad);

module.exports = router;
