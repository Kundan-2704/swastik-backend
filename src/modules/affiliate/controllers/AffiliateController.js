const service = require("../services/AffiliateService");

class AffiliateController {

  async register(req, res) {
    try {
      const data = await service.register(req.user._id);
      res.status(201).json(data);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async dashboard(req, res) {
    try {
      const data = await service.getDashboard(req.user._id);
      res.json(data);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async withdraw(req, res) {
    try {
      const data = await service.requestWithdrawal(req.user._id);
      res.json(data);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async approveWithdrawal(req, res) {
    try {
      const data = await service.approveWithdrawal(req.params.id);
      res.json(data);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

module.exports = new AffiliateController();