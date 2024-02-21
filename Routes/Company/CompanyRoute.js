const express = require('express');
const router = express.Router();
const companyController = require('../../Controllers/CompanyController');
const authController = require('../../Controllers/AuthController');


router.route('/shipement/:id').
    get(companyController.getShipment);

router.use(authController.protect,authController.restrictTo('admin','sub-admin'));

router.route('/getAllUser')
    .get(companyController.getAllUsers)
    .route('/updateUser')
    .post(companyController.updateUser);
router.get('/getUser/:id', companyController.getUser) 
router.delete('/deleteUser/:id', companyController.deleteUser) 

router.route('/getAllStocks')
    .get(companyController.getAllStocks)
    .route('/updateStock')
    .post(companyController.updateStock);
router.get('/getOneStock/:id', companyController.getOneStock) 
router.delete('/deleteStcok/:id', companyController.deleteStock) 

router.route('/getAllReviews')
    .get(companyController.getAllReviews)
    .route('/updateReview')
    .post(companyController.updateReview);
router.get('/getOneReview/:id', companyController.getOneReview) 
router.delete('/deleteReview/:id', companyController.deleteReview) 

router.route('/getAllStocks')
    .get(companyController.getAllStocks)
    .route('/updateStock')
    .post(companyController.updateStock);
router.get('/getOneStock/:id', companyController.getOneStock) 
router.delete('/deleteStcok/:id', companyController.deleteStock) 

router.route('/getAllRefunds')
    .get(companyController.getAllRefunds)
    .route('/updateRefunds')
    .post(companyController.updateRefund);
router.get('/getDetailOfRefund/:id', companyController.getRefund) 
router.delete('/deleteRefund/:id', companyController.deleteRefund) 

router.route('/getAllOrders')
    .get(companyController.getAllOrders)
    .route('/updateOrders')
    .post(companyController.updateOrders);
router.get('/getDetailOfOrder/:id', companyController.getOrders) 
router.delete('/deleteOrder/:id', companyController.deleteOrder) 

router.route('/getAllEmployees')
    .get(companyController.getAllEmployees)
    .route('/updateEmployee')
    .post(companyController.updateEmployee);
router.get('/getEmployee/:id', companyController.getEmployee) 
router.delete('/deleteEmployee/:id', companyController.deleteEmployee)
router.get('/hireAnEmployee/:id', companyController.hireAnEmployee)
router.get('/fireAnEmployee/:id', companyController.FireAnEmployee)


module.exports = router