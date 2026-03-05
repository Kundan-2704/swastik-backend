const mongoose = require("mongoose");

const affiliateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    referralCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    commissionRate: {
      type: Number,
      default: 10,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    pendingEarnings: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Affiliate", affiliateSchema);