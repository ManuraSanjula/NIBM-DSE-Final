const express = require('express');
const router = express.Router();
const orderController = require('../../Controllers/OrderController');
const authController = require('../../Controllers/AuthController');

router.use(authController.protect);

router.route('/').
    post(orderController.checkData, orderController.createOrder)
    .get(orderController.getAllOrder);

router.route('/chekoutAll').get(orderController.checkOutAll)

router.route('/:id').
    get(orderController.getOneOrder);

router.route('/:id/getInvoice').
    get(orderController.getInvoice);


router.get('/:id/confrimRecive', orderController.confrimRecive)

module.exports = router