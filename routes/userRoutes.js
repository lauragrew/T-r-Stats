const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const path = require("path");

const router = express.Router();

// Routes to signup/login/logout. (forget and resetpassword - not completed yet on frontend)
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// protects all the routes that comes after this point
router.use(authController.protect);

// Routes to update passwird, get user, update and delete user (themselves) - not completed yet on frontend
router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// restricts all routes that come after this to having to be admin to perform actions (not used - need to change this)
router.use(authController.restrictTo("admin"));

// Routes to do things with all users and individual users
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
