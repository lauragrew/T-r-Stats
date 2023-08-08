const express = require("express");
const authController = require("../controllers/authController");
const statController = require("../controllers/statController");

const router = express.Router();

// Middleware to protect routes (user must be logged in)
router.use(authController.protect);

// Route to get the gamesetup and squad IDs
router.get(
  "/fetchGameSetupAndSquadIds",
  statController.fetchGameSetupAndSquadIds
);

// Route to save a stat
router.post("/saveStat", statController.saveStat);

module.exports = router;
