// models/notification.model.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "role",
    },
userId: {
  type: mongoose.Schema.Types.ObjectId,
  required: function () {
    return this.role !== "ADMIN";
  },
  refPath: "role",
},

    role: {
      type: String,
      enum: ["ADMIN", "SELLER", "CUSTOMER"],
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    type: {
      type: String,
      enum: ["ORDER", "PAYMENT", "PAYOUT", "PRODUCT", "REVIEW", "SYSTEM", "KYC"],
      default: "SYSTEM",
    },

    link: String,

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
