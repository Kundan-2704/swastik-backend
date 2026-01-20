// routes/notification.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const NotificationController = require("../controller/NotificationController");

router.get("/", auth, NotificationController.getAll);
router.put("/:id/read", auth, NotificationController.readOne);
router.put("/read-all", auth, NotificationController.readAll);

module.exports = router;
