// controllers/notification.controller.js
const notificationService = require("../services/notification.service");

class NotificationController {
  async getAll(req, res) {
    const notifications = await notificationService.getNotificationsByUser(
      req.user._id
    );
    res.json(notifications);
  }

  async readOne(req, res) {
    const notification = await notificationService.markAsRead(req.params.id);
    res.json(notification);
  }

  async readAll(req, res) {
    await notificationService.markAllAsRead(req.user._id);
    res.json({ success: true });
  }
}

module.exports = new NotificationController();
