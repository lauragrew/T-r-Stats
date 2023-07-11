const express = require("express");
const playerController = require("../controllers/playerController");
const authController = require("../controllers/authController");

// Create routes for the player-related operations. Inside the routes folder, create a new file called playerRoutes.js. This file will define the routes and associate them with the corresponding controller functions.

const router = express.Router();

// Protect all the routes that come after this point
router.use(authController.protect);

router
  .route("/")
  .get(playerController.getAllPlayers)
  .post(playerController.createPlayer);

router
  .route("/:id")
  .get(playerController.getPlayer)
  .patch(playerController.updatePlayer)
  .delete(playerController.deletePlayer);

module.exports = router;
