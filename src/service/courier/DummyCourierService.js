const CourierInterface = require("./CourierInterface");

class DummyCourierService extends CourierInterface {
  async createShipment(order) {
    return {
      partner: "DUMMY",
      shipmentId: "SHIP" + Date.now(),
      awb: "AWB" + Math.floor(Math.random() * 1000000000),
      status: "AWB_GENERATED",
      pickupDate: new Date(Date.now() + 86400000),
      raw: { mode: "TEST" }
    };
  }

  async trackShipment(order) {
    return {
      awb: order.courier.awb,
      status: order.courier.status,
      timeline: [
        "AWB_GENERATED",
        "PICKUP_SCHEDULED",
        "IN_TRANSIT",
        "OUT_FOR_DELIVERY",
        "DELIVERED"
      ]
    };
  }

  async generateLabel(order) {
    return {
      pdfUrl: `/admin/labels/${order._id}.pdf`
    };
  }
}

module.exports = DummyCourierService;
