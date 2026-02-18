const express = require('express');
const ProductController = require('../controller/ProductController.js');
const apicache = require("apicache");

const router = express.Router();
const cache = apicache.middleware; 

router.get('/search', cache('2 minutes'), ProductController.searchProduct);

router.get('/', cache('5 minutes'), ProductController.getAllProduct);

router.get('/:productId', cache('10 minutes'), ProductController.getProductById);

module.exports = router