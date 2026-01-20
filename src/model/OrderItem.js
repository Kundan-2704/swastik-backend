// const { Schema, default: mongoose } = require("mongoose");



// const OrderItemSchema = new Schema({
//     product: {
//         type: Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//     },
//     size: {
//         type: String,
//         required: true
//     },
//     quantity: {
//         type: Number,
//         required: true
//     },
//     mrpPrice: {
//         type: Number,
//         required: true
//     },
//     sellingPrice: {
//         type: Number,
//         required: true
//     },

// }, {
//     timestamps: true
// });

// const OrderItem = mongoose.model('Orderitem', OrderItemSchema);
// module.exports = OrderItem;


const { Schema, default: mongoose } = require("mongoose");

const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  mrpPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
    order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
}, { timestamps: true });

const OrderItem = mongoose.model("OrderItem", OrderItemSchema);
module.exports = OrderItem;
