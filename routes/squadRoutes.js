const express = require("express");
const squadController = require("../controllers/squadController");
const authController = require("../controllers/authController");
const Squad = require("../models/squadModel");
const Player = require("../models/playerModel"); // Add this line

const router = express.Router();

router.use(authController.protect); // Middleware to protect routes (user must be logged in)

router.get("/mySquads", squadController.getAllUserSquads); // Route to get all squads created by the logged-in user

router.post("/createSquad", squadController.createSquad); // Route to create a new squad

// Route to handle DELETE request to delete a squad by ID
router.delete("/:squadId", squadController.deleteSquad);

module.exports = router;
