const express = require('express')
const Router = express.Router();
const ClothModel = require('../../Models/ClothModel');
const authController = require('../../Controllers/AuthController');
const orderModel = require("../../Models/OrderModel");
const commentModel = require("../../Models/ReviewModel");
const employeeModel = require("../../Models/EmployeesModel")
const EmployeeModel = require("../../Models/EmployeesModel");
const OrderModel = require("../../Models/OrderModel");
const helper_web = require('../../helpers/helper_web')

Router.get('/comments',authController.isLoggedIn ,helper_web.protect,async (req, res) => {
    const comments = await commentModel.find({ user: req.user._id });
    res.status(200).render('comment',{
        title: 'Chilaw Sri Lanka',
        comments
    });
})
Router.get('/order',authController.isLoggedIn ,helper_web.protect,async (req, res) => {
    const orderItem = await orderModel.find({ user: req.user._id });

    res.status(200).render('order',{
        title: 'Chilaw Sri Lanka',
        orders: orderItem
    });
})

Router.get('/me',authController.isLoggedIn ,helper_web.protect,async (req, res) => {
    res.status(200).render('account', {
        title: 'Your account',
    });
})

Router.get('/login', async (req, res) => {
    const cloths = await ClothModel.find()
    res.status(200).render('login', {
        title: 'Chilaw Sri Lanka',
    });
})

Router.get('/signup', async (req, res) => {
    const cloths = await ClothModel.find()
    res.status(200).render('signup');
})

Router.get('/', authController.isLoggedIn, async (req, res) => {
    const cloths = await ClothModel.find()
    res.status(200).render('overview', {
        title: 'Chilaw Sri Lanka',
        cloths
    });
})

Router.get('/:id',authController.isLoggedIn ,async (req, res) => {
    let cloth;
    try {
        cloth = await ClothModel.findById(req.params.id).populate({ path: 'review' })
    }catch (e){
        return res.status(200).render('error');
    }
    res.status(200).render('tour', {
        title: 'Chilaw Sri Lanka',
        cloth
    });
})

module.exports = Router;