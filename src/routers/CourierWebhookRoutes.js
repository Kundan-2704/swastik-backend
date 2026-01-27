const express = require("express");
const router = express.Router();
const trackingService = require("../service/TrackingService");
const Order = require("../model/Order");

router.post("/courier", async (req, res) => {
  const { awb, status } = req.body;
  const order = await Order.findOne({ "courier.awb": awb });
  if (!order) return res.sendStatus(200);

  order.courier.status = status;
  await trackingService.updateTracking(order);

  res.sendStatus(200);
});

module.exports = router;
