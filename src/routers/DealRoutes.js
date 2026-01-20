// const express = require('express');
// const DealController = require('../controller/DealController');
// const router = express.Router();


// router.get('/', DealController.getAllDeals);

// router.post('/', DealController.createDeals);

// router.patch('/:id', DealController.updateDeals);

// router.delete('/:id', DealController.deleteDeals);

// module.exports = router;



const express = require("express");
const DealController = require("../controller/DealController");
const router = express.Router();

// ✅ CUSTOMER FIRST
router.get("/active", DealController.getActiveDeals);

// ADMIN
router.get("/", DealController.getAllDeals);
router.post("/", DealController.createDeals);
router.patch("/:id", DealController.updateDeals);
router.delete("/:id", DealController.deleteDeals);

module.exports = router;
