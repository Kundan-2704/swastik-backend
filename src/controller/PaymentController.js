const crypto = require("crypto");
const razorpay = require("../config/razorpayClient");
const Order = require("../model/Order");
const PaymentService = require("../service/PaymentService");
const SellerReportService = require("../service/SellerReportService");

const AdminPaymentService = require("../service/AdminPaymentService");

const Cart = require("../model/Cart");

const Address = require("../model/Address");
const CartService = require("../service/CartService");

const OrderService = require("../service/OrderService");


const Notification = require("../model/Notification");
const InvoiceService = require("../service/InvoiceService");

class PaymentController {
  /* =================================================
     1️⃣ CREATE RAZORPAY ORDER
  ================================================== */






async createRazorpayOrder(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || !cart.finalAmount ) {
      return res.status(400).json({ message: "Cart empty" });
    }

       console.log("🛒 Creating Razorpay order for user:", req.user._id);
    console.log("Amount:", cart.finalAmount);

    const amount = Math.round(cart.finalAmount  * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount,
      currency: "INR",
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Payment init failed" });
  }
}


  /* =================================================
     2️⃣ RAZORPAY WEBHOOK (SOURCE OF TRUTH)
  ================================================== */


async razorpayWebhook(req, res) {
  try {


    console.log("🔥 Razorpay Webhook Hit");
    console.log("Headers:", req.headers["x-razorpay-signature"]);
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("❌ WEBHOOK SECRET NOT SET");
      return res.status(500).json({ message: "Server misconfigured" });
    }

    const signature = req.headers["x-razorpay-signature"];
    const body = req.body.toString();

    console.log("📦 Webhook Body:", body);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

      console.log("🔐 Expected Signature:", expectedSignature);
console.log("🔐 Razorpay Signature:", signature);

    if (expectedSignature !== signature) {
        console.log("❌ Signature mismatch");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(body);

    console.log("📢 Event Received:", event.event);

    if (event.event !== "payment.captured") {
      return res.json({ ok: true });
    }

    const payment = event.payload.payment.entity;

    console.log("💳 Payment ID:", payment.id);
console.log("💳 Order ID:", payment.order_id);
console.log("💰 Amount:", payment.amount);

    const order =
      (await Order.findOne({ razorpayOrderId: payment.order_id })) ||
      (await Order.findById(payment.notes?.receipt || payment.receipt));

    if (!order) {
        console.log("⚠️ Order not found");
      return res.json({ ok: true });
    }
    console.log("📦 Order found:", order._id);

    if (order.paymentStatus === "PAID") {
      return res.json({ ok: true });
    }

    order.paymentStatus = "PAID";
    order.orderStatus = "PLACED";
    order.razorpayPaymentId = payment.id;
    await order.save();
    console.log("✅ Order marked as PAID:", order._id);

    console.log("🎉 Webhook processing completed");

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

    return res.json({ ok: true });

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);
    return res.status(500).json({ message: "Webhook error" });
  }
}




async verifyPayment(req, res) {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      addressId,
      paymentGateway,
    } = req.body;

      console.log("🔎 Verify payment called");
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);
    console.log("Gateway:", paymentGateway);

    /* =======================
       1️⃣ VERIFY SIGNATURE
    ======================== */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    /* =======================
       2️⃣ FETCH ADDRESS
    ======================== */
    const addressDoc = await Address.findById(addressId);

    if (!addressDoc) {
      return res.status(404).json({ message: "Address not found" });
    }

    const shippingAddress = {
      name: addressDoc.name,
      mobile: addressDoc.mobile,
      address: addressDoc.address,
      locality: addressDoc.locality,
      city: addressDoc.city,
      state: addressDoc.state,
      pinCode: addressDoc.pinCode, // ⚠️ spelling IMPORTANT
    };


    /* =======================
       3️⃣ FETCH CART
    ======================== */
    const rawCart = await CartService.getRawCart(req.user._id);
    const cart = await CartService.findUserCart(req.user._id);

    if (!cart || !cart.cartItems.length) {
      return res.status(400).json({ message: "Cart empty" });
    }


    /* =======================
       4️⃣ CREATE ORDER
    ======================== */
    const orders = await OrderService.createorder(
      req.user,
      shippingAddress,
      cart,
      paymentGateway
    );

    rawCart.cartItems = [];
rawCart.couponCode = null;
rawCart.couponDiscount = 0;

await rawCart.save();

    /* =======================
       5️⃣ UPDATE STATUS
    ======================== */
    await Order.updateMany(
      { _id: { $in: orders.map(o => o._id) } },
      {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      }
    );


    /* =======================
   6️⃣ GENERATE INVOICE
======================= */
for (const order of orders) {
  await InvoiceService.generate(order._id);
}


    return res.json({ success: true });

  } catch (err) {
    console.error("❌ VERIFY CRASH:", err);
    return res.status(500).json({
      message: "Payment verification failed",
      error: err.message,
    });
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
