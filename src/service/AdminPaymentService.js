const AdminPayment = require("../model/AdminPayment");
const Order = require("../model/Order");

class AdminPaymentService {

  // ✅ create admin payment when order placed
  static async createFromOrder(order, paymentEntity) {

    // already exists (idempotency)
    const existing = await AdminPayment.findOne({ order: order._id });
    if (existing) return existing;

    const sellers = order.items.map(item => {
      const commission = Math.round(item.price * 0.1); // example 10%
      const sellerEarning = item.price - commission;

      return {
        seller: item.seller,
        amount: item.price,
        commission,
        sellerEarning,
      };
    });

    const adminPayment = await AdminPayment.create({
      order: order._id,
      customer: order.user,
      totalAmount: order.totalSellingPrice,
      paymentMode: order.paymentMode,
      gateway: "razorpay",
      gatewayPaymentId: paymentEntity.id,
      gatewayOrderId: paymentEntity.order_id,
      status: "SUCCESS",
      sellers,
      rawGatewayPayload: paymentEntity,
    });

    return adminPayment;
  }

  // 📊 admin dashboard list
  static async list({ page = 1, limit = 20 }) {
    return AdminPayment.find()
      .populate("order customer sellers.seller")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  // 🔍 single payment
  static async getById(id) {
    return AdminPayment.findById(id)
      .populate("order customer sellers.seller");
  }
}

module.exports = AdminPaymentService;
