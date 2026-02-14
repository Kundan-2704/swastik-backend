



const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      default: "PERCENTAGE",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // 🔥 VERY IMPORTANT
        required: true,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HomeCategory",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
