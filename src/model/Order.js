const mongoose = require("mongoose");
const OrderStatus = require("../domain/OrderStatus");
const PaymentStatus = require("../domain/PaymentStatus");



const replacementSchema = new mongoose.Schema({
  reason: {
    type: String,
    required: true
  },

  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  status: {
    type: String,
    enum: [
      "REQUESTED",
      "APPROVED",
      "REJECTED",
      "PICKED_UP",
      "SHIPPED",
      "DELIVERED",
      "COMPLETED"
    ],
    default: "REQUESTED"
  },

  requestedAt: {
    type: Date,
    default: Date.now
  },

  approvedAt: Date,
  rejectedAt: Date,

  pickup: {
    awb: String,
    courier: String,
    pickedUpAt: Date
  },

  replacementShipment: {
    awb: String,
    courier: String,
    shippedAt: Date,
    deliveredAt: Date
  },

  adminNote: String,
  sellerNote: String
});


const orderSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: true
  },

  orderItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "OrderItem"
  }],

  // ✅ ADDRESS SNAPSHOT (NOT ObjectId)
  shippingAddress: {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },
    locality: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
  },

  totalMrpPrice: {
    type: Number,
    required: true
  },

  totalSellingPrice: {
    type: Number,
    required: true
  },

  discount: Number,

  totalItem: {
    type: Number,
    required: true
  },

  orderStatus: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },

  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },

  orderDate: {
    type: Date,
    default: Date.now
  },

  deliveryDate: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000
  },
  couponCode: {
    type: String,
  },

  couponDiscount: {
    type: Number,
    default: 0,
  },
  shippingCharge: {
  type: Number,
  default: 0
}
,

courier: {
  partner: String,
  awb: String,
  status: String,
  history: [
    {
      status: String,
      time: Date,
      location: String
    }
  ],
  expectedDelivery: Date,
  lastUpdated: Date
}
,

invoice: {
  invoiceNo: String,
  pdfUrl: String,
  sentToCustomer: Boolean,
},


shipping: {
  courier: { type: String, default: "DTDC" },
  awb: { type: String, default: "" },
  status: {
    type: String,
    enum: [
      "READY_TO_SHIP",
      "PICKED_UP",
      "IN_TRANSIT",
      "DELIVERED"
    ],
    default: "READY_TO_SHIP"
  },
  pickupDate: Date,
  deliveredDate: Date,
  manual: { type: Boolean, default: true }
},

  /* ================= REPLACEMENT ================= */
  replacement: {
    type: replacementSchema,
    default: null
  }


}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
