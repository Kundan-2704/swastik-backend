


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

//   /* ======= RENDER-SAFE PATH FIX (ONLY CHANGE) ======= */
//   const invoiceDir = path.join(process.cwd(), "invoices");
//   if (!fs.existsSync(invoiceDir)) {
//     fs.mkdirSync(invoiceDir, { recursive: true });
//   }
//   /* ================================================ */

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
//   // const grandTotal = order.totalSellingPrice;
//   // const taxableValue = Math.round(grandTotal / 1.05);
//   // const gst = grandTotal - taxableValue;

//   // const isInterState = addr.state && buyer.state && addr.state !== buyer.state;
//   // const cgst = isInterState ? 0 : gst / 2;
//   // const sgst = isInterState ? 0 : gst / 2;
//   // const igst = isInterState ? gst : 0;

//   const grandTotal = order.totalSellingPrice; // FINAL PAID AMOUNT

// const taxableValue = Math.round(grandTotal / 1.05);
// const gstTotal = grandTotal - taxableValue;

// const isInterState = addr.state && buyer.state && addr.state !== buyer.state;

// const cgst = isInterState ? 0 : gstTotal / 2;
// const sgst = isInterState ? 0 : gstTotal / 2;
// const igst = isInterState ? gstTotal : 0;


//   /* ================= HEADER ================= */
//   doc.fontSize(18).font("Helvetica-Bold").text("TAX INVOICE", { align: "center" });

//   doc.fontSize(12).font("Helvetica-Bold").text(sellerName, 40, 70);

//   doc.fontSize(9).font("Helvetica")
//     .text(`Address: ${sellerAddress || "NA"}`)
//     .text(`GSTIN: ${gstin}`)
//     .text(`State: ${addr.state || "NA"}`)
//     .text(`Email: ${sellerEmail}`);

//   /* ================= WATERMARK ================= */
//   const logoPath = path.join(__dirname, "../assets/Swastik-perfect-logo.png");

//   doc.save();
//   doc.opacity(0.08);
//   doc.image(logoPath, 150, 250, { width: 300, align: "center" });
//   doc.restore();

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
//     .text(`Payment Mode: Online`, 350)
//     .text(`Payment Status: ${order.paymentStatus}`, 350)
//     .text(`Reverse Charge: No`, 350);

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
//     doc.fontSize(9).font("Helvetica").fillColor(DARK)
//       .text(i + 1, 45, y)
//       .text(item.product.title, 70, y, { width: 170 })
//       .text(item.product.hsn || "5007", 250, y)
//       .text(item.quantity, 300, y)
//       .text(`₹${taxableValue}`, 340, y)
//       .text(`₹${(isInterState ? igst : cgst).toFixed(2)}`, 400, y)
//       .text(isInterState ? "" : `₹${sgst.toFixed(2)}`, 470, y);
//     y += 25;
//   });

//   /* ================= TOTAL ================= */
//   y += 10;
//   doc.fontSize(10).font("Helvetica-Bold")
//     .text(`Taxable Amount: ₹${taxableValue}`, 350, y);

//   if (isInterState) {
//     doc.text(`IGST @5%: ₹${igst.toFixed(2)}`, 350, y + 15);
//   } else {
//     doc.text(`CGST @2.5%: ₹${cgst.toFixed(2)}`, 350, y + 15);
//     doc.text(`SGST @2.5%: ₹${sgst.toFixed(2)}`, 350, y + 30);
//   }

//   doc.text(`Grand Total: ₹${grandTotal}`, 350, y + 50);

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
require("dotenv").config();

/* ================= UTILS ================= */
function numberToWords(num) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
    "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + " " + ones[n%10];
    if (n < 1000) return ones[Math.floor(n/100)] + " Hundred " + convert(n%100);
    if (n < 100000) return convert(Math.floor(n/1000)) + " Thousand " + convert(n%1000);
    if (n < 10000000) return convert(Math.floor(n/100000)) + " Lakh " + convert(n%100000);
    return convert(Math.floor(n/10000000)) + " Crore " + convert(n%10000000);
  }
  return convert(num).replace(/\s+/g," ").trim() + " Only";
}

const formatINR = (amt) => `₹${Number(amt).toFixed(2)}`;

/* ================= MAIN ================= */
module.exports = async function generateInvoicePDF(order) {

  const invoiceDir = path.join(process.cwd(), "invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const invoiceNo = `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6)}`;
  const filePath = path.join(invoiceDir, `${invoiceNo}.pdf`);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  /* ===== FONT (₹ FIX) ===== */
  const fontPath = path.join(__dirname, "../assets/fonts/NotoSans-Regular.ttf");
  doc.registerFont("REGULAR", fontPath);
  doc.font("REGULAR");

  /* ================= BRAND ================= */
  const BRAND_NAME = process.env.BRAND_NAME || "Swastik – Heritage Woven Luxury";
  const BRAND_WEBSITE = process.env.BRAND_WEBSITE || "https://swastik.com";

  /* ================= SELLER ================= */
  const seller = order.seller;
  const addr = seller.pickupAddress || {};
  const business = seller.businessDetails || {};

  const sellerName = business.businessName || seller.sellerName;
  const sellerEmail = business.businessEmail || seller.email;
  const gstin = seller.GSTIN || "GSTIN Not Available";

  const sellerAddress = [
    addr.address, addr.locality, addr.city, addr.state, addr.pinCode
  ].filter(Boolean).join(", ");

  const buyer = order.shippingAddress;

  /* ================= TAX (UNCHANGED) ================= */
  const grandTotal = order.totalSellingPrice;
  const taxableValue = Math.round(grandTotal / 1.05);
  const gstTotal = grandTotal - taxableValue;
  const cgst = gstTotal / 2;
  const sgst = gstTotal / 2;

  /* ================= HEADER ================= */
  doc.fontSize(14).text(BRAND_NAME, 40, 40);
  doc.fontSize(9).text(BRAND_WEBSITE, 40, 60);
  doc.fontSize(18).text("TAX INVOICE", 0, 90, { align: "center" });

  /* ================= TWO COLUMN BLOCK ================= */
  const leftX = 40;
  const rightX = 330;
  const blockY = 140;

  // SELLER (LEFT)
  doc.fontSize(11).text(sellerName, leftX, blockY);
  doc.fontSize(9)
    .text(`Address: ${sellerAddress}`, leftX, blockY + 15, { width: 260 })
    .text(`GSTIN: ${gstin}`, leftX)
    .text(`State: ${addr.state}`, leftX)
    .text(`Email: ${sellerEmail}`, leftX);

  // BUYER (RIGHT)
  doc.fontSize(10).text("Bill To:", rightX, blockY);
  doc.fontSize(9)
    .text(buyer.name, rightX, blockY + 15)
    .text(buyer.address, rightX, blockY + 30, { width: 230 })
    .text(`${buyer.city}, ${buyer.state} - ${buyer.pinCode}`, rightX)
    .text(`Place of Supply: ${buyer.state}`, rightX);

  /* ================= META ================= */
  const metaY = blockY + 110;
  doc.fontSize(9)
    .text(`Invoice No: ${invoiceNo}`, rightX, metaY)
    .text(`Invoice Date: ${new Date(order.orderDate).toLocaleDateString("en-IN")}`, rightX)
    .text(`Order ID: ${order._id}`, rightX)
    .text(`Payment Mode: Online`, rightX);

  /* ================= TABLE ================= */
  let y = metaY + 60;
  doc.fontSize(9).text("S.No", 40, y);
  doc.text("Product", 70, y);
  doc.text("HSN", 260, y);
  doc.text("Qty", 300, y);
  doc.text("Taxable", 340, y);
  doc.text("CGST 2.5%", 410, y);
  doc.text("SGST 2.5%", 480, y);

  y += 20;

  order.orderItems.forEach((item, i) => {
    doc.text(i + 1, 40, y);
    doc.text(item.product.title, 70, y, { width: 180 });
    doc.text(item.product.hsn || "5007", 260, y);
    doc.text(item.quantity, 300, y);
    doc.text(formatINR(taxableValue), 340, y);
    doc.text(formatINR(cgst), 410, y);
    doc.text(formatINR(sgst), 480, y);
    y += 25;
  });

  /* ================= TOTAL ================= */
  y += 10;
  doc.fontSize(10)
    .text(`Taxable Amount: ${formatINR(taxableValue)}`, 350, y)
    .text(`CGST @2.5%: ${formatINR(cgst)}`, 350, y + 15)
    .text(`SGST @2.5%: ${formatINR(sgst)}`, 350, y + 30)
    .text(`Grand Total: ${formatINR(grandTotal)}`, 350, y + 50);

  doc.fontSize(9)
    .text(`Amount in Words: ${numberToWords(grandTotal)}`, 40, y + 60);

  /* ================= SIGN ================= */
  const qr = await QRCode.toDataURL(`https://swastik.com/order/${order._id}`);
  doc.image(qr, 40, y + 100, { width: 90 });

  doc.text(`For ${sellerName}`, 380, y + 120);
  doc.text("Authorized Signatory", 380, y + 135);

  doc.end();

  return { invoiceNo, filePath };
};
