



const PDFDocument = require("pdfkit");
const path = require("path");

const generatePackingSlipPDF = ({ order, qr }) => {
  const doc = new PDFDocument({
    size: "A6",
    margin: 20,
  });

  /* ================= LOGO ================= */
 const logoPath = path.join(
  __dirname,
  "../assets/Swastik-perfect-logo.png"
);

  doc.image(logoPath, 20, 20, { width: 40 });

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("SWASTIK", 70, 22);

  doc
    .fontSize(8)
    .font("Helvetica")
    .text("Handloom Store", 70, 40);

const gstNo =
  order.seller?.GSTIN && order.seller.GSTIN.trim() !== ""
    ? order.seller.GSTIN
    : "GST Applied";

doc
  .fontSize(7)
  .text(`Seller GST: ${gstNo}`, 70, 52);


  doc.moveDown(3);

  /* ================= LINE ================= */
  doc
    .moveTo(20, 80)
    .lineTo(260, 80)
    .strokeColor("#CCCCCC")
    .stroke();

  /* ================= ORDER INFO ================= */
  doc.moveDown(1);
  doc.fontSize(8).font("Helvetica");

  doc.text(`Order ID: ${order._id}`);
  doc.text(
    `Date: ${new Date(order.orderDate).toLocaleDateString("en-IN")}`
  );
  doc.text(`Customer: ${order.shippingAddress.name}`);

  doc.moveDown(1);

  /* ================= LINE ================= */
  doc
    .moveTo(20, doc.y)
    .lineTo(260, doc.y)
    .strokeColor("#CCCCCC")
    .stroke();

  doc.moveDown(0.5);

  /* ================= PRODUCT ================= */
  doc.font("Helvetica-Bold").text("Product Details");
  doc.moveDown(0.3);

  order.orderItems.forEach((item, i) => {
    doc
      .font("Helvetica")
      .text(`${i + 1}. ${item.product?.title || "Product"}`);
    doc.text(`Qty: ${item.quantity}  |  Price: ₹${item.sellingPrice}`);
    doc.moveDown(0.5);
  });

  /* ================= LINE ================= */
  doc.moveDown(0.5);
  doc
    .moveTo(20, doc.y)
    .lineTo(260, doc.y)
    .strokeColor("#CCCCCC")
    .stroke();

  doc.moveDown(1);

  /* ================= QR ================= */
  doc.image(qr, {
    width: 80,
    align: "center",
  });

  doc
    .fontSize(7)
    .fillColor("gray")
    .text("Scan for order verification", { align: "center" });

  doc.moveDown(1);

  /* ================= FOOTER ================= */
  doc
    .fontSize(7)
    .fillColor("black")
    .text("Inside Slip – Not a Tax Invoice", { align: "center" });

  doc.end();
  return doc;
};

module.exports = { generatePackingSlipPDF };
