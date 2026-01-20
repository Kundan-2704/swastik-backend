const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const AddressController = require("../controller/AddressController");
const router = express.Router();

// POST → save address
router.post("/", authMiddleware, AddressController.create);

// GET → fetch user addresses
router.get("/", authMiddleware, AddressController.getUserAddresses);

module.exports = router;
