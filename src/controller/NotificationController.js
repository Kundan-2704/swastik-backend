const notificationService = require("../service/notificationService");

class NotificationController {
  async getMyNotifications(req, res) {
    try {
      const data = await notificationService.getUserNotifications(req.user.id);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async markRead(req, res) {
    try {
      const data = await notificationService.markAsRead(req.params.id);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new NotificationController();
