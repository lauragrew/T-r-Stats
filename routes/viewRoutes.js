const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

// Routes that do not require authentication
router.get("/", viewsController.getStatsMain);
router.get("/statsSignup1", viewsController.getStatsSignup1);
router.get("/statsLogin", viewsController.getStatsLogin);

// Authentication middleware - routes below this need to be logged in
router.use(authController.isLoggedIn);

// Protected routes (require authentication)
router.get("/dashboard", authController.protect, viewsController.getDashboard);
router.get(
  "/viewSquads",
  authController.protect,
  viewsController.getViewSquads
);
router.get("/gameSetup", authController.protect, viewsController.getGameSetup);
router.get(
  "/createSquad",
  authController.protect,
  viewsController.getCreateSquad
);

// Route to view players in a squad
router.get(
  "/viewPlayers/:id",
  authController.protect,
  viewsController.getViewPlayers
);

// Route to view player profile
router.get(
  "/addPlayerProfile/:squadId",
  authController.protect,
  viewsController.getAddPlayerProfile
);

// Route to view all the game setups for recording games
router.get(
  "/recordGames",
  authController.protect,
  viewsController.getRecordGames
);

// Route to view the recordStats page
router.get(
  "/recordStats",
  authController.protect,
  viewsController.getRecordStats
);

// route for viewing the gamesetups to then get the stats
router.get("/viewStats", viewsController.viewStats);

// router for viewing the specific stats for a gamesetup
router.get("/gameStats/:gameSetupId", viewsController.viewGameStats);

module.exports = router;
