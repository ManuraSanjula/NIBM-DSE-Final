const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');
const authController = require('../Controllers/authController');

router.use(authController.protect);

router.route('/').
    post(authController.restrictTo('user','admin', 'sub-admin'), cartController.checkData, cartController.createCart).
    get(authController.restrictTo('user','admin', 'sub-admin'), cartController.getAllCart)
    
router.route('/:id').
    get(authController.restrictTo('user','admin', 'sub-admin'), cartController.getOneCart)
    .delete(authController.restrictTo('user','admin', 'sub-admin'), cartController.deleteCart);

module.exports = router