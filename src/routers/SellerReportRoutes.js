const express = require('express');
const sellerMiddleware = require('../middleware/sellerAuthMiddleware');
const SellerReportController = require('../controller/SellerReportController');
const router = express.Router();

router.get('/', sellerMiddleware, SellerReportController.getSellerReport);

module.exports = router;
