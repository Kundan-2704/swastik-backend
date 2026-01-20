const mongoose = require("mongoose");

const sellerWalletSchema = new mongoose.Schema(
  {
    // seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", unique: true },

    totalEarnings: { type: Number, default: 0 },
    availableBalance: { type: Number, default: 0 },
    holdBalance: { type: Number, default: 0 },

    lastSettlementAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerWallet", sellerWalletSchema);
