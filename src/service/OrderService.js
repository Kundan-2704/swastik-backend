




// const mongoose = require("mongoose");
// const Order = require("../model/Order");
// const OrderItem = require("../model/OrderItem");
// const OrderStatus = require("../domain/OrderStatus");

// class OrderService {



//   async createorder(
//   user,
//   shippingAddress,   // ✅ plain object with real values
//   cart,
//   paymentMethod = "COD"
// ) {
//   try {
//     // ===============================
//     // 1️⃣ VALIDATE CART
//     // ===============================
//     if (!cart || !Array.isArray(cart.cartItems) || cart.cartItems.length === 0) {
//       throw new Error("Cart is empty");
//     }

//     // ===============================
//     // 2️⃣ GROUP CART ITEMS BY SELLER
//     // ===============================
//     const itemsBySeller = {};

//     for (const item of cart.cartItems) {

//       // ✅ skip broken cart items (DO NOT CRASH)
//       if (!item.product || !item.product.seller) {
//         console.warn("⚠️ Skipping invalid cart item:", item._id);
//         continue;
//       }

//       const sellerId = item.product.seller._id.toString();

//       if (!itemsBySeller[sellerId]) {
//         itemsBySeller[sellerId] = [];
//       }

//       itemsBySeller[sellerId].push(item);
//     }

//     if (Object.keys(itemsBySeller).length === 0) {
//       throw new Error("No valid items found in cart");
//     }

//     const orders = [];

//     // ===============================
//     // 3️⃣ CREATE ORDER PER SELLER
//     // ===============================
//     for (const sellerId in itemsBySeller) {
//       const cartItems = itemsBySeller[sellerId];

//       let totalMrpPrice = 0;
//       let totalSellingPrice = 0;
//       let totalItem = 0;

//       for (const i of cartItems) {
//         totalMrpPrice += i.mrpPrice * i.quantity;
//         totalSellingPrice += i.sellingPrice * i.quantity;
//         totalItem += i.quantity;
//       }

//       // ===============================
//       // 4️⃣ CREATE ORDER (ADDRESS SNAPSHOT)
//       // ===============================
//       const order = new Order({
//         user: user._id,
//         seller: sellerId,

//         shippingAddress: {
//           name: shippingAddress.name,
//           mobile: shippingAddress.mobile,
//           address: shippingAddress.address,
//           locality: shippingAddress.locality,
//           city: shippingAddress.city,
//           state: shippingAddress.state,
//           pinCode: shippingAddress.pinCode,
//         },

//         orderItems: [],
//         totalMrpPrice,
//         totalSellingPrice,
//         totalItem,
//         paymentMethod,
//         orderStatus: OrderStatus.PENDING,
//       });

//       // ===============================
//       // 5️⃣ CREATE ORDER ITEMS
//       // ===============================
//       for (const cartItem of cartItems) {
//         const orderItem = new OrderItem({
//           product: cartItem.product._id,
//           quantity: cartItem.quantity,
//           sellingPrice: cartItem.sellingPrice,
//           mrpPrice: cartItem.mrpPrice,
//           size: cartItem.size,
//           order: order._id,
//         });

//         const savedItem = await orderItem.save();
//         order.orderItems.push(savedItem._id);
//       }

//       const savedOrder = await order.save();
//       orders.push(savedOrder);
//     }

//     // ===============================
//     // 6️⃣ CLEAR CART
//     // ===============================
//     cart.cartItems = [];
//     await cart.save();

//     return orders;

//   } catch (error) {
//     console.error("❌ ORDER SERVICE ERROR 👉", error);
//     throw error;
//   }
// }



//   // =================================================
//   // ✅ USER ORDER HISTORY
//   // =================================================
//   async usersOrderHistory(userId) {
//     return await Order.find({ user: userId }).populate([
//       { path: "seller" },
//       { path: "orderItems", populate: { path: "product" } },
//     ]);
//   }

//   // =================================================
//   // ✅ SELLER ORDERS
//   // =================================================
//   async getSellersOrders(sellerId) {
//     return await Order.find({ seller: sellerId })
//       .sort({ createdAt: -1 })
//       .populate([
//         { path: "seller" },
//         { path: "orderItems", populate: { path: "product" } },
//       ]);
//   }

//   // =================================================
//   // ✅ UPDATE ORDER STATUS
//   // =================================================
//   // async updateOrderStatus(orderId, orderStatus) {
//   //   const order = await this.findOrderById(orderId);
//   //   order.orderStatus = orderStatus;

//   //   return await Order.findByIdAndUpdate(orderId, order, { new: true }).populate([
//   //     { path: "seller" },
//   //     { path: "orderItems", populate: { path: "product" } },
//   //   ]);
//   // }


//   async updateOrderStatus(orderId, orderStatus) {
//   const order = await this.findOrderById(orderId);

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   // ✅ Optional safety check
//   const allowedStatus = [
//     "PENDING",
//     "PLACED",
//     "SHIPPED",
//     "DELIVERED",
//     "CANCELLED",
//   ];

//   if (!allowedStatus.includes(orderStatus)) {
//     throw new Error("Invalid order status");
//   }

//   order.orderStatus = orderStatus;

//   // ✅ THIS is the key fix
//   await order.save();

//   return await Order.findById(orderId).populate([
//     { path: "seller" },
//     { path: "orderItems", populate: { path: "product" } },
//   ]);
// }


//   // =================================================
//   // ✅ CANCEL ORDER (USER SAFE)
//   // =================================================
//   async cancelOrder(orderId, user) {
//     const order = await this.findOrderById(orderId);

//     if (order.user.toString() !== user._id.toString()) {
//       throw new Error("You cannot cancel this order");
//     }

//     order.orderStatus = OrderStatus.CANCELLED;

//     return await Order.findByIdAndUpdate(orderId, order, { new: true }).populate([
//       { path: "seller" },
//       { path: "orderItems", populate: { path: "product" } },
//     ]);
//   }

//   // =================================================
//   // ✅ FIND ORDER ITEM (SECURE)
//   // =================================================
//   async findOrderItemById(orderItemId, userId) {
//     if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
//       throw new Error("Invalid Order Item ID");
//     }

//     const orderItem = await OrderItem.findById(orderItemId)
//       .populate("product")
//       .populate({
//         path: "order",
//       });

//     if (!orderItem) {
//       throw new Error("Order Item not found");
//     }

//     // 🔐 SECURITY CHECK
//     if (orderItem.order.user.toString() !== userId.toString()) {
//       throw new Error("Unauthorized access to order item");
//     }

//     return orderItem;
//   }
// }

// module.exports = new OrderService();





const mongoose = require("mongoose");
const Order = require("../model/Order");
const OrderItem = require("../model/OrderItem");
const OrderStatus = require("../domain/OrderStatus");
const notificationService = require("./notificationService");

class OrderService {

  // =================================================
  // ✅ CREATE ORDER
  // =================================================



  async createorder(user, shippingAddress, cart, paymentMethod = "COD") {
    try {
      // ===============================
      // 1️⃣ VALIDATE CART
      // ===============================
      if (!cart || !Array.isArray(cart.cartItems) || cart.cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // ===============================
      // 2️⃣ COUPON DATA (FROM CART)
      // ===============================
      const couponCode = cart.appliedCoupon || null;
      const couponDiscount = cart.couponDiscount || 0;

      // ===============================
      // 3️⃣ GROUP ITEMS BY SELLER
      // ===============================
      const itemsBySeller = {};

      for (const item of cart.cartItems) {
        if (!item.product || !item.product.seller) continue;

        const sellerId = item.product.seller._id.toString();
        if (!itemsBySeller[sellerId]) {
          itemsBySeller[sellerId] = [];
        }
        itemsBySeller[sellerId].push(item);
      }

      if (Object.keys(itemsBySeller).length === 0) {
        throw new Error("No valid items found in cart");
      }

      // ===============================
      // 4️⃣ CART SELLING TOTAL (FOR COUPON SPLIT)
      // ===============================
      let cartSellingTotal = 0;
      for (const item of cart.cartItems) {
        cartSellingTotal += item.sellingPrice * item.quantity;
      }

      const orders = [];

      // ===============================
      // 5️⃣ CREATE SELLER-WISE ORDERS
      // ===============================
      let isFirstSeller = true; // 🔥 shipping only once

      for (const sellerId in itemsBySeller) {
        const cartItems = itemsBySeller[sellerId];

        let totalMrpPrice = 0;
        let totalSellingPrice = 0;
        let totalItem = 0;

        for (const i of cartItems) {
          totalMrpPrice += i.mrpPrice * i.quantity;
          totalSellingPrice += i.sellingPrice * i.quantity;
          totalItem += i.quantity;
        }

        // ===============================
        // 6️⃣ COUPON + SHIPPING LOGIC
        // ===============================
        const sellerCouponDiscount = couponDiscount
          ? Math.round((totalSellingPrice / cartSellingTotal) * couponDiscount)
          : 0;

        const shippingCharge = isFirstSeller ? 40 : 0;

        const finalPayable =
          totalSellingPrice - sellerCouponDiscount + shippingCharge;

        // ===============================
        // 7️⃣ CREATE ORDER
        // ===============================
        const order = new Order({
          user: user._id,
          seller: sellerId,

          shippingAddress: {
            name: shippingAddress.name,
            mobile: shippingAddress.mobile,
            address: shippingAddress.address,
            locality: shippingAddress.locality,
            city: shippingAddress.city,
            state: shippingAddress.state,
            pinCode: shippingAddress.pinCode,
          },

          orderItems: [],

          totalMrpPrice,
          totalSellingPrice: finalPayable, // ✅ FINAL PAYABLE
          discount:
            (totalMrpPrice - totalSellingPrice) + sellerCouponDiscount,

          couponCode,
          couponDiscount: sellerCouponDiscount,

          totalItem,
          paymentMethod,
          orderStatus: OrderStatus.PENDING,
        });

        // ===============================
        // 8️⃣ CREATE ORDER ITEMS
        // ===============================
        for (const cartItem of cartItems) {
          const orderItem = new OrderItem({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            sellingPrice: cartItem.sellingPrice,
            mrpPrice: cartItem.mrpPrice,
            size: cartItem.size,
            order: order._id,
          });

          const savedItem = await orderItem.save();
          order.orderItems.push(savedItem._id);
        }

        const savedOrder = await order.save();
        orders.push(savedOrder);

        await notificationService.createNotification({
          userId: sellerId,
          role: "SELLER",
          title: "New Order Received",
          message: `Order #${savedOrder._id} received`,
          type: "ORDER",
          link: `/seller/orders/${savedOrder._id}`,
        });



        isFirstSeller = false; // 🔥 VERY IMPORTANT
      }


      await notificationService.createNotification({
        userId: user._id,
        role: "CUSTOMER",
        title: "Order Placed Successfully",
        message: "Your order has been placed successfully",
        type: "ORDER",
        link: `/orders`,
      });

      // ===============================
      // 9️⃣ CLEAR CART AFTER ORDER
      // ===============================
      cart.cartItems = [];
      cart.appliedCoupon = null;
      cart.couponDiscount = 0;
      await cart.save();

      return orders;

    } catch (error) {
      console.error("❌ ORDER CREATE ERROR:", error);
      throw error;
    }
  }






  // =================================================
  // ✅ USER ORDER HISTORY
  // =================================================
  async usersOrderHistory(userId) {
    return await Order.find({ user: userId }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
    ])
     .sort({ createdAt: -1 }); // ✅ latest order first
  }

  // =================================================
  // ✅ SELLER ORDERS
  // =================================================
  async getSellersOrders(sellerId) {
    return await Order.find({ seller: sellerId })
      .sort({ createdAt: -1 })
      .populate([
        { path: "seller" },
        { path: "orderItems", populate: { path: "product" } },
      ]);
  }

  // =================================================
  // ✅ UPDATE ORDER STATUS (FIXED – NO 400 ERROR)
  // =================================================
  async updateOrderStatus(orderId, orderStatus) {
    const allowedStatus = [
      "PENDING",
      "PLACED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatus.includes(orderStatus)) {
      throw new Error("Invalid order status");
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },                 // ✅ update only one field
      {
        new: true,
        runValidators: false,           // 🔥 IMPORTANT
      }
    ).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
    ]);

    if (!updatedOrder) {
      throw new Error("Order not found");
    }

    return updatedOrder;
  }

  // =================================================
  // ✅ CANCEL ORDER (USER SAFE)
  // =================================================
  async cancelOrder(orderId, user) {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.user.toString() !== user._id.toString()) {
      throw new Error("You cannot cancel this order");
    }

    order.orderStatus = OrderStatus.CANCELLED;

    await order.save({ validateBeforeSave: false });

    return await Order.findById(orderId).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
    ]);
  }

  // =================================================
  // ✅ FIND ORDER ITEM (SECURE)
  // =================================================
  async findOrderItemById(orderItemId, userId) {
    if (!mongoose.Types.ObjectId.isValid(orderItemId)) {
      throw new Error("Invalid Order Item ID");
    }

    const orderItem = await OrderItem.findById(orderItemId)
      .populate("product")
      .populate({ path: "order" });

    if (!orderItem) {
      throw new Error("Order Item not found");
    }

    if (orderItem.order.user.toString() !== userId.toString()) {
      throw new Error("Unauthorized access to order item");
    }

    return orderItem;
  }




}

module.exports = new OrderService();






