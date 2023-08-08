const express = require("express");
const squadController = require("../controllers/squadController");
const authController = require("../controllers/authController");

const router = express.Router();

// Middleware to protect routes (user must be logged in)
router.use(authController.protect);

// Route to get all squads created by the logged-in user
router.get("/mySquads", squadController.getAllUserSquads);
// Route to create a new squad
router.post("/createSquad", squadController.createSquad);
// Route to delete a squad by ID
router.delete("/:squadId", squadController.deleteSquad);

module.exports = router;
