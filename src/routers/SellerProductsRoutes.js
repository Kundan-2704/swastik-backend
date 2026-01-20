// const express = require('express');
// const sellerMiddleware = require('../middleware/sellerAuthMiddleware.js');
// const ProductController = require('../controller/ProductController.js');
// const upload = require('../middleware/upload.js');

// const router = express.Router();

// router.get(
//   "/",
//   sellerMiddleware,
//   ProductController.getProductBySellerId
// );

// // 🔥 SINGLE PRODUCT FETCH (REQUIRED)
// router.get(
//   "/:productId",
//   sellerMiddleware,
//   ProductController.getProductById
// );

// router.post(
//   "/",
//   sellerMiddleware,
//   upload.array("images", 4),
//   ProductController.createProduct
// );

// /* 🔥 BULK ROUTES */
// router.patch(
//   "/bulk/stock",
//   sellerMiddleware,
//   ProductController.bulkUpdateStock
// );

// /* 🔥 UPDATE PRODUCT */
// router.patch(
//   "/:productId",
//   sellerMiddleware,
//   upload.array("images", 4),
//   ProductController.updateProduct
// );

// router.delete(
//   "/:productId",
//   sellerMiddleware,
//   ProductController.deleteProduct
// );

// module.exports = router;



const express = require("express");
const sellerMiddleware = require("../middleware/sellerAuthMiddleware");
const ProductController = require("../controller/ProductController");
const upload = require('../middleware/upload.js');

const router = express.Router();

/* =====================================================
   🔥 STOCK ROUTES — ALWAYS FIRST (VERY IMPORTANT)
   ===================================================== */

router.post(
  "/",
  sellerMiddleware,
  upload.array("images", 4),
  ProductController.createProduct
);


// ✅ BULK STOCK UPDATE
router.patch(
  "/bulk/stock",
  sellerMiddleware,
  ProductController.bulkUpdateStock
);

// ✅ SINGLE PRODUCT STOCK UPDATE
router.patch(
  "/:productId/stock",
  sellerMiddleware,
  ProductController.updateProductStock
);

/* =====================================================
   📦 FETCH ROUTES
   ===================================================== */

router.get(
  "/",
  sellerMiddleware,
  ProductController.getProductBySellerId
);

router.get(
  "/:productId",
  sellerMiddleware,
  ProductController.getProductById
);

/* =====================================================
   ✏️ UPDATE / DELETE
   ===================================================== */

router.patch(
  "/:productId",
  sellerMiddleware,
  ProductController.updateProduct
);

router.delete(
  "/:productId",
  sellerMiddleware,
  ProductController.deleteProduct
);

module.exports = router;
