const express = require("express");
const router = express.Router();

const authController = require("../Controllers/authController");
const limiter = require("../Middleware/limiter");

router.route("/signup").post(limiter, authController.signup);
router.route("/login").post(limiter, authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(limiter, authController.logout);
router.route("/forgot-password").post(limiter, authController.forgotPassword);
router.route("/reset-password").post(authController.resetPassword);

module.exports = router;