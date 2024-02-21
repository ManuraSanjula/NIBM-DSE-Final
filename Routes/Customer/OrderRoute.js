const express = require('express');
const router = express.Router();
const orderController = require('../../Controllers/OrderController');
const authController = require('../../Controllers/AuthController');

router.use(authController.protect);

router.route('/').
    post(orderController.checkData, (req, res) => {
        return orderController.createOrder(req, res);
    })
    .get((req, res) => orderController.getAllOrder(req, res));

router.route('/chekoutAll').get(orderController.checkOutAll)

router.route('/:id').
    get((req, res) => orderController.getOneOrder(req, res));

router.route('/:id/getInvoice').
    get((req, res) => orderController.getInvoice(req, res));


router.get('/:id/confrimRecive', (req, res)=> orderController.confrimRecive(req, res))

module.exports = router