const Order = require("../model/Order");

class AdminOrderController {


  async getAllOrders(req, res) {
    try {
      if (
        req.user.role !== "ROLE_ADMIN" &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({ message: "Admin only" });
      }

      const orders = await Order.find()
        .populate("user", "name email")
        .populate(
          "seller",
          "shopName email phone gst city state"
        )
        .sort({ createdAt: -1 });

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate({
        path: "seller",
        select: "sellerName email mobile GSTIN businessDetails pickupAddress",
        populate: {
          path: "pickupAddress",
          select: "address locality city state pinCode",
        },
      });


      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch order",
      });
    }
  }




}

module.exports = new AdminOrderController();
