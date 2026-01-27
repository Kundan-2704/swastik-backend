const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generateMockLabel(order) {
  const fileName = `label_${order._id}.pdf`;
  const filePath = path.join(__dirname, "../uploads/labels/", fileName);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  const doc = new PDFDocument({ margin: 30 });
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(16).text("TEST COURIER LABEL", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`AWB: TEST-${Date.now()}`);
  doc.text(`Order ID: ${order._id}`);
  doc.moveDown();

  doc.text("TO:");
  doc.text(order.shippingAddress.name);
  doc.text(`${order.shippingAddress.address}`);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state}`);
  doc.text(`PIN: ${order.shippingAddress.pinCode}`);
  doc.text(`Mob: ${order.shippingAddress.mobile}`);
  doc.moveDown();

  doc.text("FROM:");
  doc.text(order.seller.storeName || "Seller Store");
  doc.text(order.seller.pickupAddress || "Pickup address");
  doc.moveDown();

  doc.text("||||||||||||||||||||||||||||||||||||||||||||");
  doc.text("|||||||||||   BARCODE (TEST)   |||||||||||");
  doc.text("||||||||||||||||||||||||||||||||||||||||||||");

  doc.end();

  return {
    fileName,
    filePath,
    awb: `TEST-${Date.now()}`
  };
};
