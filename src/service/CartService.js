




const Cart = require("../model/Cart");
const CartItem = require("../model/CartItem");
const calculatedDiscountPercentage =
  require("../util/calculateDiscountPercenteg.js");

  const FREE_SIZE = "FREE_SIZE";

class CartService {


  async getRawCart(userOrUserId) {
  const userId =
    typeof userOrUserId === "object"
      ? userOrUserId._id
      : userOrUserId;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      cartItems: [],
      totalMrpPrice: 0,
      totalSellingPrice: 0,
      totalItem: 0,
      discount: 0,
      couponCode: null,
      couponDiscount: 0,
      finalAmount: 0,
      shippingCharge: 0,
    });
  }

  return cart;   
}


//   async findUserCart(userOrUserId) {
//   try {
//     const userId =
//       typeof userOrUserId === "object"
//         ? userOrUserId._id
//         : userOrUserId;

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = await Cart.create({
//         user: userId,
//         cartItems: [],
//         totalMrpPrice: 0,
//         totalSellingPrice: 0,
//         totalItem: 0,
//         discount: 0,

//         /* ✅ IMPORTANT DEFAULTS */
//         couponCode: null,
//         couponDiscount: 0,
//         finalAmount: 0,
//         shippingCharge: 0,
//       });
//     }

//     const cartItems = await CartItem.find({ cart: cart._id })
//       .populate({
//         path: "product",
//         populate: {
//           path: "seller",
//           select: "_id",
//         },
//       })
//       .lean();

//     /* 🔥 FILTER INVALID ITEMS */
//     const validCartItems = cartItems.filter(
//       (item) => item.product && item.product.seller
//     );

//     cart.cartItems = validCartItems;

// /* ✅ DO NOT TOUCH DB cartItems */

// let totalMrpPrice = 0;
// let totalSellingPrice = 0;

// validCartItems.forEach((item) => {
//   totalMrpPrice += item.mrpPrice;
//   totalSellingPrice += item.sellingPrice;
// });

// const couponDiscount = cart.couponDiscount || 0;

// const finalCart = {
//   ...cart.toObject(),

//   /* ✅ SAFE RESPONSE DATA */
//   cartItems: validCartItems,

//   totalMrpPrice,
//   totalSellingPrice,
//   totalItem: validCartItems.length,
//   discount: totalMrpPrice - totalSellingPrice,
//   finalAmount:
//     totalSellingPrice - couponDiscount + (cart.shippingCharge || 0),
// };

// await cart.save();  // save totals only
// return finalCart;

//   } catch (error) {
//     console.error("🔴 CRASH INSIDE findUserCart →", error);
//     throw error;
//   }
// }



async findUserCart(userOrUserId) {
  try {
    const cart = await this.getRawCart(userOrUserId);

    const cartItems = await CartItem.find({ cart: cart._id })
      .populate({
        path: "product",
        populate: {
          path: "seller",
          select: "_id",
        },
      })
      .lean();

    const validCartItems = cartItems.filter(
      (item) => item.product && item.product.seller
    );

    let totalMrpPrice = 0;
    let totalSellingPrice = 0;

    validCartItems.forEach((item) => {
      totalMrpPrice += item.mrpPrice;
      totalSellingPrice += item.sellingPrice;
    });

    const couponDiscount = cart.couponDiscount || 0;

    /* ✅ UPDATE ONLY TOTALS */
    cart.totalMrpPrice = totalMrpPrice;
    cart.totalSellingPrice = totalSellingPrice;
    cart.totalItem = validCartItems.length;
    cart.discount = totalMrpPrice - totalSellingPrice;
    cart.finalAmount =
      totalSellingPrice - couponDiscount + (cart.shippingCharge || 0);

    await cart.save();

    /* ✅ SAFE RESPONSE */
    return {
      ...cart.toObject(),
      cartItems: validCartItems,
    };
  } catch (error) {
    console.error("🔴 CRASH INSIDE findUserCart →", error);
    throw error;
  }
}


  async addCartItem(userId, product, size = "FREE_SIZE", quantity) {
  const cart = await this.getRawCart(userId);

  let cartItem = await CartItem.findOne({
    cart: cart._id,
    product: product._id,
    size: size || "FREE_SIZE",
  });

  if (cartItem) {
    // 🔥 INCREASE QUANTITY
    cartItem.quantity += quantity;
    cartItem.sellingPrice += quantity * product.sellingPrice;
    cartItem.mrpPrice += quantity * product.mrpPrice;

    await cartItem.save();
     await this.findUserCart(userId);
    return cartItem;
  }

  // 🆕 CREATE NEW
  cartItem = new CartItem({
    product: product._id,
    quantity,
    userId,
    size,
    cart: cart._id,
    sellingPrice: quantity * product.sellingPrice,
    mrpPrice: quantity * product.mrpPrice,
  });

  const savedItem = await cartItem.save();
  cart.cartItems.push(savedItem._id);
  await cart.save();
 await this.findUserCart(userId);
  return savedItem;
}


}

module.exports = new CartService();
