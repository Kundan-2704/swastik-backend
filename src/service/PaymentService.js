const mongoose = require("mongoose");
const razorpay = require("../config/razorpayClient");

const SellerWallet = require("../model/SellerWallet");
const Order = require("../model/Order");
const PaymentOrder = require("../model/PaymentOrder");
const Payout = require("../model/Payout");

const OrderStatus = require("../domain/OrderStatus");
const PaymentStatus = require("../domain/PaymentStatus");

class PaymentService {

  /* ======================================
     CREATE PAYMENT ORDER (MULTI ORDER)
  ====================================== */
  async createOrder(user, orders) {
    const amount = orders.reduce(
      (sum, order) => sum + order.finalAmount,
      0
    );

    const paymentOrder = new PaymentOrder({
      amount,
      user: user._id,
      orders: orders.map(o => o._id),
      status: PaymentStatus.PENDING
    });

    return await paymentOrder.save();
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await PaymentOrder.findById(orderId);
    if (!paymentOrder) throw new Error("Payment Order not found");
    return paymentOrder;
  }

  async getPaymentOrderByPaymentLinkId(paymentLinkId) {
    const paymentOrder = await PaymentOrder.findOne({ paymentLinkId });
    if (!paymentOrder) throw new Error("Payment Order not found");
    return paymentOrder;
  }

  /* ======================================
     PAYMENT LINK SUCCESS
  ====================================== */
  async proceedPaymentorder(paymentOrder, paymentId) {
    if (paymentOrder.status !== PaymentStatus.PENDING) return false;

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status !== "captured") {
      paymentOrder.status = PaymentStatus.FAILED;
      await paymentOrder.save();
      return false;
    }

    await Promise.all(
      paymentOrder.orders.map(async (orderId) => {
        const order = await Order.findById(orderId);
        if (!order) return;

        order.paymentStatus = PaymentStatus.PAID;
        order.orderStatus = OrderStatus.PLACED;
        await order.save();

        await this.creditSellerWallet(order);
      })
    );

    paymentOrder.status = PaymentStatus.SUCCESS;
    await paymentOrder.save();
    return true;
  }

  /* ======================================
     CREATE RAZORPAY PAYMENT LINK
  ====================================== */
  async createRazorpayPaymentLink(user, amount, orderId) {
    const paymentLink = await razorpay.paymentLink.create({
      amount: amount * 100,
      currency: "INR",
      customer: {
        name: user.fullName,
        email: user.email
      },
      notify: { email: true },
      callback_url: `http://localhost:3000/payment-success/${orderId}`,
      callback_method: "get"
    });

    return paymentLink;
  }

  /* ======================================
     WEBHOOK → CREDIT SELLER WALLET
  ====================================== */
  async creditSellerWallet(order) {

    

    let wallet = await SellerWallet.findOne({ seller: order.seller });

    if (!wallet) {
      wallet = await SellerWallet.create({
        seller: order.seller,
        totalEarnings: 0,
        availableBalance: 0,
        holdBalance: 0,
      });
    }

    const amount = order.finalAmount;

    wallet.totalEarnings += amount;
    wallet.holdBalance += amount; // hold till return window
    await wallet.save();

    return wallet;
  }

  /* ======================================
     RELEASE HOLD AMOUNT (CRON JOB)
  ====================================== */
  async releaseHoldAmount(orderId) {
    const order = await Order.findById(orderId);
    if (!order) return;

    const wallet = await SellerWallet.findOne({ seller: order.seller });
    if (!wallet) return;

    wallet.holdBalance -= order.finalAmount;
    wallet.availableBalance += order.finalAmount;
    await wallet.save();
  }

  /* ======================================
     SELLER DASHBOARD SUMMARY
  ====================================== */
  async getDashboardSummary(sellerId) {
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      throw new Error("Invalid seller id");
    }

    let wallet = await SellerWallet.findOne({ seller: sellerId });

    if (!wallet) {
      wallet = await SellerWallet.create({
        seller: sellerId,
        totalEarnings: 0,
        availableBalance: 0,
        holdBalance: 0,
      });
    }

    return {
      totalEarnings: wallet.totalEarnings,
      available: wallet.availableBalance,
      onHold: wallet.holdBalance,
      nextPayout:
        wallet.availableBalance > 0
          ? {
              amount: wallet.availableBalance,
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            }
          : null,
    };
  }

  /* ======================================
     PAYOUT REQUEST (SELLER)
  ====================================== */
  async createPayoutRequest(sellerId, amount) {
    const wallet = await SellerWallet.findOne({ seller: sellerId });
    if (!wallet || wallet.availableBalance < amount) {
      throw new Error("Insufficient balance");
    }

    wallet.availableBalance -= amount;
    await wallet.save();

    const payout = await Payout.create({
      seller: sellerId,
      amount,
      status: "PENDING",
    });

    return payout;
  }

  /* ======================================
     PAYOUT HISTORY
  ====================================== */
  async getPayoutHistory(sellerId) {
    return await Payout.find({ seller: sellerId }).sort({ createdAt: -1 });
  }
}

module.exports = new PaymentService();
