const express = require('express')
const Router = express.Router();
const ClothModel = require('../../Models/ClothModel');
const authController = require('../../Controllers/AuthController');
const EmployeeModel = require("../../Models/EmployeesModel");
const UserModel = require("../../Models/UserModel");
const OrderModel = require("../../Models/OrderModel");
const ClothInv = require("../../Models/ClothInventoryModel");
const ReviewModel = require("../../Models/ReviewModel")
const helper_web = require('../../helpers/helper_web')

Router.get('/inventory-cus/:id/edit',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    res.status(200).render('Company/edit_user_order',{
        title: 'Chilaw Sri Lanka',
        order
    });
})
Router.get('/customer-detail/:id',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const customer = await UserModel.findById(req.params.id);
    res.status(200).render('Company/user-detail',{
        title: 'Chilaw Sri Lanka',
        customer
    });
})
Router.get('/promoteEmp',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin'),async (req, res) => {
    res.status(200).render('Company/promoteEmp',{
        title: 'Chilaw Sri Lanka',
    });
})

Router.get('/inventory-emp/:id/edit',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const employee = await EmployeeModel.findById(req.params.id);
    res.status(200).render('Company/edit_employee_order',{
        title: 'Chilaw Sri Lanka',
        employee,
        view: true
    });
})

Router.get('/inventory-emp/:id/edit/1',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin'),async (req, res) => {
    const employee = await EmployeeModel.findById(req.params.id);
    res.status(200).render('Company/edit_employee_order',{
        title: 'Chilaw Sri Lanka',
        employee,
        view: false
    });
})

Router.get('/inventory-emp',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    let employees = await EmployeeModel.find().populate({ path: 'user_id' })

    if(req.user.role === 'sub-admin')
        employees = await EmployeeModel.find({ isManager : false}).populate({ path: 'user_id' })

    res.status(200).render('Company/employee-management',{
        title: 'Chilaw Sri Lanka',
        employees
    });
})
Router.get('/inventory-cus/accept-order',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const orders = await OrderModel.find({orderIsConfirmed: false})
    res.status(200).render('Company/customer-management-pending',{
        title: 'Chilaw Sri Lanka',
        orders
    });
})
Router.get('/inventory-cus/orders',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const orders = await OrderModel.find().populate({ path: 'user' })
    res.status(200).render('Company/customer-management-order',{
        title: 'Chilaw Sri Lanka',
        orders
    });
})
Router.get('/inventory-cus/reviews',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const reviews = await ReviewModel.find().populate({ path: 'user' })
    res.status(200).render('Company/customer-management-reviews',{
        title: 'Chilaw Sri Lanka',
        reviews
    });
})
Router.get('/inventory-cu',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const customers = await UserModel.find({ role : 'user-customer'})
    res.status(200).render('Company/customer-management',{
        title: 'Chilaw Sri Lanka',
        customers
    });
})

Router.get('/home',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const cloths = await ClothInv.find()
    res.status(200).render('Company/inventory-management',{
        title: 'Chilaw Sri Lanka',
        cloths
    });
})
Router.get('/hireAnEmployee',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin'),async (req, res) => {
    res.status(200).render('hireAnEmployee',);
})

module.exports = Router;