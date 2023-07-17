// routes/playerRoutes.js
const express = require("express");
const playerController = require("../controllers/playerController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect); // Middleware to protect routes (user must be logged in)
router.post("/", playerController.createPlayer);
// Get all players created by the logged-in user
router.get(
  "/my-players",
  authController.protect,
  playerController.getAllPlayersCreatedByUser
);
// Get a single player by ID
router.get("/:id", authController.protect, playerController.getOnePlayer);
router.get("/:playerId", playerController.getOnePlayer);
router.patch("/:playerId", playerController.updatePlayer);
router.delete("/:playerId", playerController.deletePlayer);

module.exports = router;
