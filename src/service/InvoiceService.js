class InvoiceService {
  async generateInvoice(order) {
    return {
      invoiceNo: "INV" + Date.now(),
      pdfUrl: `/invoices/${order._id}.pdf`
    };
  }

  async sendInvoiceToCustomer(order, invoice) {
    // email / whatsapp later
    return true;
  }
}

module.exports = new InvoiceService();
