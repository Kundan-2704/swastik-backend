const router = require("express").Router();
const controller = require("../controller/NotificationController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getMyNotifications);
router.patch("/:id/read", auth, controller.markRead);


// ✅ NEW
router.patch("/read-all", auth, controller.markAllRead);
router.delete("/", auth, controller.clearAll);

module.exports = router;
