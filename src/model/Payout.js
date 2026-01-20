const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: Number,
    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    payoutDate: Date,
    razorpayPayoutId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payout", payoutSchema);
