const express = require("express");
const playerController = require("../controllers/playerController");
const authController = require("../controllers/authController");
const viewsController = require("../controllers/viewsController");

const router = express.Router();

router.use(authController.protect);

// Make sure the route is defined as POST
router.post("/createPlayerProfile/:squadId", playerController.createPlayer);

module.exports = router;
