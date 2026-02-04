
// const Notification = require("../model/Notification");

// class NotificationService {
//   async createNotification(payload) {
//     return await Notification.create(payload);
//   }

//   // async getUserNotifications(userId) {
//   //   return await Notification.find({ userId }).sort({ createdAt: -1 });
//   // }

//   async getUserNotifications(userId, role) {
//   const normalizedRole = role?.toLowerCase();

//   // ADMIN
//   if (normalizedRole === "role_admin") {
//     return await Notification.find({ role: "admin" })
//       .sort({ createdAt: -1 });
//   }

//   // SELLER / CUSTOMER
//   return await Notification.find({ userId })
//     .sort({ createdAt: -1 });

//     if (role === "seller") {
//   return await Notification.find({ sellerId })
//     .sort({ createdAt: -1 });
// }

// }


//   async markAsRead(notificationId) {
//     return await Notification.findByIdAndUpdate(
//       notificationId,
//       { isRead: true },
//       { new: true }
//     );
//   }

  
//   // ✅ MARK ALL READ
//   async markAllAsRead(userId) {
//     return await Notification.updateMany(
//       { userId, isRead: false },
//       { $set: { isRead: true } }
//     );
//   }

//   // ✅ CLEAR ALL
//   // async clearAll(userId) {
//   //   return await Notification.deleteMany({ userId });
//   // }

//   async clearAll(userId, role) {
//   if (role === "admin") {
//     return await Notification.updateMany(
//       { role: "admin" },
//       { $set: { isRead: true } }
//     );
//   }

//   return await Notification.updateMany(
//     { userId },
//     { $set: { isRead: true } }
//   );
// }


// }

// module.exports = new NotificationService();






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
 async getUserNotifications(userId, role) {
  const r = role.toLowerCase();

  // ADMIN
  if (r.includes("admin")) {
    return Notification.find({ role: "admin" })
      .sort({ createdAt: -1 });
  }

  // SELLER + CUSTOMER → BOTH userId based
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
      return await Notification.updateMany(
        { role: "admin" },
        { $set: { isRead: true } }
      );
    }

    // SELLER
    if (normalizedRole === "seller") {
      if (!sellerId) return;
      return await Notification.updateMany(
        { sellerId },
        { $set: { isRead: true } }
      );
    }

    // CUSTOMER
    return await Notification.updateMany(
      { userId },
      { $set: { isRead: true } }
    );
  }
}

module.exports = new NotificationService();
