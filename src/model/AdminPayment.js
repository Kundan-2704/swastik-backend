const mongoose = require("mongoose");

const adminPaymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },

  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  totalAmount: { type: Number, required: true },

  paymentMode: {
    type: String,
    enum: ["ONLINE", "COD"],
    required: true,
  },

  gateway: {
    type: String,
    default: null, // razorpay / stripe
  },

  gatewayPaymentId: String,
  gatewayOrderId: String,

  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },

  // 🔥 seller wise breakup (MOST IMPORTANT)
  sellers: [
    {
      seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: Number,
      commission: Number,
      sellerEarning: Number,
    },
  ],

  rawGatewayPayload: Object, // audit proof
}, { timestamps: true });

module.exports = mongoose.model("AdminPayment", adminPaymentSchema);
