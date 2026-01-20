// services/notification.service.js
const Notification = require("../model/Notification");

class NotificationService {
  async createNotification(data) {
    const notification = await Notification.create(data);

    // realtime
    if (global.io) {
      console.log("🔔 EMITTING TO USER:", data.userId.toString());
      global.io
        .to(data.userId.toString())
        .emit("notification:new", notification);
    }

    return notification;
  }

  async getNotificationsByUser(userId) {
    return Notification.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId) {
    return Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );
  }
}

module.exports = new NotificationService();
