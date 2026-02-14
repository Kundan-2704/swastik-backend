





const express = require("express");
const CouponController = require("../controller/CouponController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/admin/all", CouponController.getAllCoupons);
router.post("/admin/create", CouponController.createCoupon);

router.post(
  "/apply",
  authMiddleware,          
  CouponController.applyCoupon
);

router.delete("/admin/delete/:id", CouponController.deleteCoupon);

router.put(
  "/remove",
  authMiddleware,
  CouponController.removeCoupon
);

module.exports = router;