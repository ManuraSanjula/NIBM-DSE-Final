const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/OrderController');
const authController = require('../Controllers/AuthController');

router.use(authController.protect);

router.route('/').
    post(authController.restrictTo('admin', 'sub-admin'), orderController.checkData, orderController.createOrder)
    .get(authController.restrictTo('admin', 'sub-admin'), orderController.getAllOrder);

router.route('/chekoutAll').get(authController.restrictTo('admin', 'sub-admin'), orderController.checkOutAll)

router.route('/:id').
    get(authController.restrictTo('admin', 'sub-admin'), orderController.getOneOrder);

router.route('/:id/getInvoice').
    get(authController.restrictTo('admin', 'sub-admin'), orderController.getInvoice);


router.get('/:id/confrimRecive', authController.restrictTo('user'), orderController.confrimRecive)

module.exports = router