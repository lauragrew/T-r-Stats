const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.isLoggedIn);

router.get("/", viewsController.getStatsMain);
router.get("/statsSignup", viewsController.getStatsSignup);
router.get("/statsSignup1", viewsController.getStatsSignup1);
router.get("/statsLogin", viewsController.getStatsLogin);
router.get("/gameSetup", viewsController.getGameSetup);

module.exports = router;
