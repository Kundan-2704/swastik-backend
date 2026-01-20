// const express = require('express');
// const authMiddleware = require('../middleware/authMiddleware');
// const Ordercontroller = require('../controller/OrderController.js');
// const router = express.Router();

// // 🛒 Create order
// router.post('/', authMiddleware, Ordercontroller.createOrder);

// // 👤 Get user's order history
// router.get('/user', authMiddleware, Ordercontroller.getUserOrderHistory);

// // 📦 Get a specific order item by ID
// router.get('/item/:orderItemId', authMiddleware, Ordercontroller.getOrderItemById);

// // 📑 Get full order details by order ID
// router.get('/:orderId', authMiddleware, Ordercontroller.getOrderById);

// module.exports = router;




const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Ordercontroller = require('../controller/OrderController.js');
const router = express.Router();

// 🛒 Create order
router.post('/', authMiddleware, Ordercontroller.createOrder);

// 👤 Get user's order history
router.get('/user', authMiddleware, Ordercontroller.getUserOrderHistory);

// 📦 Get a specific order item by ID
router.get('/item/:orderItemId', authMiddleware, Ordercontroller.getOrderItemById);

// 📑 Get full order details by order ID
router.get('/:orderId', authMiddleware, Ordercontroller.getOrderById);

// ❌ Cancel order (🔥 REQUIRED)
router.patch('/:orderId/cancel', authMiddleware, Ordercontroller.cancelOrder);

module.exports = router;
