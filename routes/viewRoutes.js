const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

// Routes that do not require authentication
router.get("/", viewsController.getStatsMain);
router.get("/statsSignup1", viewsController.getStatsSignup1);
router.get("/statsLogin", viewsController.getStatsLogin);
router.get("/forgotPassword", viewsController.getForgotPassword);
router.get("/about", viewsController.getAboutPage);

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
router.get("/viewStats", authController.protect, viewsController.viewStats);

// route for viewing the specific stats for a gamesetup
router.get(
  "/gameStats/:gameSetupId",
  authController.protect,
  viewsController.viewGameStats
);

// route for fetching a specific player's stats for chart view
router.get(
  "/viewPlayerChart/:playerSetupId",
  authController.protect,
  viewsController.viewPlayerChart
);

//route for fetching player stats
router.get(
  "/fetchPlayerStats/:playerSetupId",
  viewsController.fetchPlayerStats
);

// route for viewing the total stats chart page
router.get(
  "/viewTotalStatsChart/:gameSetupId",
  authController.protect,
  viewsController.viewTotalStatsChart
);

// route to view the stat trends
router.get(
  "/viewStatTrends",
  authController.protect,
  viewsController.viewStatTrends
);

// Profile Page
router.get("/profile", authController.protect, viewsController.getProfilePage);

// Profile Page
router.get(
  "/updatePassword",
  authController.protect,
  viewsController.getUpdatePassword
);

// Profile Page
router.get(
  "/instructions",
  authController.protect,
  viewsController.getInstruction
);

module.exports = router;
