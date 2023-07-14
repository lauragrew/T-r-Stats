const express = require("express");
const teamController = require("../controllers/teamController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(teamController.getAllTeams)
  .post(authController.restrictTo("user", "coach"), teamController.createTeam);

router
  .route("/:id")
  .get(teamController.getTeam)
  .patch(teamController.updateTeam)
  .delete(teamController.deleteTeam);

module.exports = router;
