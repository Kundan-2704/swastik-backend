// class InvoiceService {
//   async generateInvoice(order) {
//     return {
//       invoiceNo: "INV" + Date.now(),
//       pdfUrl: `/invoices/${order._id}.pdf`
//     };
//   }

//   async sendInvoiceToCustomer(order, invoice) {
//     // email / whatsapp later
//     return true;
//   }
// }

// module.exports = new InvoiceService();







// const Order = require("../model/Order");
// const generateInvoicePDF = require("../util/invoicePdf");

// class InvoiceService {
//   async generate(orderId) {
//     const order = await Order.findById(orderId)
//       .populate("seller")
//       .populate({
//         path: "orderItems",
//         populate: { path: "product" },
//       });

//     if (!order) throw new Error("Order not found");

//     const { invoiceNo, filePath } = await generateInvoicePDF(order);

//     order.invoice = {
//       invoiceNo,
//       pdfUrl: filePath,
//       sentToCustomer: true,
//     };

//     await order.save();

//     return order.invoice;
//   }
// }

// module.exports = new InvoiceService();





const Order = require("../model/Order");
const generateInvoicePDF = require("../util/invoicePdf");

class InvoiceService {
  async generate(orderId) {
    const order = await Order.findById(orderId)
      .populate("seller")
      .populate({
        path: "orderItems",
        populate: { path: "product" },
      });

    if (!order) throw new Error("Order not found");

    const { invoiceNo, filePath } = await generateInvoicePDF(order);

    order.invoice = {
      invoiceNo,
      pdfUrl: filePath, // relative path
      sentToCustomer: false,
    };

    await order.save();

    return order.invoice;
  }
}

module.exports = new InvoiceService();
