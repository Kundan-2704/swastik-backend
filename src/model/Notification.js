



const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },

    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: String,

    isRead: {
      type: Boolean,
      default: false,
    },

    link: String,
  },
  { timestamps: true }
);

/* 🔥 ROLE NORMALIZATION */
notificationSchema.pre("validate", function (next) {
  if (!this.role) return next();

  const r = this.role.toLowerCase();

  if (r.includes("admin")) this.role = "admin";
  else if (r.includes("seller")) this.role = "seller";
  else this.role = "customer";

  next();
});

/* ✅ SAFE VALIDATION */
notificationSchema.pre("validate", function (next) {

  if (this.role === "customer" && !this.userId) {
    return next(new Error("Customer notification needs userId"));
  }

  if (this.role === "seller" && !this.sellerId) {
    return next(new Error("Seller notification needs sellerId"));
  }

  next();
});

module.exports = mongoose.model("Notification", notificationSchema);