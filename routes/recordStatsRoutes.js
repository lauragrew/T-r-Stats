// routes/recordStatsRoutes.js
const express = require("express");
const router = express.Router();
const recordStatsController = require("../controllers/recordStatsController");
const authController = require("../controllers/authController");

// Route to record a new game stat
router.post(
  "/recordStats",
  authController.protect,
  recordStatsController.recordGameStat
);

// Route to fetch game stats for a specific game setup
router.get(
  "/recordStats",
  authController.protect,
  recordStatsController.getGameStatsByGameSetup
);

module.exports = router;
