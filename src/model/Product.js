




const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    images: { type: [String], required: true },

    mrpPrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    discountPercent: { type: Number, required: true },

    quantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true },

    // ✅ NEW
    colors: [
      {
        name: { type: String },
        hex: { type: String },
      },
    ],

    sizes: [{ type: String }],

    details: {
      fabric: String,
      weave: String,
      sareeLength: String,
      blousePiece: String,
      care: String,
      origin: String,
    },

    delivery: {
      estimatedDays: String,
      freeShippingAbove: Number,
      codAvailable: Boolean,
      returnDays: Number,
    },

    craftStory: String,

    faqs: [
      {
        question: String,
        answer: String,
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    priority:{
      type: Number,
      default: 0,
      index: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
