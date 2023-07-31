const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

// Routes that do not require authentication
router.get("/", viewsController.getStatsMain);
router.get("/statsSignup1", viewsController.getStatsSignup1);
router.get("/statsLogin", viewsController.getStatsLogin);

// Authentication middleware
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

// Route to render the player profile creation page
router.get(
  "/addPlayerProfile/:squadId", // Use the "squadId" parameter in the URL
  authController.protect, // Add the necessary authentication middleware if required
  viewsController.getAddPlayerProfile
);

// Route to display all the game setups for recording games
router.get(
  "/recordGames",
  authController.protect,
  viewsController.getRecordGames
);

// Route to render the "recordStats" page
router.get(
  "/recordStats", // Add the route path here
  authController.protect,
  viewsController.getRecordStats
);

module.exports = router;
