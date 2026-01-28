const ReturnService = require("../service/ReturnService");

class ReturnController {
  async create(req, res) {
    try {
      const data = await ReturnService.create({
        ...req.body,
        customerId: req.user._id
      });
      res.json(data);
    } catch (e) {
      res.status(400).json({ success: false, message: e.message });
    }
  }

  async getAll(req, res) {
    const data = await ReturnService.list(req.query);
    res.json(data);
  }

  async getOne(req, res) {
    const data = await ReturnService.getById(req.params.id);
    res.json(data);
  }

  async approve(req, res) {
    const data = await ReturnService.sellerApprove(
      req.params.id,
      req.body.note
    );
    res.json({ success: true, data });
  }

  async reject(req, res) {
    const data = await ReturnService.sellerReject(
      req.params.id,
      req.body.note
    );
    res.json({ success: true, data });
  }

  async pickedUp(req, res) {
    const data = await ReturnService.markPickedUp(req.params.id);
    res.json({ success: true, data });
  }

  async received(req, res) {
    const data = await ReturnService.markReceived(req.params.id);
    res.json({ success: true, data });
  }

  async refund(req, res) {
    const data = await ReturnService.refund(
      req.params.id,
      req.body.amount
    );
    res.json({ success: true, data });
  }

  async replace(req, res) {
    const data = await ReturnService.replace(req.params.id);
    res.json({ success: true, data });
  }
}

module.exports = new ReturnController();
