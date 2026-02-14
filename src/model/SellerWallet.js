



const mongoose = require("mongoose");

const sellerWalletSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      unique: true,
      index: true
    },

    totalEarnings: {
      type: Number,
      default: 0
    },

    availableBalance: {
      type: Number,
      default: 0
    },

    holdBalance: {
      type: Number,
      default: 0
    },

    lastSettlementAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerWallet", sellerWalletSchema);
