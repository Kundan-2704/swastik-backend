const Order = require("../model/Order");

class AdminOrderService {
  async getAllOrders() {
    return await Order.find()
      .populate("user", "name email")
      .populate("seller", "shopName email")
      .sort({ createdAt: -1 });
  }

  async getOrdersBySeller(sellerId) {
    return await Order.find({ seller: sellerId })
      .populate("user", "name email")
      .populate("seller", "shopName")
      .sort({ createdAt: -1 });
  }
}

module.exports = new AdminOrderService();
