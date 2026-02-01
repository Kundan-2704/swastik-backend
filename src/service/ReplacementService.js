const Order = require("../model/Order");

class ReplacementService {

  /* CUSTOMER */
  async requestReplacement({ orderId, userId, reason }) {
    const order = await Order.findById(orderId);

    if (!order) throw new Error("Order not found");

    if (order.replacement)
      throw new Error("Replacement already requested");

    // Check if within 7 days of delivery

    const deliveredAt = order.shipping?.deliveredDate || order.shipping?.updatedAt || order.updatedAt;

if (!deliveredAt) {
  throw new Error("Order not delivered yet");
}

// 🔹 time remove (important)
const delivered = new Date(deliveredAt);
delivered.setHours(0, 0, 0, 0);

const today = new Date();
today.setHours(0, 0, 0, 0);

const diffDays =
  (today.getTime() - delivered.getTime()) / (1000 * 60 * 60 * 24);

if (diffDays > 7) {
  throw new Error("Replacement window closed (7 days)");
}


// 🔹 time remove (important) end

    order.replacement = {
      reason,
      requestedBy: userId,
      status: "REQUESTED",
      requestedAt: new Date()
    };

    await order.save();
    return order;
  }

  /* SELLER / ADMIN */
  async approveReplacement({ orderId, sellerNote }) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.replacement.status = "APPROVED";
    order.replacement.approvedAt = new Date();
    order.replacement.sellerNote = sellerNote;

    await order.save();
    return order;
  }

  async rejectReplacement({ orderId, note }) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.replacement.status = "REJECTED";
    order.replacement.rejectedAt = new Date();
    order.replacement.sellerNote = note;

    await order.save();
    return order;
  }

  async pickupOldProduct({ orderId, awb, courier }) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.replacement.status = "PICKED_UP";
    order.replacement.pickup = {
      awb,
      courier,
      pickedUpAt: new Date()
    };

    await order.save();
    return order;
  }

  async shipReplacement({ orderId, awb, courier }) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.replacement.status = "SHIPPED";
    order.replacement.replacementShipment = {
      awb,
      courier,
      shippedAt: new Date()
    };

    await order.save();
    return order;
  }

  async deliverReplacement({ orderId }) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.replacement.status = "DELIVERED";
    order.replacement.replacementShipment.deliveredAt = new Date();

    await order.save();
    return order;
  }

  async completeReplacement({ orderId }) {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.replacement.status = "COMPLETED";
    await order.save();

    return order;
  }
}

module.exports = new ReplacementService();
