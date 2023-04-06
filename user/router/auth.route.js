const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const authValidation = require("../validator/auth.validator");
const { verifyJWTToken } = require("../../middleware/jwt.middleware");

router.post("/register",authValidation.register, authController.register);
router.post("/login", authValidation.login, authController.login);
router.post("/verify-otp", authValidation.verifyOtp, verifyJWTToken,  authController.verifyOtp);

module.exports = router;
