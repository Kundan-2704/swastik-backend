// const express = require('express');
// const AuthController = require('../controller/AuthController');
// const router = express.Router();


// router.post("/sent/login-signup-otp", AuthController.sendLoginOtp)

// router.post("/signup", AuthController.createUser)

// router.post('/signin', AuthController.signin)

// module.exports = router;



console.log("✅ AuthRoutes LOADED");

const express = require("express");
const AuthController = require("../controller/AuthController");
const router = express.Router();

router.post("/send/login-signup-otp", AuthController.sendLoginOtp); // ✅ FIX
router.post("/signup", AuthController.createUser);
router.post("/signin", AuthController.signin);

router.post("/google-signup", AuthController.googleSignup);
router.post("/google-login", AuthController.googleLogin);


module.exports = router;
