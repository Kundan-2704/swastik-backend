const express = require('express');
const sellerMiddleware = require('../middleware/sellerAuthMiddleware');
const Ordercontroller = require('../controller/OrderController');
const SellerOrderController = require('../controller/SellerOrderController');
const router = express.Router();


router.get('/', sellerMiddleware, Ordercontroller.getSellersOrders);

router.patch('/:orderId/status/:orderStatus', sellerMiddleware, Ordercontroller.updateOrderStatus);


// Seller books courier
router.post(
  "/:orderId/courier/book",
  sellerMiddleware,
  SellerOrderController.bookCourier
);

// Seller tracks shipment
router.get(
  "/:orderId/courier/track",
  sellerMiddleware,
  SellerOrderController.track
);


module.exports = router;