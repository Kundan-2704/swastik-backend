const router = require("express").Router();
const ReturnController = require("../controller/ReturnController");
const auth = require("../middleware/authMiddleware");

router.post("/", auth, ReturnController.create);
router.get("/", auth, ReturnController.getAll);
router.get("/:id", auth, ReturnController.getOne);

router.put("/:id/approve", auth, ReturnController.approve);
router.put("/:id/reject", auth, ReturnController.reject);
router.put("/:id/picked", auth, ReturnController.pickedUp);
router.put("/:id/received", auth, ReturnController.received);
router.put("/:id/refund", auth, ReturnController.refund);
router.put("/:id/replace", auth, ReturnController.replace);

module.exports = router;
