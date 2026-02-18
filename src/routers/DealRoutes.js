



const express = require("express");
const DealController = require("../controller/DealController");
const apicache = require("apicache");
const router = express.Router();
const cache = apicache.middleware; 

// ✅ CUSTOMER FIRST
router.get("/active",  cache("5 minutes"), DealController.getActiveDeals);

// ADMIN
router.get("/",cache("30 seconds"), DealController.getAllDeals);
router.post("/", DealController.createDeals);
router.patch("/:id", DealController.updateDeals);
router.delete("/:id", DealController.deleteDeals);

module.exports = router;
