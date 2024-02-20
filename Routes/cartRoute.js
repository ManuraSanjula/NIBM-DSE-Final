const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/CartController');
const authController = require('../Controllers/AuthController');

router.use(authController.protect);

router.route('/').
    post(authController.restrictTo('user','admin', 'sub-admin'), cartController.checkData, cartController.createCart).
    get(authController.restrictTo('user','admin', 'sub-admin'), cartController.getAllCart)
    
router.route('/:id').
    get(authController.restrictTo('user','admin', 'sub-admin'), cartController.getOneCart)
    .delete(authController.restrictTo('user','admin', 'sub-admin'), cartController.deleteCart);

module.exports = router