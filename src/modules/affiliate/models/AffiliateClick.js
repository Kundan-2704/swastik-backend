const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    affiliateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Affiliate",
    },
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AffiliateClick", schema);