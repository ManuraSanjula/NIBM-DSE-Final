const express = require('express')
const Router = express.Router();
const ClothModel = require('../../Models/ClothModel');
const authController = require('../../Controllers/AuthController');

Router.get('/me',authController.isLoggedIn ,authController.protect,async (req, res) => {
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
        cloth = await ClothModel.findById(req.params.id)
    }catch (e){
        return res.status(200).render('error');
    }
    res.status(200).render('tour', {
        title: 'Chilaw Sri Lanka',
        cloth
    });
})

module.exports = Router;