const cron = require("node-cron");
const Order = require("../model/Order");
const trackingService = require("../service/TrackingService");

cron.schedule("* * * * *", async () => {
  const orders = await Order.find({
    "courier.status": { $ne: "DELIVERED" },
  });

  for (let order of orders) {
    await trackingService.updateTracking(order);
  }
});
