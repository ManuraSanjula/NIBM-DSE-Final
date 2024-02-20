const express = require('express')
const Router = express.Router();
const authController = require('../Controllers/authController');
const ClothControler = require('../Controllers/ClothController');

Router.route('/Cloths').
    post(authController.protect, authController.restrictTo('admin','sub-admin'),
        ClothControler.uploadTourImages,
        ClothControler.resizeTourImages,
        ClothControler.insertOneCloth
    )
Router.get('/Cloths/slug/:slugName',ClothControler.getOneClothBySlug)

Router.route('/Cloths/:id').
    get(ClothControler.getOneCloth)
    .put(authController.protect, authController.restrictTo('admin','sub-admin'),
        ClothControler.uploadTourImages,
        ClothControler.resizeTourImages,
        ClothControler.updateOneCloth
    ).delete(authController.protect, authController.restrictTo('admin','sub-admin'),ClothControler.deleteOneCloth);

Router.route('/Cloths').get(ClothControler.getAllCloths)

module.exports = Router;