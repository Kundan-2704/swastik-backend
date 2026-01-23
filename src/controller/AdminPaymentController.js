const AdminPaymentService = require("../service/AdminPaymentService");

class AdminPaymentController {

  async getAll(req, res) {
    const data = await AdminPaymentService.list(req.query);
    res.json(data);
  }

  async getOne(req, res) {
    const data = await AdminPaymentService.getById(req.params.id);
    res.json(data);
  }
}

module.exports = new AdminPaymentController();
