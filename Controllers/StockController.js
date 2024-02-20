const OrderModel = require('../Models/OrderModel');
const errorController = require('./ErrorController');
const UserModel = require('../Models/UserModel');
const ClothModel = require('../Models/ClothModel')

exports.checkData = (req, res, next) => {
    if (!req.body.hasOwnProperty('StcokData')) {
        return res.status(400).json({
            status: 'failed',
            message: 'Cloth Id Missing '
        })
    }
    return next();
}