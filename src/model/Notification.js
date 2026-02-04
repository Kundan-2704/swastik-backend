// const mongoose = require("mongoose");

// const notificationSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//     role: {
//       type: String,
//       enum: ["admin", "seller", "customer"],
//       required: true,
//     },
//     title: String,
//     message: String,
//     type: String,
//     data: Object,
//     isRead: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// /* 🔥 FINAL SAFETY NET (MOST IMPORTANT) */
// notificationSchema.pre("validate", function (next) {
//   if (!this.role) return next();

//   // normalize anything → enum safe
//   const role = this.role.toString().toLowerCase();

//   if (role.includes("admin")) this.role = "admin";
//   else if (role.includes("seller")) this.role = "seller";
//   else if (role.includes("customer")) this.role = "customer";
//   else this.role = "customer";

//   next();
// });

// module.exports = mongoose.model("Notification", notificationSchema);











const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.role !== "admin";
      },
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

module.exports = mongoose.model("Notification", notificationSchema);
