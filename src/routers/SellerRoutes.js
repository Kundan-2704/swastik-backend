// console.log("✅ SellerRoutes FILE LOADED");
// const express = require('express');
// const router = express.Router();
// const sellerController = require('../controller/sellerController');
// const sellerMiddleware = require('../middleware/sellerAuthMiddleware');




// router.get("/profile", sellerMiddleware ,sellerController.getSellerProfile)
// router.post("/", sellerController.createSeller)
// router.get("/", sellerController.getAllSellers)
// router.patch("/", sellerMiddleware, sellerController.updateSellers)
// router.post("/verify/login-otp", sellerController.verifyLoginOtp)





// module.exports = router




console.log("✅ SellerRoutes FILE LOADED");

const express = require("express");
const router = express.Router();
const sellerController = require("../controller/sellerController");
const sellerMiddleware = require("../middleware/sellerAuthMiddleware");

// ================= SELLER AUTH =================

// ✅ SEND LOGIN OTP (ADDED – REQUIRED)
router.post("/send/login-otp", sellerController.sendLoginOtp);

// ✅ VERIFY LOGIN OTP (ALREADY EXISTING)
router.post("/verify/login-otp", sellerController.verifyLoginOtp);

// ================= SELLER PROFILE =================

router.get("/profile", sellerMiddleware, sellerController.getSellerProfile);
router.post("/", sellerController.createSeller);
router.get("/", sellerController.getAllSellers);
router.patch("/", sellerMiddleware, sellerController.updateSellers);
// ================= ADMIN SELLER STATUS UPDATE =================
router.patch(
  "/:id/status",
  sellerController.updateSellerAccountStatus
);


module.exports = router;
