

const { Schema, default: mongoose } = require("mongoose");

const cartItemsSchema = new Schema({
    cart: {
        type: Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    mrpPrice: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId, // ✅ fixed
        ref: "User",
        required: true
    }
}, { timestamps: true }); // ✅ added optional timestamps

const CartItem = mongoose.model("CartItem", cartItemsSchema);

module.exports = CartItem;
