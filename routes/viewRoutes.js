const express = require("express");
const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

//router.use(authController.isLoggedIn);

// router.get("/", viewsController.getOverview);
// router.get("/tour/:slug", viewsController.getTour);
// router.get("/login", viewsController.getLoginForm);

// FOR MY STATS APP

router.use(authController.isLoggedIn);

router.get("/", viewsController.getStatsMain);
router.get("/statsSignup", viewsController.getStatsSignup);
router.get("/statsSignup1", viewsController.getStatsSignup1);
router.get("/statsLogin", viewsController.getStatsLogin);
module.exports = router;
