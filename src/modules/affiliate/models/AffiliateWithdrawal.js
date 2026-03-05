const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    affiliateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
    },

    amount: Number,

    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AffiliateWithdrawal", schema);