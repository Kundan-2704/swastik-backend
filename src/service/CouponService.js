// const Coupon = require("../model/Coupon");


// class CouponService {
//   static async getAllCoupons() {
//     return await Coupon.find().sort({ createdAt: -1 });
//   }

//   static async createCoupon(data) {
//     const existing = await Coupon.findOne({ code: data.code });

//     if (existing) {
//       throw new Error("Coupon code already exists");
//     }

//     return await Coupon.create(data);
//   }

//   static async deleteCoupon(id) {
//     return await Coupon.findByIdAndDelete(id);
//   }

//     static async applyCoupon(code, cartTotal) {
//     const coupon = await Coupon.findOne({ code, isActive: true });

//     if (!coupon) {
//       throw new Error("Invalid coupon code");
//     }

//     if (new Date(coupon.expiryDate) < new Date()) {
//       throw new Error("Coupon expired");
//     }

//     if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
//       throw new Error(
//         `Minimum order ₹${coupon.minOrderValue} required`
//       );
//     }

//     let discount = 0;

//     if (coupon.discountType === "PERCENT") {
//       discount = (cartTotal * coupon.discountValue) / 100;

//       if (coupon.maxDiscount) {
//         discount = Math.min(discount, coupon.maxDiscount);
//       }
//     } else {
//       discount = coupon.discountValue;
//     }

//     return {
//       code: coupon.code,
//       discount: Math.round(discount),
//     };
//   }

// }

// module.exports = CouponService;







// const Coupon = require("../model/Coupon");

// class CouponService {

//   static async getAllCoupons() {
//     return await Coupon.find().sort({ createdAt: -1 });
//   }

//   static async createCoupon(data) {
//     const existing = await Coupon.findOne({
//       code: data.code.toUpperCase(),   // ✅ SAFE
//     });

//     if (existing) {
//       throw new Error("Coupon code already exists");
//     }

//     data.code = data.code.toUpperCase(); // ✅ NORMALIZE

//     return await Coupon.create(data);
//   }

//   static async deleteCoupon(id) {
//     return await Coupon.findByIdAndDelete(id);
//   }

//   /* ======================================
//      ✅🔥 APPLY COUPON (HARDENED)
//   ====================================== */
//   static async applyCoupon(code, cartTotal) {

//     if (!code) {
//       throw new Error("Coupon code required");
//     }

//     if (!cartTotal || cartTotal <= 0) {
//       throw new Error("Invalid cart total");
//     }

//     /* ===============================
//        1️⃣ NORMALIZE CODE
//     =============================== */
//     const normalizedCode = code.toUpperCase();

//     const coupon = await Coupon.findOne({
//       code: normalizedCode,
//       isActive: true,
//     });

//     if (!coupon) {
//       throw new Error("Invalid coupon code");
//     }

//     /* ===============================
//        2️⃣ EXPIRY CHECK
//     =============================== */
//     if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
//       throw new Error("Coupon expired");
//     }

//     /* ===============================
//        3️⃣ MIN ORDER CHECK
//     =============================== */
//     if (
//       coupon.minOrderValue &&
//       cartTotal < coupon.minOrderValue
//     ) {
//       throw new Error(
//         `Minimum order ₹${coupon.minOrderValue} required`
//       );
//     }

//     /* ===============================
//        4️⃣ CALCULATE DISCOUNT
//     =============================== */
//     let discount = 0;

//     if (coupon.discountType === "PERCENT") {

//       if (coupon.discountValue <= 0 || coupon.discountValue > 100) {
//         throw new Error("Invalid percentage discount");
//       }

//       discount = (cartTotal * coupon.discountValue) / 100;

//       if (coupon.maxDiscount) {
//         discount = Math.min(discount, coupon.maxDiscount);
//       }

//     } else {

//       if (coupon.discountValue <= 0) {
//         throw new Error("Invalid flat discount");
//       }

//       discount = coupon.discountValue;
//     }

//     /* ===============================
//        5️⃣ SAFETY CLAMP (CRITICAL)
//     =============================== */
//     discount = Math.min(discount, cartTotal); // ✅ NEVER exceed cart

//     return {
//       code: coupon.code,
//       discount: Math.round(discount), // ✅ SAFE rounding
//     };
//   }
// }

// module.exports = CouponService;







const Coupon = require("../model/Coupon");

class CouponService {

  static async getAllCoupons() {
    return await Coupon.find().sort({ createdAt: -1 });
  }

  static async createCoupon(data) {
    if (!data.code) {
      throw new Error("Coupon code required");
    }

    const normalizedCode = data.code.toUpperCase();

    const existing = await Coupon.findOne({ code: normalizedCode });

    if (existing) {
      throw new Error("Coupon code already exists");
    }

    data.code = normalizedCode;

    return await Coupon.create(data);
  }

  static async deleteCoupon(id) {
    return await Coupon.findByIdAndDelete(id);
  }

  /* ================= APPLY COUPON ================= */
  static async applyCoupon(code, cartTotal) {

    if (!code) throw new Error("Coupon code required");
    if (!cartTotal || cartTotal <= 0)
      throw new Error("Invalid cart total");

    const normalizedCode = code.toUpperCase();

    const coupon = await Coupon.findOne({
      code: normalizedCode,
      isActive: true,
    });

    if (!coupon) {
      throw new Error("Invalid coupon code");
    }

    /* ✅ EXPIRY CHECK */
    if (
      coupon.expiryDate &&
      new Date(coupon.expiryDate) < new Date()
    ) {
      throw new Error("Coupon expired");
    }

    /* ✅ MIN ORDER CHECK */
    if (
      coupon.minOrderValue &&
      cartTotal < coupon.minOrderValue
    ) {
      throw new Error(
        `Minimum order ₹${coupon.minOrderValue} required`
      );
    }

    /* ✅ DISCOUNT CALCULATION */
    let discount = 0;

    if (coupon.discountType === "PERCENT") {

      if (
        coupon.discountValue <= 0 ||
        coupon.discountValue > 100
      ) {
        throw new Error("Invalid percentage discount");
      }

      discount = (cartTotal * coupon.discountValue) / 100;

      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }

    } else {

      if (coupon.discountValue <= 0) {
        throw new Error("Invalid flat discount");
      }

      discount = coupon.discountValue;
    }

    /* ✅ SAFETY CLAMP */
    discount = Math.min(discount, cartTotal);

    return {
      code: coupon.code,
      discount: Math.round(discount),
    };
  }
}

module.exports = CouponService;