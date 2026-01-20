const Coupon = require("../model/Coupon");


class CouponService {
  static async getAllCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  static async createCoupon(data) {
    const existing = await Coupon.findOne({ code: data.code });

    if (existing) {
      throw new Error("Coupon code already exists");
    }

    return await Coupon.create(data);
  }

  static async deleteCoupon(id) {
    return await Coupon.findByIdAndDelete(id);
  }

    static async applyCoupon(code, cartTotal) {
    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    if (new Date(coupon.expiryDate) < new Date()) {
      throw new Error("Coupon expired");
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      throw new Error(
        `Minimum order ₹${coupon.minOrderValue} required`
      );
    }

    let discount = 0;

    if (coupon.discountType === "PERCENT") {
      discount = (cartTotal * coupon.discountValue) / 100;

      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      code: coupon.code,
      discount: Math.round(discount),
    };
  }

}

module.exports = CouponService;
