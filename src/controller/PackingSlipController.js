// controllers/packingSlip.controller.js
const PackingSlipService = require("../service/PackingSlipService");

class PackingSlipController {
  async download(req, res) {
    try {
      const { orderId } = req.params;

      await PackingSlipService.generate(orderId, res);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}


module.exports = new PackingSlipController();
