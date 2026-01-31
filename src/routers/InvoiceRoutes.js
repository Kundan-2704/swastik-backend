const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../model/Order");
const path = require("path");
const fs = require("fs");

router.get("/invoice/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // ✅ prevent crash
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(orderId);

    if (!order?.invoice?.pdfUrl) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // ✅ absolute path resolve (safe)
    const absolutePath = path.resolve(order.invoice.pdfUrl);

    // ✅ extra safety
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "Invoice file missing" });
    }

    // ✅ download
    return res.download(absolutePath);

  } catch (err) {
    console.error("Invoice download error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
