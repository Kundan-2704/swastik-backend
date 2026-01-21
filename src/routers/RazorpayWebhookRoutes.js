const express = require("express");
const PaymentController = require("../controller/PaymentController");

const router = express.Router();

router.post(
  "/razorpay/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.razorpayWebhook
);

module.exports = router;
