const crypto = require("crypto");
const razorpay = require("../config/razorpayClient");
const Order = require("../model/Order");
const PaymentService = require("../service/PaymentService");
const SellerReportService = require("../service/SellerReportService");

const AdminPaymentService = require("../service/AdminPaymentService");

const Cart = require("../model/Cart");



const Notification = require("../model/Notification");

class PaymentController {
  /* =================================================
     1️⃣ CREATE RAZORPAY ORDER
  ================================================== */
//   async createRazorpayOrder(req, res) {
//     try {
//       const { orderId } = req.body;

//       if (!orderId) {
//         return res.status(400).json({ message: "orderId required" });
//       }

//       const order = await Order.findById(orderId);
//       if (!order) {
//         return res.status(404).json({ message: "Order not found" });
//       }

//       // idempotency
//       if (order.razorpayOrderId) {
//         return res.json({
//           razorpayOrderId: order.razorpayOrderId,
//           amount: Math.round(order.totalSellingPrice * 100),
//           currency: "INR",
//         });
//       }

//       if (!process.env.RAZORPAY_KEY_ID) {
//         throw new Error("Razorpay keys missing in env");
//       }

//       // const razorpayOrder = await razorpay.orders.create({
//       //   amount: Math.round(order.totalSellingPrice * 100), // 🔥 FIX
//       //   currency: "INR",
//       //   receipt: order._id.toString(),
//       // });

//       const razorpayOrder = await razorpay.orders.create({
//   amount:
//     process.env.NODE_ENV === "development"
//       ? 100   // 👈 ₹1 test
//       : order.totalSellingPrice * 100,
//   currency: "INR",
//   receipt: order._id.toString(),
//   payment_capture: 1,
// });


//       order.razorpayOrderId = razorpayOrder.id;
//       await order.save();

//       return res.json({
//         razorpayOrderId: razorpayOrder.id,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//       });
//     } catch (err) {
//       console.error("❌ RAZORPAY ORDER ERROR:", err);
//       res.status(500).json({ message: "Payment init failed" });
//     }
//   }


// async createRazorpayOrder(req, res) {
//   try {
//     const { orderId } = req.body;
//     if (!orderId) {
//       return res.status(400).json({ message: "orderId required" });
//     }

//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // 🔥 DEV MODE: always create new razorpay order
//     if (process.env.NODE_ENV !== "development") {
//       if (order.razorpayOrderId) {
//         return res.json({
//           razorpayOrderId: order.razorpayOrderId,
//           amount: Math.round(order.totalSellingPrice * 100),
//           currency: "INR",
//         });
//       }
//     }

//     const amount =
//       process.env.NODE_ENV === "development"
//         ? 100 // ₹1 test
//         : Math.round(order.totalSellingPrice * 100);

//     const razorpayOrder = await razorpay.orders.create({
//       amount,
//       currency: "INR",
//       receipt: order._id.toString(),
//       payment_capture: 1,
//     });

//     // overwrite old id in dev
//     order.razorpayOrderId = razorpayOrder.id;
//     await order.save();

//     return res.json({
//       razorpayOrderId: razorpayOrder.id,
//       amount: razorpayOrder.amount,
//       currency: razorpayOrder.currency,
//     });
//   } catch (err) {
//     console.error("❌ RAZORPAY ORDER ERROR:", err);
//     res.status(500).json({ message: "Payment init failed" });
//   }
// }



async createRazorpayOrder(req, res) {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.totalSellingPrice) {
      return res.status(400).json({ message: "Cart empty or not ready" });
    }

    const amount = Math.round(cart.totalSellingPrice * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    return res.json({
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: "INR",
    });

  } catch (err) {
    console.error("❌ RAZORPAY ORDER ERROR:", err);
    return res.status(500).json({ message: "Payment init failed" });
  }
}

  /* =================================================
     2️⃣ RAZORPAY WEBHOOK (SOURCE OF TRUTH)
  ================================================== */
//  async razorpayWebhook(req, res) {
//   try {
//     console.log("🔥 WEBHOOK HIT");

//     const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//     const signature = req.headers["x-razorpay-signature"];

//     console.log("👉 Signature header:", signature ? "PRESENT" : "MISSING");

//     const body = req.body.toString();
//     console.log("👉 Raw body received");

//     const expectedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(body)
//       .digest("hex");

//     console.log("👉 Signature match:", expectedSignature === signature);

//     if (expectedSignature !== signature) {
//       console.log("❌ INVALID SIGNATURE");
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     const event = JSON.parse(body);
//     console.log("📦 Event received:", event.event);

//     if (event.event === "payment.captured") {
//       const payment = event.payload.payment.entity;

//       console.log("💰 Payment ID:", payment.id);
//       console.log("🧾 Razorpay Order ID:", payment.order_id);

//       const order = await Order.findOne({
//         razorpayOrderId: payment.order_id,
//       });

//       if (!order) {
//         console.log("⚠️ ORDER NOT FOUND for razorpayOrderId:", payment.order_id);
//         return res.json({ ok: true });
//       }

//       console.log("✅ ORDER FOUND:", order._id.toString());
//       console.log("👤 SELLER ID:", order.seller.toString());
//       console.log("📌 Current payment status:", order.paymentStatus);

//       if (order.paymentStatus === "PAID") {
//         console.log("ℹ️ Already processed, skipping");
//         return res.json({ ok: true });
//       }

//       order.paymentStatus = "PAID";
//       order.orderStatus = "PLACED";
//       order.razorpayPaymentId = payment.id;
//       await order.save();

//       console.log("💾 Order updated in DB");

//       // 🔔 CUSTOMER NOTIFICATION
// await Notification.create({
//   user: order.user,
//   title: "Payment successful",
//   message: `Your payment for order ${order._id} was successful`,
//   link: `/account/orders/${order._id}`,
// });

// // 🔔 SELLER NOTIFICATION
// await Notification.create({
//   user: order.seller,
//   title: "New order received",
//   message: `You received a new order ${order._id}`,
//   link: `/seller/orders/${order._id}`,
// });

// // 🔔 SOCKET EMIT
// global.io.to(order.user.toString()).emit("notification");
// io.to(order.seller.toString()).emit("notification");


//       await PaymentService.creditSellerWallet(order);
//       console.log("💸 Seller wallet credited");

//       await SellerReportService.updateAfterPayment(order);
//       console.log("📊 Seller report updated");
//     }

//     console.log("✅ WEBHOOK COMPLETED SUCCESSFULLY");
//     res.json({ ok: true });

//   } catch (err) {
//     console.error("❌ WEBHOOK ERROR:", err);
//     res.status(500).json({ message: "Webhook error" });
//   }
// }

async razorpayWebhook(req, res) {
  try {
    console.log("🔥 WEBHOOK HIT");

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("❌ WEBHOOK SECRET NOT SET");
      return res.status(500).json({ message: "Server misconfigured" });
    }

    const signature = req.headers["x-razorpay-signature"];
    const body = req.body.toString();

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.log("❌ INVALID SIGNATURE");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(body);
    console.log("📦 Event received:", event.event);

    if (event.event !== "payment.captured") {
      return res.json({ ok: true });
    }

    const payment = event.payload.payment.entity;

    const order =
      (await Order.findOne({ razorpayOrderId: payment.order_id })) ||
      (await Order.findById(payment.notes?.receipt || payment.receipt));

    if (!order) {
      console.log("⚠️ ORDER NOT FOUND:", payment.order_id);
      return res.json({ ok: true });
    }

    if (order.paymentStatus === "PAID") {
      return res.json({ ok: true });
    }

    order.paymentStatus = "PAID";
    order.orderStatus = "PLACED";
    order.razorpayPaymentId = payment.id;
    await order.save();

    /* ==============================
   🔥 ADMIN PAYMENT CREATE
============================== */
await AdminPaymentService.createFromOrder(order, payment);

    await Notification.create({
      user: order.user,
      title: "Payment successful",
      message: `Your payment for order ${order._id} was successful`,
      link: `/account/orders/${order._id}`,
    });

    await Notification.create({
      user: order.seller,
      title: "New order received",
      message: `You received a new order ${order._id}`,
      link: `/seller/orders/${order._id}`,
    });

    global.io?.to(order.user.toString()).emit("notification");
    global.io?.to(order.seller.toString()).emit("notification");

    await PaymentService.creditSellerWallet(order);
    await SellerReportService.updateAfterPayment(order);

    console.log("✅ WEBHOOK COMPLETED SUCCESSFULLY");
    return res.json({ ok: true });

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);
    return res.status(500).json({ message: "Webhook error" });
  }
}

async verifyPayment(req, res) {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({ message: "Verify failed" });
  }
}



  /* =================================================
     3️⃣ SELLER SUMMARY
  ================================================== */
  async getSummary(req, res) {
    try {
      const sellerId = req.seller?._id || req.user?._id;
      const data = await PaymentService.getDashboardSummary(sellerId);
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getHistory(req, res) {
    const data = await PaymentService.getPayoutHistory(req.user._id);
    res.json(data);
  }

  async requestPayout(req, res) {
    try {
      const { amount } = req.body;
      const payout = await PaymentService.createPayoutRequest(
        req.user._id,
        amount
      );
      res.status(201).json({ message: "Payout requested", payout });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new PaymentController();
