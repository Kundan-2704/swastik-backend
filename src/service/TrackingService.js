const CourierStatusMap = require("../domain/CourierStatusMap");
const Order = require("../model/Order");
const dummyCourier = require("./courier/DummyCourierService");

class TrackingService {
  async updateTracking(order) {
    const step = order.courier.history.length - 1;
    const newStatus = await dummyCourier.track(order.courier.awb, step);

    order.courier.status = newStatus;
    order.courier.history.push({
      status: newStatus,
      time: new Date(),
      location: "India",
    });
    order.courier.lastUpdated = new Date();

    order.orderStatus = CourierStatusMap[newStatus] || order.orderStatus;

    await order.save();
    return order;
  }
}

module.exports = new TrackingService();
