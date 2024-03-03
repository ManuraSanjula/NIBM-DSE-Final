const express = require('express')
const Router = express.Router();
const ClothModel = require('../../Models/ClothModel');
const authController = require('../../Controllers/AuthController');
const orderModel = require("../../Models/OrderModel");
const commentModel = require("../../Models/ReviewModel");
const helper_web = require('../../helpers/helper_web')
const OrderController = require("../../Controllers/OrderController")

const { uploadFile, getFileStream } = require('../../utils/AWS_S3')

Router.get('/image/:key',(req, res) => {
  const key = req.params.key
  const readStream = getFileStream(key)
  readStream.pipe(res)
})

Router.get('/proceed-for-payment/:orderId/:email/1',(req, res) => {
    res.status(200).render('payment');
})


Router.get('/proceed-for-payment/:orderId/:email/2',OrderController.getCheckoutSession)

Router.get('/success-purchase/:id/:email', OrderController.success_fully_confirm_order)
Router.get('/success-cancel', async (req, res)=>{

})
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
Router.get('/Billing',authController.isLoggedIn ,helper_web.protect,async (req, res) => {
    res.status(200).render('BillingInfo', {
        title: 'Your account',
        // user
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