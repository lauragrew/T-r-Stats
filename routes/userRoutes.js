const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const viewsController = require("../controllers/viewsController");
const path = require("path");

const router = express.Router();

// Routes to signup/login/logout. (forget and resetpassword - not completed yet on frontend)
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);

// routes to view and reset the
router
  .route("/resetPassword/:token")
  .get(viewsController.getResetPassword) // Render the reset password page
  .patch(authController.resetPassword); // Handle password reset

// protects all the routes that comes after this point
router.use(authController.protect);

// Routes that do not require admin role
router.get("/logout", authController.logout);
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// Routes that require admin role
router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
