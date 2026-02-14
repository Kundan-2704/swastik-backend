






const Notification = require("../model/Notification");

/* ================= ROLE NORMALIZER ================= */
const normalizeRole = (role) => {
  if (!role) return "customer";

  const r = role.toLowerCase();

  if (r.includes("admin")) return "admin";
  if (r.includes("seller")) return "seller";
  return "customer";
};

/* ================= SERVICE ================= */
class NotificationService {
  /* ---------- CREATE ---------- */
  async createNotification(payload) {
    return await Notification.create(payload);
  }

  /* ---------- GET NOTIFICATIONS ---------- */
 async getUserNotifications(userId, role, sellerId) {

  const normalizedRole = normalizeRole(role);


  // ADMIN
  if (normalizedRole === "admin") {
    return Notification.find({ role: "admin" })
      .sort({ createdAt: -1 });
  }

  // ✅ SELLER FIXED
  if (normalizedRole === "seller") {
    if (!sellerId) {
      return [];
    }


    return Notification.find({ sellerId })
      .sort({ createdAt: -1 });
  }

  // CUSTOMER

  return Notification.find({ userId })
    .sort({ createdAt: -1 });
}


  /* ---------- MARK SINGLE READ ---------- */
  async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }

  /* ---------- MARK ALL READ ---------- */
  async markAllAsRead(userId, role, sellerId) {
    const normalizedRole = normalizeRole(role);

    // ADMIN
    if (normalizedRole === "admin") {
      return await Notification.updateMany(
        { role: "admin", isRead: false },
        { $set: { isRead: true } }
      );
    }

    // SELLER
    if (normalizedRole === "seller") {
      if (!sellerId) return;
      return await Notification.updateMany(
        { sellerId, isRead: false },
        { $set: { isRead: true } }
      );
    }

    // CUSTOMER
    return await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
  }

  /* ---------- CLEAR ALL (MARK READ, NOT DELETE) ---------- */
  



async clearAll(userId, role, sellerId) {
  const normalizedRole = normalizeRole(role);

  // ADMIN
  if (normalizedRole === "admin") {
    return await Notification.deleteMany({ role: "admin" });
  }

  // SELLER
  if (normalizedRole === "seller") {
    if (!sellerId) return;
    return await Notification.deleteMany({ sellerId });
  }

  // CUSTOMER
  return await Notification.deleteMany({ userId });
}


}

module.exports = new NotificationService();
