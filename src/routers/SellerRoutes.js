





const express = require("express");
const router = express.Router();
const sellerController = require("../controller/sellerController");
const sellerMiddleware = require("../middleware/sellerAuthMiddleware");
const Seller = require("../model/Seller");

// ================= SELLER AUTH =================

// ✅ SEND LOGIN OTP (ADDED – REQUIRED)
router.post("/send/login-otp", sellerController.sendLoginOtp);

// ✅ VERIFY LOGIN OTP (ALREADY EXISTING)
router.post("/verify/login-otp", sellerController.verifyLoginOtp);

// ================= SELLER PROFILE =================

router.get("/profile", sellerMiddleware, sellerController.getSellerProfile);
router.post("/", sellerController.createSeller);
router.get("/", sellerController.getAllSellers);

// ✅ ADD THIS LINE (VERY IMPORTANT)
router.get("/:id", sellerController.getSellerById);

router.patch("/", sellerMiddleware, sellerController.updateSellers);
// ================= ADMIN SELLER STATUS UPDATE =================
router.patch(
  "/:id/status",
  sellerController.updateSellerAccountStatus
);

// ✅ YEH ROUTE ADD KARO
router.post("/fcm-token", sellerMiddleware, async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token required" });
    }

    await Seller.findByIdAndUpdate(req.seller._id, { fcmToken });

    res.json({ success: true, message: "Seller FCM token saved ✅" });
  } catch (err) {
    console.error("Seller FCM token save error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
