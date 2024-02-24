const express = require('express');
const router = express.Router();
const orderController = require('../../Controllers/OrderController');
const authController = require('../../Controllers/AuthController');
const orderModel = require("../../Models/OrderModel");
const errorController = require("../../Controllers/ErrorController");
const EmployeeModel = require("../../Models/EmployeesModel");

router.use(authController.protect);
let setOrdersToAvailable = async (newOrder) => {
    const emp = await EmployeeModel.find({ isManager: true });
    const oneMEmp = emp[Math.floor(Math.random() * emp.length)];
    if (!(oneMEmp.toOrderToBeAvailable === undefined || oneMEmp.toOrderToBeAvailable == null || oneMEmp.toOrderToBeAvailable.length <= 0)) {
        oneMEmp.toOrderToBeAvailable.push(newOrder._id);
        await EmployeeModel.findByIdAndUpdate(oneMEmp._id, oneMEmp);
    } else {
        oneMEmp.toOrderToBeAvailable = [];
        oneMEmp.toOrderToBeAvailable.push(newOrder._id);
        await EmployeeModel.findByIdAndUpdate(oneMEmp._id, oneMEmp);
    }
}
router.route('/').
    post(orderController.checkData, async (req, res,next) => {
        try {
            const newOrder = await orderModel.create(req.body)
            await setOrdersToAvailable(newOrder)
            return res.status(201).json({
                size: newOrder.length,
                status: 'success',
                data: newOrder,
            })
        } catch (error) {
            errorController(req, res, error)
        }
    })
    .get(async (req, res) => {
        try {
            if (!req.user._id) {
                return res.status(400).json({
                    status: 'fail',
                    data: null,
                    message: 'UserID Missing  '
                })
            }
            const orderItem = await orderModel.find({ user: req.user._id });
            return res.status(200).json({
                size: orderItem.length,
                status: 'success',
                data: orderItem,
            })
        } catch (error) {
            errorController(req, res, error)
        }
    });

router.route('/:id').
    get((req, res) => orderController.getOneOrder(req, res));

router.route('/:id/getInvoice').
    get((req, res) => orderController.getInvoice(req, res));


router.get('/:id/confrimRecive', (req, res)=> orderController.confrimRecive(req, res))

module.exports = router