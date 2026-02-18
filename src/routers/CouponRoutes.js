





const express = require("express");
const CouponController = require("../controller/CouponController");
const authMiddleware = require("../middleware/authMiddleware");
const apicache = require("apicache");

const router = express.Router();
const cache = apicache.middleware;

router.get("/admin/all", cache("30 seconds"), CouponController.getAllCoupons);
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