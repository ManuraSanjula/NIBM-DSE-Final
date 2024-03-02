const express = require('express')
const Router = express.Router();
const authController = require('../../Controllers/AuthController');
const ClothControler = require('../../Controllers/ClothController');
const multer = require('multer');
let upload = multer({ dest: 'uploads/' })


Router.route('/Cloths').
    post(authController.protect, authController.restrictTo('admin'),
        upload.array('img', 4),
        ClothControler.insertOneCloth
    )
Router.get('/Cloths/slug/:slugName',ClothControler.getOneClothBySlug)

Router.route('/Cloths/:id').
     get(ClothControler.getOneCloth)
    .put(authController.protect, authController.restrictTo('admin'),
        ClothControler.uploadTourImages,
        ClothControler.resizeTourImages,
        ClothControler.updateOneCloth
    ).delete(authController.protect, authController.restrictTo('admin'),ClothControler.deleteOneCloth);

Router.route('/Cloths').get(ClothControler.getAllCloths)

module.exports = Router;