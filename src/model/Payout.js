const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "paid", "failed", "rejected"],
      default: "pending",
    },

    method: {
      type: String,
      enum: ["bank", "upi"],
      required: true,
    },

    bankDetails: {
      accountHolder: String,
      accountNumber: String,
      ifsc: String,
      bankName: String,
    },

    upiId: String,

    remark: String,

    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    processedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
