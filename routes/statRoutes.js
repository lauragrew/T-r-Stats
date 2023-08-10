const express = require("express");
const authController = require("../controllers/authController");
const statController = require("../controllers/statController");

const router = express.Router();

// Middleware to protect routes (user must be logged in)
router.use(authController.protect);

// Route to save a player stat
router.post("/saveStat", statController.saveStat);

module.exports = router;
