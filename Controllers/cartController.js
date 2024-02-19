const CartModel = require('../Models/cartModel');
const errorController = require('./errorController');
const UserModel = require('../Models/userModel');
const ClothModel = require('../Models/ClothModel')

exports.checkData = (req, res, next) => {
    if (!req.body.hasOwnProperty('Cloth')) {
        return res.status(400).json({
            status: 'failed',
            message: 'Cloth Id Missing '
        })
    }
    return next();
}

exports.createCart = async (req, res, next) => {
    try {
        req.body.user = req.user._id;

        const user = await UserModel.findById(req.body.user._id);
        const Cloth = await ClothModel.findById(req.body.Cloth);

        if (!user) {
            return res.status(401).json({
                status: 'fail',
                message: 'Not Authenthicate'
            })
        }

        if (!Cloth) {
            return res.status(400).json({
                status: 'fail',
                message: 'No Cloth Found Given Id'
            })
        }
        const cartItem = await CartModel.findOne(req.body);
        if (cartItem) {
            cartItem.quantity++;
            cartItem.save();
            return res.status(200).json({
                status: "success"
            })
        }
        const newCart = await CartModel.create(req.body)
        return res.status(201).json({
            size: newCart.length,
            status: 'success',
            data: newCart,
        })

    } catch (error) {
        // return res.status(500).json({
        //     status: 'try again',
        //     message:error.message
        // })
        errorController(req, res, error)
    }
}


exports.getAllCart = async (req, res, next) => {
    try {
        const cartItems = await CartModel.find({ user: req.user });
        return res.status(201).json({
            size: cartItems.length,
            status: 'success',
            data: cartItems,
        })
    } catch (error) {
        // return res.status(500).json({
        //     status: 'try again',
        //     message:error.message
        // })
        errorController(req, res, error)
    }
}

exports.getOneCart = async (req, res, next) => {
    try {
        const cartItem = await CartModel.find({ user: req.user, _id: req.params.id });
        return res.status(201).json({
            status: 'success',
            data: cartItem,
        })
    } catch (error) {
        errorController(req, res, error)
    }
}
exports.deleteCart = async (req, res, next) => {
    try {
        if (!req.user, _id || !req.params.id) {
            return res.status(400).json({
                status: 'failed',
                message: 'User ID oe Cart ID Missing'
            })
        }
        const cartItem = await CartModel.deleteOne({ user: req.user, _id: req.params.id });
        return res.status(201).json({
            status: 'success',
        })
    } catch (error) {
        errorController(req, res, error)
    }
}
