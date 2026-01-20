const CouponService = require("../service/CouponService");


class CouponController {
  // GET /api/coupons/admin/all
  static async getAllCoupons(req, res) {
    try {
      const coupons = await CouponService.getAllCoupons();

      // IMPORTANT: empty list is valid
      return res.status(200).json(coupons);
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to fetch coupons",
      });
    }
  }

  // POST /api/coupons/admin/create
  static async createCoupon(req, res) {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      return res.status(201).json(coupon);
    } catch (error) {
      return res.status(400).json({
        message: error.message || "Failed to create coupon",
      });
    }
  }

  static async applyCoupon(req, res) {
  try {
    const { code, cartTotal } = req.body;

    const result = await CouponService.applyCoupon(
      code,
      cartTotal
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}


  // DELETE /api/coupons/admin/delete/:id
  static async deleteCoupon(req, res) {
    try {
      await CouponService.deleteCoupon(req.params.id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to delete coupon",
      });
    }
  }
}

module.exports = CouponController;
