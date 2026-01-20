const SellerReportService = require("../service/SellerReportService");


class SellerReportController {
    async getSellerReport(req, res) {
        try {
            const seller = req.seller;
            const report = await SellerReportService.getSellerReport(seller._id);
            return res.status(200).json(report);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new SellerReportController();