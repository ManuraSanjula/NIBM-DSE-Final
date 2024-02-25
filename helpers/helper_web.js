const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');
const errorController = require('../Controllers/ErrorController');

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.redirect('http://localhost:3000/')
        }
        next();
    };
};
exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }
        if (!token) {
            return res.redirect('http://localhost:3000/login')
        }
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.redirect('http://localhost:3000/login')

        }
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.redirect('http://localhost:3000/login')
        }
        req.user = currentUser;
        res.locals.user = currentUser;
        next();
    } catch (error) {
        errorController(req, res, error)
    }
};
