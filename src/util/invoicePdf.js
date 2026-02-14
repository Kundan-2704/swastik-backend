




require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

/* ================= UTILS ================= */

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

/* ================= MAIN ================= */

module.exports = async function generateInvoicePDF(order) {

  const invoiceDir = path.join(process.cwd(), "invoices");
  if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

  const invoiceNo = `INV-${new Date().getFullYear()}-${order._id.toString().slice(-6)}`;
  const filePath = path.join(invoiceDir, `${invoiceNo}.pdf`);

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  doc.pipe(fs.createWriteStream(filePath));

  /* ================= COLORS ================= */

  const GOLD = "#B08D57";
  const DARK = "#1A1A1A";
  const LIGHT = "#777";
  const BORDER = "#EAEAEA";
  const RED = "#C0392B";
  const GREEN = "#1E8449";

  const leftX = 40;
  const rightX = 320;
  const pageWidth = 520;

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

  /* ================= PRICING ================= */

  const mrpTotal = order.totalMrpPrice;
  const sellingTotal = order.totalSellingPrice;
  const couponDiscount = order.couponDiscount || 0;
  const finalAmount = order.finalAmount;

  const couponCode = order.couponCode || "";
  const productDiscount = mrpTotal - sellingTotal;
  const totalSavings = mrpTotal - finalAmount;

  const taxableValue = Math.round(finalAmount / 1.05);
  const gstTotal = finalAmount - taxableValue;

  const isInterState = addr.state && buyer.state && addr.state !== buyer.state;
  const cgst = isInterState ? 0 : gstTotal / 2;
  const sgst = isInterState ? 0 : gstTotal / 2;
  const igst = isInterState ? gstTotal : 0;

  const logoPath = path.join(__dirname, "../assets/Swastik-perfect-logo.png");
  const BRAND_NAME = process.env.BRAND_NAME || "SWASTIK HANDLOOM";
  const BRAND_GSTIN = process.env.BRAND_GSTIN || "GSTIN NOT SET";
  const BRAND_WEBSITE = process.env.BRAND_WEBSITE || "";

  /* ================= HEADER ================= */

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, leftX, 35, { width: 42 });
  }

  doc.font("Helvetica-Bold").fontSize(18)
    .fillColor(DARK)
    .text(BRAND_NAME, 95, 42);

  doc.fontSize(9).fillColor(LIGHT)
    .text(`GSTIN: ${BRAND_GSTIN}`, 400, 45);

  doc.moveDown(2.2);

  doc.fontSize(20).font("Helvetica-Bold")
    .text("TAX INVOICE", { align: "center" });

  doc.moveDown(0.8);

  doc.strokeColor(GOLD)
    .lineWidth(1.3)
    .moveTo(leftX, doc.y)
    .lineTo(555, doc.y)
    .stroke();

  doc.moveDown(1.2);

  /* ================= SELLER / BUYER ================= */

  const startY = doc.y;

  doc.fontSize(10).font("Helvetica-Bold")
    .text("Seller Details", leftX, startY);

  doc.fontSize(9).font("Helvetica")
    .text(sellerName)
    .text(sellerAddress, { width: 240 })
    .text(`GSTIN: ${gstin}`)
    .text(`Email: ${sellerEmail}`);

  const sellerEndY = doc.y;

  doc.fontSize(10).font("Helvetica-Bold")
    .text("Bill To", rightX, startY);

  doc.fontSize(9).font("Helvetica")
    .text(buyer.name, rightX)
    .text(buyer.address, { width: 240 })
    .text(`${buyer.city}, ${buyer.state} - ${buyer.pinCode}`);

  const buyerEndY = doc.y;

  doc.y = Math.max(sellerEndY, buyerEndY) + 28;

  /* ================= TABLE ================= */

  const tableY = doc.y;

  doc.roundedRect(leftX, tableY, pageWidth, 26, 4)
    .stroke(GOLD);

  doc.font("Helvetica-Bold").fontSize(9).fillColor(GOLD)
    .text("S.No", 55, tableY + 8)
    .text("Product", 95, tableY + 8)
    .text("HSN", 300, tableY + 8)
    .text("Qty", 350, tableY + 8)
    .text("Amount", 410, tableY + 8);

  doc.y = tableY + 38;

  order.orderItems.forEach((item, i) => {

    const rowY = doc.y;

    doc.font("Helvetica").fontSize(9).fillColor(DARK)
      .text(i + 1, 55, rowY)
      .text(item.product.title, 95, rowY, { width: 190 })
      .text(item.product.hsn || "5007", 300, rowY)
      .text(item.quantity, 350, rowY)
      .text(`Rs. ${finalAmount}`, 410, rowY);

    doc.moveDown(1.6);

    doc.strokeColor(BORDER)
      .moveTo(leftX, doc.y)
      .lineTo(555, doc.y)
      .stroke();
  });

  doc.moveDown(1.6);

  /* ================= TOTALS ================= */

  const totalsStartY = doc.y;

  doc.roundedRect(rightX - 15, totalsStartY, 250, 140, 10)
    .stroke(BORDER);

  doc.font("Helvetica-Bold").fontSize(10).fillColor(DARK)
    .text(`Subtotal (MRP): Rs. ${mrpTotal}`, rightX, totalsStartY + 12);

  if (productDiscount > 0) {
    doc.font("Helvetica").fillColor(RED)
      .text(`Product Discount: - Rs. ${productDiscount}`, rightX);
  }

  if (couponDiscount > 0) {
    doc.text(`Coupon Discount ${couponCode ? "(" + couponCode + ")" : ""}: - Rs. ${couponDiscount}`, rightX);
  }

  doc.fillColor(DARK);

  doc.font("Helvetica-Bold")
    .text(`Taxable Amount: Rs. ${taxableValue}`, rightX);

  doc.font("Helvetica")
    .text(isInterState
      ? `IGST @5%: Rs. ${igst.toFixed(2)}`
      : `CGST @2.5%: Rs. ${cgst.toFixed(2)}`
    , rightX);

  if (!isInterState) {
    doc.text(`SGST @2.5%: Rs. ${sgst.toFixed(2)}`, rightX);
  }

  doc.moveDown(0.4);

  doc.fontSize(15).font("Helvetica-Bold")
    .text(`Grand Total: Rs. ${finalAmount}`, rightX);

  /* ✅ CRITICAL FIX — MOVE BELOW TOTALS BOX */

  doc.y = totalsStartY + 160;

  /* ================= YOU SAVED ================= */

  if (totalSavings > 0) {
    doc.roundedRect(leftX, doc.y, 210, 32, 8)
      .fill(GREEN);

    doc.fillColor("#FFF").fontSize(10).font("Helvetica-Bold")
      .text(`Congratulations! You Saved Rs. ${totalSavings}`, leftX + 18, doc.y + 9);

    doc.moveDown(2.5);
  }

  /* ================= WORDS ================= */

  doc.fillColor(DARK).fontSize(9)
    .text(`Amount in Words: ${numberToWords(finalAmount)}`);

  doc.moveDown(1.5);

  /* ================= DECLARATION ================= */

  doc.fontSize(8).fillColor(LIGHT)
    .text(
      "Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
      leftX, doc.y, { width: pageWidth }
    );

  doc.moveDown(2);

  if (BRAND_WEBSITE) {
  doc.moveDown(1);
  doc.fontSize(8).fillColor("#777")
    .text(BRAND_WEBSITE, { align: "center" });
}

  /* ================= SIGNATURE ================= */

  doc.fontSize(10).fillColor(DARK).font("Helvetica-Bold")
    .text(`For ${sellerName}`, rightX);

  doc.fontSize(8).font("Helvetica")
    .text("Authorized Signatory");

  /* ================= QR ================= */

  const qr = await QRCode.toDataURL(`https://swastik-frontend-phi.vercel.app/order/${order._id}`);
  doc.image(qr, leftX, doc.y - 10, { width: 85 });

  doc.end();

  return {
    invoiceNo,
    filePath,
    url: `/invoices/${invoiceNo}.pdf`
  };
};