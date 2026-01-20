const express = require('express');
const router = express.Router();
const userController = require('../controller/userController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

router.get('/profile', authMiddleware ,userController.getUserProfileByJwt);


module.exports = router;