const express = require('express');
const sellerMiddleware = require('../middleware/sellerAuthMiddleware');
const Ordercontroller = require('../controller/OrderController');
const router = express.Router();


router.get('/', sellerMiddleware, Ordercontroller.getSellersOrders);

router.patch('/:orderId/status/:orderStatus', sellerMiddleware, Ordercontroller.updateOrderStatus);


module.exports = router;