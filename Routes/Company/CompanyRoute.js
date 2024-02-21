const express = require('express');
const router = express.Router();
const companyController = require('../../Controllers/CompanyController');
const authController = require('../../Controllers/AuthController');

router.route('/shipement/:id').
    get(companyController.getShipment)
   .post(companyController.updateShipment, authController.restrictTo('employee-dilivery'));

router.route('/company/employee-diliver/:emp_id/AllOrders',authController.restrictTo('employee-dilivery'))  
router.route('/company/employee-diliver/:emp_id/AllShipments',authController.restrictTo('employee-dilivery'))

router.route('/company/manger/:emp_id/allPendingOrders')   
router.get('/company/confirmOrderByManager/:id', companyController.confirmOrder,authController.restrictTo('sub-admin'))

router.use(authController.protect,authController.restrictTo('admin'));

router.route('/company/admin/getAllEmployees')
    .get(companyController.getAllEmployees)
    .route('/company/admin/updateEmployee')
    .post(companyController.updateEmployee);
router.get('/company/admin/getEmployee/:id', companyController.getEmployee) 
router.delete('/company/admin/deleteEmployee/:id', companyController.deleteEmployee)
router.get('/company/admin/hireAnEmployee/:id', companyController.hireAnEmployee)
router.get('/company/admin/fireAnEmployee/:id', companyController.FireAnEmployee)

router.route('/company/admin/AllOrders/:emp_id')  
router.route('/company/admin/AllShipments/:emp_id')
router.route('/company/admin/AllPendingOrders/:emp_id')


router.use(authController.protect,authController.restrictTo('admin','sub-admin'));

router.route('/company/getAllUser')
    .get(companyController.getAllUsers)
    .route('/company/updateUser/:id')
    .post(companyController.updateUser);
router.get('/company/getUser/:id', companyController.getUser) 
router.delete('/company/deleteUser/:id', companyController.deleteUser) 

router.route('/company/getAllCloths')
    .get(companyController.getCloths)
    .route('/company/updateCloth/:id')
    .post(companyController.updateCloth);
router.get('/company/getOneCloth/:id', companyController.getOneCloth) 
router.delete('/company/deleteCloth/:id', companyController.deleteCloth) 

router.route('/company/getAllReviews')
    .get(companyController.getAllReviews)
    .route('/company/updateReview/:id')
    .post(companyController.updateReview);
router.get('/company/getOneReview/:id', companyController.getOneReview) 
router.delete('/company/deleteReview/:id', companyController.deleteReview) 

router.route('/company/getAllStocks')
    .get(companyController.getAllStocks)
    .route('/company/updateStock/:id')
    .post(companyController.updateStock);
router.get('/company/getOneStock/:id', companyController.getOneStock) 
router.delete('/company/deleteStcok/:id', companyController.deleteStock) 

router.route('/company/getAllRefunds')
    .get(companyController.getAllRefunds)
    .route('/company/updateRefunds/:id')
    .post(companyController.updateRefund);
router.get('/company/getDetailOfRefund/:id', companyController.getRefund) 
router.delete('/company/deleteRefund/:id', companyController.deleteRefund) 

router.route('/company/getAllOrders')
    .get(companyController.getAllOrders)
    .route('/company/updateOrders/:id')
    .post(companyController.updateOrders);
router.get('/company/getDetailOfOrder/:id', companyController.getOrders) 
router.delete('/company/deleteOrder/:id', companyController.deleteOrder) 


module.exports = router