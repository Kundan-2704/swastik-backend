// const PDFDocument = require("pdfkit");
// const fs = require("fs");
// const path = require("path");
// const QRCode = require("qrcode");

// /* ================= UTILS ================= */
// function numberToWords(num) {
//   const ones = [
//     "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
//     "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen",
//     "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
//   ];
//   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

//   if (!num || num === 0) return "Zero Only";

//   function convert(n) {
//     if (n < 20) return ones[n];
//     if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10];
//     if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
//     if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
//     if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
//     return convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000);
//   }

//   return convert(num).replace(/\s+/g, " ").trim() + " Only";
// }

// /* ================= MAIN ================= */
// module.exports = async function generateInvoicePDF(order) {

//   const invoiceDir = path.join(process.cwd(), "invoices");
//   if (!fs.existsSync(invoiceDir)) {
//     fs.mkdirSync(invoiceDir, { recursive: true });
//   }

//   const invoiceNo = `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6)}`;
//   const filePath = path.join(invoiceDir, `${invoiceNo}.pdf`);

//   const doc = new PDFDocument({ size: "A4", margin: 40 });
//   doc.pipe(fs.createWriteStream(filePath));

//   const GOLD = "#B08D57";
//   const DARK = "#222";
//   const LIGHT = "#666";

//   /* ================= SELLER ================= */
//   const seller = order.seller;
//   const addr = seller.pickupAddress || {};
//   const business = seller.businessDetails || {};

//   const sellerName = business.businessName || seller.sellerName;
//   const sellerEmail = business.businessEmail || seller.email;
//   const gstin = seller.GSTIN || "GST Applied";

//   const sellerAddress = [
//     addr.address,
//     addr.locality,
//     addr.city,
//     addr.state,
//     addr.pinCode
//   ].filter(Boolean).join(", ");

//   /* ================= BUYER ================= */
//   const buyer = order.shippingAddress;

//   /* ================= TAX ================= */
//   const grandTotal = order.totalSellingPrice;
//   const taxableValue = Math.round(grandTotal / 1.05);
//   const gstTotal = grandTotal - taxableValue;

//   const isInterState = addr.state && buyer.state && addr.state !== buyer.state;
//   const cgst = isInterState ? 0 : gstTotal / 2;
//   const sgst = isInterState ? 0 : gstTotal / 2;
//   const igst = isInterState ? gstTotal : 0;

//   /* ================= BRAND HEADER ================= */
//   const logoPath = path.join(__dirname, "../assets/Swastik-perfect-logo.png");
//   const BRAND_GSTIN = "22ABCDE1234F1Z5";

//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, 40, 38, { width: 40 });
//   }

//   doc.font("Helvetica-Bold").fontSize(14).text("SWASTIK HANDLOOM", 95, 42);

//   doc.fontSize(9)
//     .font("Helvetica-Bold")
//     .text(`GSTIN: ${BRAND_GSTIN}`, 380, 42, { align: "right" });

//   doc.moveDown(1);
//   doc.fontSize(18).font("Helvetica-Bold").text("TAX INVOICE", { align: "center" });

//   /* ================= SELLER DETAILS ================= */
//   doc.fontSize(10).font("Helvetica-Bold").text("Seller Details:", 40, 75);
//   doc.moveDown(0.3);

//   doc.fontSize(12).font("Helvetica-Bold").text(sellerName, 40);
//   doc.fontSize(9).font("Helvetica")
//     .text(`Address: ${sellerAddress}`)
//     .text(`GSTIN: ${gstin}`)
//     .text(`State: ${addr.state || "NA"}`)
//     .text(`Email: ${sellerEmail}`);

//   /* ================= WATERMARK ================= */
//   if (fs.existsSync(logoPath)) {
//     doc.save();
//     doc.opacity(0.05);
//     doc.image(logoPath, 150, 260, { width: 300 });
//     doc.restore();
//   }

//   /* ================= BUYER ================= */
//   doc.fontSize(10).font("Helvetica-Bold").text("Bill To:", 40, 150);
//   doc.fontSize(9).font("Helvetica")
//     .text(buyer.name)
//     .text(buyer.address)
//     .text(`${buyer.city}, ${buyer.state} - ${buyer.pinCode}`)
//     .text(`Place of Supply: ${buyer.state}`);

//   /* ================= META ================= */
//   doc.fontSize(9).font("Helvetica")
//     .text(`Invoice No: ${invoiceNo}`, 350, 150)
//     .text(`Invoice Date: ${new Date(order.orderDate).toLocaleDateString("en-IN")}`, 350)
//     .text(`Order ID: ${order._id}`, 350)
//     .text("Payment Mode: Online", 350)
//     .text(`Payment Status: ${order.paymentStatus}`, 350)
//     .text("Reverse Charge: No", 350);

//   /* ================= TABLE ================= */
//   let y = 230;
//   doc.rect(40, y, 520, 25).stroke(GOLD);

//   doc.font("Helvetica-Bold").fontSize(9).fillColor(GOLD)
//     .text("S.No", 45, y + 7)
//     .text("Product", 70, y + 7)
//     .text("HSN", 250, y + 7)
//     .text("Qty", 300, y + 7)
//     .text("Taxable", 340, y + 7)
//     .text(isInterState ? "IGST 5%" : "CGST 2.5%", 400, y + 7)
//     .text(isInterState ? "" : "SGST 2.5%", 470, y + 7);

//   y += 30;

//   order.orderItems.forEach((item, i) => {
//     doc.font("Helvetica").fontSize(9).fillColor(DARK)
//       .text(i + 1, 45, y)
//       .text(item.product.title, 70, y, { width: 170 })
//       .text(item.product.hsn || "5007", 250, y)
//       .text(item.quantity, 300, y)
//       .text(`Rs. ${taxableValue}`, 340, y)
//       .text(`Rs. ${(isInterState ? igst : cgst).toFixed(2)}`, 400, y)
//       .text(isInterState ? "" : `Rs. ${sgst.toFixed(2)}`, 470, y);
//     y += 25;
//   });

//   /* ================= TOTAL ================= */
//   y += 10;
//   doc.fontSize(10).font("Helvetica-Bold")
//     .text(`Taxable Amount: Rs. ${taxableValue}`, 350, y);

//   if (isInterState) {
//     doc.text(`IGST @5%: Rs. ${igst.toFixed(2)}`, 350, y + 15);
//   } else {
//     doc.text(`CGST @2.5%: Rs. ${cgst.toFixed(2)}`, 350, y + 15);
//     doc.text(`SGST @2.5%: Rs. ${sgst.toFixed(2)}`, 350, y + 30);
//   }

//   doc.text(`Grand Total: Rs. ${grandTotal}`, 350, y + 50);

//   /* ================= WORDS ================= */
//   doc.fontSize(9).font("Helvetica")
//     .text(`Amount in Words: ${numberToWords(grandTotal)}`, 40, y + 50);

//   /* ================= DECLARATION ================= */
//   doc.fontSize(8).fillColor(LIGHT)
//     .text(
//       "Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
//       40, y + 90, { width: 520 }
//     );

//   /* ================= SIGN ================= */
//   doc.font("Helvetica-Bold").text(`For ${sellerName}`, 380, y + 120);
//   doc.fontSize(8).text("Authorized Signatory", 380, y + 135);

//   /* ================= QR ================= */
//   const qr = await QRCode.toDataURL(`https://swastik.com/order/${order._id}`);
//   doc.image(qr, 40, y + 120, { width: 90 });

//   doc.end();

//   return {
//     invoiceNo,
//     filePath,
//     url: `/invoices/${invoiceNo}.pdf`
//   };
// };








const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

function numberToWords(num) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"];

  const tens = ["", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (!num || num === 0) return "Zero Only";

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10];
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred " + convert(n % 100);
    if (n < 100000) return convert(Math.floor(n / 1000)) + " Thousand " + convert(n % 1000);
    if (n < 10000000) return convert(Math.floor(n / 100000)) + " Lakh " + convert(n % 100000);
    return convert(Math.floor(n / 10000000)) + " Crore " + convert(n % 10000000);
  }

  return convert(num).replace(/\s+/g, " ").trim() + " Only";
}

module.exports = async function generateInvoicePDF(order) {

  const invoiceDir = path.join(process.cwd(), "invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const invoiceNo = `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6)}`;
  const filePath = path.join(invoiceDir, `${invoiceNo}.pdf`);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  const GOLD = "#B08D57";
  const DARK = "#222";
  const LIGHT = "#666";

  const seller = order.seller;
  const addr = seller.pickupAddress || {};
  const business = seller.businessDetails || {};

  const sellerName = business.businessName || seller.sellerName;
  const sellerEmail = business.businessEmail || seller.email;
  const gstin = seller.GSTIN || "GST Applied";

  const sellerAddress = [
    addr.address, addr.locality, addr.city, addr.state, addr.pinCode
  ].filter(Boolean).join(", ");

  const buyer = order.shippingAddress;

  const grandTotal = order.totalSellingPrice;
  const taxableValue = Math.round(grandTotal / 1.05);
  const gstTotal = grandTotal - taxableValue;

  const isInterState = addr.state && buyer.state && addr.state !== buyer.state;
  const cgst = isInterState ? 0 : gstTotal / 2;
  const sgst = isInterState ? 0 : gstTotal / 2;
  const igst = isInterState ? gstTotal : 0;

  const logoPath = path.join(__dirname, "../assets/Swastik-perfect-logo.png");
  const BRAND_GSTIN = "22ABCDE1234F1Z5";

  /* ================= HEADER ================= */

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 30, { width: 45 });
  }

  doc.font("Helvetica-Bold")
    .fontSize(16)
    .text("SWASTIK HANDLOOM", 95, 35);

  doc.fontSize(9)
    .text(`GSTIN: ${BRAND_GSTIN}`, 400, 38);

  doc.moveDown(2);
  doc.fontSize(20).text("TAX INVOICE", { align: "center" });

  /* ================= SELLER / BUYER ================= */

  let y = 110;

  doc.fontSize(10).font("Helvetica-Bold").text("Seller Details:", 40, y);
  doc.fontSize(9).font("Helvetica")
    .text(sellerName, 40, y + 15)
    .text(`Address: ${sellerAddress}`)
    .text(`GSTIN: ${gstin}`)
    .text(`State: ${addr.state || "NA"}`)
    .text(`Email: ${sellerEmail}`);

  doc.fontSize(10).font("Helvetica-Bold").text("Bill To:", 300, y);
  doc.fontSize(9).font("Helvetica")
    .text(buyer.name, 300, y + 15)
    .text(buyer.address)
    .text(`${buyer.city}, ${buyer.state} - ${buyer.pinCode}`)
    .text(`Place of Supply: ${buyer.state}`);

  /* ================= META ================= */

  y = 185;

  doc.fontSize(9)
    .text(`Invoice No: ${invoiceNo}`, 300, y)
    .text(`Invoice Date: ${new Date(order.orderDate).toLocaleDateString("en-IN")}`, 300)
    .text(`Order ID: ${order._id}`, 300)
    .text("Payment Mode: Online", 300)
    .text(`Payment Status: ${order.paymentStatus}`, 300)
    .text("Reverse Charge: No", 300);

  /* ================= TABLE ================= */

  y = 240;

  doc.rect(40, y, 520, 25).stroke(GOLD);

  doc.font("Helvetica-Bold").fontSize(9).fillColor(GOLD)
    .text("S.No", 50, y + 7)
    .text("Product", 90, y + 7)
    .text("HSN", 280, y + 7)
    .text("Qty", 330, y + 7)
    .text("Taxable", 370, y + 7)
    .text(isInterState ? "IGST 5%" : "CGST", 440, y + 7)
    .text(isInterState ? "" : "SGST", 500, y + 7);

  y += 35;

  order.orderItems.forEach((item, i) => {
    doc.font("Helvetica").fontSize(9).fillColor(DARK)
      .text(i + 1, 50, y)
      .text(item.product.title, 90, y, { width: 180 })
      .text(item.product.hsn || "5007", 280, y)
      .text(item.quantity, 330, y)
      .text(`Rs. ${taxableValue}`, 370, y)
      .text(`Rs. ${(isInterState ? igst : cgst).toFixed(2)}`, 440, y)
      .text(isInterState ? "" : `Rs. ${sgst.toFixed(2)}`, 500, y);

    y += 30;
  });

  /* ================= TOTALS ================= */

  y += 10;

  doc.font("Helvetica-Bold").fontSize(10)
    .text(`Taxable Amount: Rs. ${taxableValue}`, 370, y);

  if (isInterState) {
    doc.text(`IGST @5%: Rs. ${igst.toFixed(2)}`, 370, y + 18);
  } else {
    doc.text(`CGST @2.5%: Rs. ${cgst.toFixed(2)}`, 370, y + 18);
    doc.text(`SGST @2.5%: Rs. ${sgst.toFixed(2)}`, 370, y + 36);
  }

  doc.fontSize(12)
    .text(`Grand Total: Rs. ${grandTotal}`, 370, y + 65);

  /* ================= WORDS ================= */

  doc.font("Helvetica").fontSize(9)
    .text(`Amount in Words: ${numberToWords(grandTotal)}`, 40, y + 65);

  /* ================= DECLARATION ================= */

  doc.fontSize(8).fillColor(LIGHT)
    .text(
      "Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
      40, y + 105, { width: 520 }
    );

  /* ================= SIGNATURE ================= */

  doc.fontSize(10).font("Helvetica-Bold")
    .text(`For ${sellerName}`, 370, y + 140);

  doc.fontSize(8)
    .text("Authorized Signatory", 370, y + 158);

  /* ================= QR ================= */

  const qr = await QRCode.toDataURL(`https://swastik.com/order/${order._id}`);
  doc.image(qr, 40, y + 135, { width: 90 });

  doc.end();

  return { invoiceNo, filePath, url: `/invoices/${invoiceNo}.pdf` };
};
