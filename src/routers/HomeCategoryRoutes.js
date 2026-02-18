const express = require('express');
const HomeCategoryController = require('../controller/HomeCategoryController');
const apicache = require("apicache");
const router = express.Router();
const cache = apicache.middleware;

router.post('/categories', HomeCategoryController.createHomeCategories);

router.get('/home-category', cache('10 minutes'), HomeCategoryController.getHomeCategory);

router.patch('/home-category/:id', HomeCategoryController.updateHomeCategory);


module.exports = router;
