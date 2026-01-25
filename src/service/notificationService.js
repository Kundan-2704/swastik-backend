const Notification = require("../model/Notification");

class NotificationService {
  async createNotification(payload) {
    return await Notification.create(payload);
  }

  async getUserNotifications(userId) {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }
}

module.exports = new NotificationService();
