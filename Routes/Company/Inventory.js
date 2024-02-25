const express = require('express')
const Router = express.Router();
const ClothModel = require('../../Models/ClothModel');
const authController = require('../../Controllers/AuthController');
const EmployeeModel = require("../../Models/EmployeesModel");
const UserModel = require("../../Models/UserModel");
const OrderModel = require("../../Models/OrderModel");
const ClothInv = require("../../Models/ClothInventoryModel");
const {promisify} = require("util");
const jwt = require("jsonwebtoken");
const User = require("../../Models/UserModel");
const errorController = require("../../Controllers/ErrorController");
const helper_web = require('../../helpers/helper_web')
Router.get('/promoteEmp',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin'),async (req, res) => {
    res.status(200).render('Company/promoteEmp',{
        title: 'Chilaw Sri Lanka',
    });
})
Router.get('/inventory-emp',authController.isLoggedIn ,helper_web.protect, helper_web.restrictTo('admin','sub-admin'),async (req, res) => {
    const employees = await EmployeeModel.find().populate({ path: 'user_id' })
    res.status(200).render('Company/employee-management',{
        title: 'Chilaw Sri Lanka',
        employees
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