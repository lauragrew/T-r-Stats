const express = require("express");
const router = express.Router();
const statController = require("../controllers/statController");

router.get(
  "/fetchGameSetupAndSquadIds",
  statController.fetchGameSetupAndSquadIds
);

// Add the route to save a stat
router.post("/saveStat", statController.saveStat);

module.exports = router;
