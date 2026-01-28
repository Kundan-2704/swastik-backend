const mongoose = require("mongoose");

const ReturnRequestSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    images: [String],
    status: {
      type: String,
      enum: [
        "PENDING",
        "APPROVED",
        "REJECTED",
        "PICKED_UP",
        "RECEIVED",
        "REFUNDED",
        "REPLACED"
      ],
      default: "PENDING"
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    adminNote: String,
    sellerNote: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnRequest", ReturnRequestSchema);
