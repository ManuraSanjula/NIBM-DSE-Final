const express = require('express');
const router = express.Router();
const cartController = require('../../Controllers/CartController');
const authController = require('../../Controllers/AuthController');

router.use(authController.protect);

router.route('/').
    post(cartController.checkData, cartController.createCart).
    get(cartController.getAllCart)
    
router.route('/:id').
    get(cartController.getOneCart)
    .delete(cartController.deleteCart);

module.exports = router