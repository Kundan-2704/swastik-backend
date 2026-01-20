const SellerReport = require("../model/SellerReport");

class SellerReportService {

  // ✅ Get or create report
  async getSellerReport(sellerId) {
    let report = await SellerReport.findOne({ seller: sellerId });

    if (!report) {
      report = await SellerReport.create({
        seller: sellerId,
        totalEarnings: 0,
        totalSales: 0,
        totalRefunds: 0,
        totalTax: 0,
        netEarnings: 0,
        totalOrders: 0,
        canceledOrders: 0,
        totalTransactions: 0
      });
    }

    return report;
  }

  // 🔥 MAIN FUNCTION: update after successful payment
  async updateAfterPayment(order) {
    const amount = order.totalSellingPrice;

    const report = await this.getSellerReport(order.seller);

    report.totalOrders += 1;
    report.totalTransactions += 1;
    report.totalSales += amount;
    report.totalEarnings += amount;
    report.netEarnings += amount;

    await report.save();

    return report;
  }

  // optional: refund handling
  async updateAfterRefund(order) {
    const amount = order.totalSellingPrice;

    const report = await this.getSellerReport(order.seller);

    report.totalRefunds += 1;
    report.totalSales -= amount;
    report.totalEarnings -= amount;
    report.netEarnings -= amount;

    await report.save();
  }
}

module.exports = new SellerReportService();
