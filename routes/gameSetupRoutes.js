const express = require("express");
const gameSetupController = require("../controllers/gameSetupController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.post("/", gameSetupController.saveGameSetup);

// Route for deleting a game setup by its ID
router.delete("/:gameSetupId", gameSetupController.deleteGameSetup);

module.exports = router;
