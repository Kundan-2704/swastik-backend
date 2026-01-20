const express = require('express');
const sellerMiddleware = require('../middleware/sellerAuthMiddleware.js');
const TransactionController = require('../controller/TransactionController.js');
const router = express.Router();

router.get('/seller', sellerMiddleware, TransactionController.getTransactionBySeller);

module.exports = router;
