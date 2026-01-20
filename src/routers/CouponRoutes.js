const express = require("express");
const CouponController = require("../controller/CouponController");
const router = express.Router();

// 🔓 Auth baad me add kar sakte ho
router.get("/admin/all", CouponController.getAllCoupons);
router.post("/admin/create", CouponController.createCoupon);
router.post("/apply", CouponController.applyCoupon);
router.delete("/admin/delete/:id", CouponController.deleteCoupon);

module.exports = router;
