const express = require("express");
const teamController = require("../controllers/teamController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(teamController.getAllTeams)
  .post(teamController.createTeam);

router
  .route("/:id")
  .get(teamController.getTeam)
  .delete(teamController.deleteTeam);

module.exports = router;
