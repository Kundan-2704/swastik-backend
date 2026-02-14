

const Order = require("../model/Order");
const courierService = require("../service/courier/DummyCourierService");
const trackingService = require("../service/TrackingService");

class SellerOrderController {
  async  bookCourier(req, res) {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const shipment = await courierService.createShipment(order);

    order.courier = shipment;
    order.orderStatus = "SHIPPED";
    await order.save();

    res.json({ success: true, courier: shipment });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

async  track(req, res) {
  const order = await Order.findById(req.params.orderId);
  if (!order?.courier) return res.status(404).json({ message: "No courier" });

  const updated = await trackingService.updateTracking(order);
  res.json(updated.courier);
};
}

module.exports = new SellerOrderController();