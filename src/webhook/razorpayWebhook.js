const InvoiceService = require("../service/InvoiceService");

async function handlePaymentSuccess(orderId) {
  // after order creation
  await InvoiceService.generate(orderId);
}

module.exports = { handlePaymentSuccess };
