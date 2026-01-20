const mongoose = require("mongoose");

const sellerBankSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    accountNumber: String,
    ifsc: String,
    upiId: String,
    isConnected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerBank", sellerBankSchema);
