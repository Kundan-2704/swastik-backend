




const Order = require("../model/Order");
const generateInvoicePDF = require("../util/invoicePdf");

class InvoiceService {
  async generate(orderId) {
  

    const order = await Order.findById(orderId)
  .populate({
    path: "seller",
    populate: {
      path: "pickupAddress",
      model: "Address",
    },
  })
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
