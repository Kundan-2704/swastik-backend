const replacementService = require("../service/ReplacementService");

class ReplacementController {

  // CUSTOMER
  async request(req, res) {
    try {
      const { orderId, reason } = req.body;

      const order = await replacementService.requestReplacement({
        orderId,
        userId: req.user._id,
        reason
      });

      res.status(200).json({
        success: true,
        message: "Replacement requested successfully",
        order
      });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // SELLER / ADMIN
  async approve(req, res) {
    try {
      const { orderId } = req.params;
      const { sellerNote } = req.body;

      const order = await replacementService.approveReplacement({
        orderId,
        sellerNote
      });

      res.status(200).json({
        success: true,
        message: "Replacement approved",
        order
      });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async reject(req, res) {
    try {
      const { orderId } = req.params;
      const { note } = req.body;

      const order = await replacementService.rejectReplacement({
        orderId,
        note
      });

      res.status(200).json({
        success: true,
        message: "Replacement rejected",
        order
      });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async pickup(req, res) {
    try {
      const { orderId } = req.params;
      const { awb, courier } = req.body;

      const order = await replacementService.pickupOldProduct({
        orderId,
        awb,
        courier
      });

      res.status(200).json({
        success: true,
        message: "Old product picked up",
        order
      });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async ship(req, res) {
    try {
      const { orderId } = req.params;
      const { awb, courier } = req.body;

      const order = await replacementService.shipReplacement({
        orderId,
        awb,
        courier
      });

      res.status(200).json({
        success: true,
        message: "Replacement shipped",
        order
      });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deliver(req, res) {
    try {
      const { orderId } = req.params;

      const order = await replacementService.deliverReplacement({ orderId });

      res.status(200).json({
        success: true,
        message: "Replacement delivered",
        order
      });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async complete(req, res) {
    try {
      const { orderId } = req.params;

      const order = await replacementService.completeReplacement({ orderId });

      res.status(200).json({
        success: true,
        message: "Replacement completed",
        order
      });

    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new ReplacementController();
