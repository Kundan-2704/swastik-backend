const router = require("express").Router();
const controller = require("../controller/NotificationController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, controller.getMyNotifications);
router.patch("/:id/read", auth, controller.markRead);

module.exports = router;
