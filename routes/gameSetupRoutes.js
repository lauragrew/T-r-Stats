const express = require("express");
const gameSetupController = require("../controllers/gameSetupController");
const authController = require("../controllers/authController");

const router = express.Router();

// Middleware to protect routes (user must be logged in)
router.use(authController.protect);

// Route for saving a gamesetup
router.post("/", gameSetupController.saveGameSetup);

// Route for deleting a game setup by its ID
router.delete("/:gameSetupId", gameSetupController.deleteGameSetup);

module.exports = router;
