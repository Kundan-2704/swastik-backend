// const CouponService = require("../service/CouponService");


// class CouponController {
//   // GET /api/coupons/admin/all
//   static async getAllCoupons(req, res) {
//     try {
//       const coupons = await CouponService.getAllCoupons();

//       // IMPORTANT: empty list is valid
//       return res.status(200).json(coupons);
//     } catch (error) {
//       return res.status(500).json({
//         message: error.message || "Failed to fetch coupons",
//       });
//     }
//   }

//   // POST /api/coupons/admin/create
//   static async createCoupon(req, res) {
//     try {
//       const coupon = await CouponService.createCoupon(req.body);
//       return res.status(201).json(coupon);
//     } catch (error) {
//       return res.status(400).json({
//         message: error.message || "Failed to create coupon",
//       });
//     }
//   }

//   static async applyCoupon(req, res) {
//   try {
//     const { code, cartTotal } = req.body;

//     const result = await CouponService.applyCoupon(
//       code,
//       cartTotal
//     );

//     return res.status(200).json(result);
//   } catch (error) {
//     return res.status(400).json({
//       message: error.message,
//     });
//   }
// }


//   // DELETE /api/coupons/admin/delete/:id
//   static async deleteCoupon(req, res) {
//     try {
//       await CouponService.deleteCoupon(req.params.id);
//       return res.status(200).json({ success: true });
//     } catch (error) {
//       return res.status(500).json({
//         message: error.message || "Failed to delete coupon",
//       });
//     }
//   }
// }

// module.exports = CouponController;






// const CouponService = require("../service/CouponService");
// const CartService = require("../service/CartService");

// /* OPTIONAL (only if you directly use Cart model elsewhere) */
// // const Cart = require("../model/Cart");

// class CouponController {

//   // GET /api/coupons/admin/all
//   static async getAllCoupons(req, res) {
//     try {
//       const coupons = await CouponService.getAllCoupons();
//       return res.status(200).json(coupons);
//     } catch (error) {
//       return res.status(500).json({
//         message: error.message || "Failed to fetch coupons",
//       });
//     }
//   }

//   // POST /api/coupons/admin/create
//   static async createCoupon(req, res) {
//     try {
//       const coupon = await CouponService.createCoupon(req.body);
//       return res.status(201).json(coupon);
//     } catch (error) {
//       return res.status(400).json({
//         message: error.message || "Failed to create coupon",
//       });
//     }
//   }

//   // ✅🔥 APPLY COUPON (FIXED)
//  static async applyCoupon(req, res) {
//   try {
//     const user = req.user;
//     const { code } = req.body;

//     if (!code) {
//       throw new Error("Coupon code required");
//     }

//     /* ===============================
//        1️⃣ FETCH USER CART
//     =============================== */
//     const cart = await CartService.findUserCart(user._id);

//     if (!cart || cart.totalSellingPrice <= 0) {
//       throw new Error("Cart empty");
//     }

//     /* ===============================
//        2️⃣ APPLY COUPON LOGIC
//     =============================== */
//     const result = await CouponService.applyCoupon(
//       code,
//       cart.totalSellingPrice
//     );

//     /* ===============================
//        3️⃣ UPDATE CART 🔥🔥🔥
//     =============================== */
//     cart.couponCode = result.code;
//     cart.couponDiscount = result.discount;

//     cart.finalAmount =
//       cart.totalSellingPrice - result.discount + (cart.shippingCharge || 0);

//     await cart.save();

//     return res.status(200).json(result);

//   } catch (error) {
//     return res.status(400).json({
//       message: error.message,
//     });
//   }
// }

//   // DELETE /api/coupons/admin/delete/:id
//   static async deleteCoupon(req, res) {
//     try {
//       await CouponService.deleteCoupon(req.params.id);
//       return res.status(200).json({ success: true });
//     } catch (error) {
//       return res.status(500).json({
//         message: error.message || "Failed to delete coupon",
//       });
//     }
//   }
// }

// module.exports = CouponController;






const CouponService = require("../service/CouponService");
const CartService = require("../service/CartService");

class CouponController {

  /* ================= GET ALL ================= */
  static async getAllCoupons(req, res) {
    try {
      const coupons = await CouponService.getAllCoupons();
      return res.status(200).json(coupons);
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to fetch coupons",
      });
    }
  }

  /* ================= CREATE ================= */
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

  /* ================= APPLY COUPON ================= */
  static async applyCoupon(req, res) {
    try {
      const user = req.user;
      const { code } = req.body;

      if (!code) {
        throw new Error("Coupon code required");
      }

      const cart = await CartService.findUserCart(user._id);

      if (!cart || cart.totalSellingPrice <= 0) {
        throw new Error("Cart empty");
      }

      const result = await CouponService.applyCoupon(
        code,
        cart.totalSellingPrice
      );

      /* ✅ RESET PREVIOUS COUPON SAFELY */
      cart.couponCode = result.code;
      cart.couponDiscount = result.discount;

      /* ✅ FINAL AMOUNT CALCULATION */
      cart.finalAmount = Math.max(
        cart.totalSellingPrice
          - result.discount
          + (cart.shippingCharge || 0),
        0
      );

      await cart.save();

      /* ✅🔥 CRITICAL FIX → RETURN UPDATED CART */
      return res.status(200).json(cart);

    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  /* ================= REMOVE COUPON ================= */
  static async removeCoupon(req, res) {
    try {
      const user = req.user;

      const cart = await CartService.findUserCart(user._id);

      if (!cart) {
        throw new Error("Cart not found");
      }

      /* ✅ RESET COUPON */
      cart.couponCode = null;
      cart.couponDiscount = 0;

      /* ✅ RECALCULATE TOTAL */
      cart.finalAmount = Math.max(
        cart.totalSellingPrice + (cart.shippingCharge || 0),
        0
      );

      await cart.save();

      return res.status(200).json(cart);

    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  }

  /* ================= DELETE ================= */
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