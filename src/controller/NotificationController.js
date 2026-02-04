// const notificationService = require("../service/notificationService");

// class NotificationController {
//   async getMyNotifications(req, res) {
//     try {
      
//       const data = await notificationService.getUserNotifications(req.user.id, req.user.role);
//       return res.status(200).json(data);
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
//   }

//   async markRead(req, res) {
//     try {
//       const data = await notificationService.markAsRead(req.params.id);
//       return res.status(200).json(data);
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
//   }

  
//   // ✅ MARK ALL READ
//   async markAllRead(req, res) {
//     try {
//       await notificationService.markAllAsRead(req.user.id);
//       return res.status(200).json({ message: "All notifications marked as read" });
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
//   }

//   // ✅ CLEAR ALL
//   async clearAll(req, res) {
//     try {
//       await notificationService.clearAll(req.user.id);
//       return res.status(200).json({ message: "All notifications cleared" });
//     } catch (err) {
//       return res.status(500).json({ message: err.message });
//     }
//   }

// }

// module.exports = new NotificationController();








const notificationService = require("../service/notificationService");

class NotificationController {
  /* ---------- GET NOTIFICATIONS ---------- */
  async getMyNotifications(req, res) {
    try {
      const { id, role, sellerId } = req.user;

      const data = await notificationService.getUserNotifications(
        id,
        role,
        sellerId
      );

      return res.status(200).json(data);
    } catch (err) {
      console.error("GET NOTIFICATIONS ERROR:", err);
      return res.status(500).json({ message: err.message });
    }
  }

  /* ---------- MARK SINGLE READ ---------- */
  async markRead(req, res) {
    try {
      const data = await notificationService.markAsRead(req.params.id);
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  /* ---------- MARK ALL READ ---------- */
  async markAllRead(req, res) {
    try {
      const { id, role, sellerId } = req.user;

      await notificationService.markAllAsRead(
        id,
        role,
        sellerId
      );

      return res.status(200).json({
        message: "All notifications marked as read",
      });
    } catch (err) {
      console.error("MARK ALL READ ERROR:", err);
      return res.status(500).json({ message: err.message });
    }
  }

  /* ---------- CLEAR ALL (MARK READ) ---------- */
  async clearAll(req, res) {
    try {
      const { id, role, sellerId } = req.user;

      await notificationService.clearAll(
        id,
        role,
        sellerId
      );

      return res.status(200).json({
        message: "All notifications cleared",
      });
    } catch (err) {
      console.error("CLEAR ALL ERROR:", err);
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new NotificationController();
