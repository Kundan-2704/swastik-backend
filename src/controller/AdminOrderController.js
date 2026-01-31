const Order = require("../model/Order");
const invoiceService = require("../service/InvoiceService");
const OrderService = require("../service/OrderService");
const courierService = require("../service/courier");

const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose"); // ✅ ADD THIS
const archiver = require("archiver");

class AdminOrderController {


  async getAllOrders(req, res) {
    try {
      if (
        req.user.role !== "ROLE_ADMIN" &&
        req.user.role !== "ADMIN"
      ) {
        return res.status(403).json({ message: "Admin only" });
      }

      const orders = await Order.find()
        .populate("user", "name email")
        .populate(
          "seller",
          "shopName email phone gst city state"
        )
        .sort({ createdAt: -1 });

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }


  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;

      const order = await Order.findById(orderId).populate({
        path: "seller",
        select: "sellerName email mobile GSTIN businessDetails pickupAddress",
        populate: {
          path: "pickupAddress",
          select: "address locality city state pinCode",
        },
      });


      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch order",
      });
    }
  }

  async updateOrderStatus(req, res) {
  try {
    const { orderId, orderStatus } = req.params;
    const order = await OrderService.updateOrderStatus(orderId, orderStatus);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


  async generateInvoice(req, res) {
    const order = await Order.findById(req.params.orderId);

    const invoice = await invoiceService.generateInvoice(order);
    await invoiceService.sendInvoiceToCustomer(order, invoice);

    order.invoice = {
      ...invoice,
      sentToCustomer: true
    };
    await order.save();

    res.json({ message: "Invoice generated & sent" });
  }

  async generateLabel(req, res) {
    const order = await Order.findById(req.params.orderId);
    const label = await courierService.generateLabel(order);

    res.json({ label });
  }


  async updateShipping  (req, res)  {
  try {
    const { orderId } = req.params;
    const { courier, awb, status, pickupDate, deliveredDate } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.shipping = {
      courier,
      awb,
      status,
      pickupDate,
      deliveredDate,
      manual: true
    };

    await order.save();

    res.json({ success: true, shipping: order.shipping });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


 // ✅ FIXED: now inside class
  async downloadInvoice(req, res) {
    try {
      const { orderId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: "Invalid order id" });
      }

      const order = await Order.findById(orderId);

      if (!order?.invoice?.pdfUrl) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      const absolutePath = path.resolve(order.invoice.pdfUrl);

      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ message: "Invoice file missing" });
      }

      return res.download(absolutePath);
    } catch (err) {
      console.error("Admin invoice download error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }


  async downloadMonthlyInvoicesZip(req, res) {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const orders = await Order.find({
      createdAt: { $gte: start, $lt: end },
      "invoice.pdfUrl": { $exists: true },
    });

    if (!orders.length) {
      return res.status(404).json({ message: "No invoices found" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=GST-${month}-${year}-invoices.zip`
    );
    res.setHeader("Content-Type", "application/zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const order of orders) {
      const filePath = path.resolve(order.invoice.pdfUrl);
      if (fs.existsSync(filePath)) {
        archive.file(filePath, {
          name: `invoice-${order._id}.pdf`,
        });
      }
    }

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create ZIP" });
  }
}


}

module.exports = new AdminOrderController();
