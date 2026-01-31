// services/PackingSlipService.js
const mongoose = require("mongoose");
const Order = require("../model/Order");
const { generateQR } = require("../util/qr");
const { generatePackingSlipPDF } = require("../util/pdf");

class PackingSlipService {
  async generate(orderId, res) {
    // 1️⃣ Validate order id
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid order id");
    }

    // 2️⃣ Find order (NO seller filter)
 const order = await Order.findById(orderId)
  .populate({
    path: "seller",
    populate: {
      path: "pickupAddress",
      model: "Address"   // 🔥 THIS WAS MISSING
    }
  })
  .populate({
    path: "orderItems",
    populate: { path: "product" }
  });


    if (!order) {
      throw new Error("Order not found");
    }

    // 3️⃣ Generate QR
    const qr = await generateQR(order._id.toString());

    // 4️⃣ Generate PDF
    const pdf = generatePackingSlipPDF({ order, qr });

    // 5️⃣ Send PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=packing-slip-${order._id}.pdf`
    );

    pdf.pipe(res);
  }
}

module.exports = new PackingSlipService();
