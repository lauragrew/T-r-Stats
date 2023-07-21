const express = require("express");
const squadController = require("../controllers/squadController");
const authController = require("../controllers/authController");
const Squad = require("../models/squadModel");
const Player = require("../models/playerModel"); // Add this line

const router = express.Router();

router.use(authController.protect); // Middleware to protect routes (user must be logged in)

router.get("/mySquads", squadController.getAllUserSquads); // Route to get all squads created by the logged-in user

router.post("/createSquad", squadController.createSquad); // Route to create a new squad

router
  .route("/:id")
  .get(squadController.getSquadById) // Route to get a single squad by its ID
  .patch(squadController.updateSquad) // Route to update a squad
  .delete(squadController.deleteSquad); // Route to delete a squad

module.exports = router;
