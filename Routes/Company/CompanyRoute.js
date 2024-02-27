const express = require('express');
const router = express.Router();
const companyController = require('../../Controllers/CompanyController');
const authController = require('../../Controllers/AuthController');

router.route('/shipement/:id').
    get(companyController.getShipment)
   .post(authController.restrictTo('employee-dilivery'),companyController.updateShipment);
   
router.use(authController.protect)
router.get('/company/employee-diliver/:emp_id/AllOrders',authController.restrictTo('employee-dilivery'), companyController.allOrdersByDId)
router.get('/company/employee-diliver/:emp_id/AllShipments',authController.restrictTo('employee-dilivery'), companyController.allShipmentByDId)

router.get('/company/manger/:emp_id/allPendingOrders',authController.restrictTo('sub-admin'), companyController.AllPendingOrdersByMId)
router.get('/company/confirmOrderByManager/:order_id',authController.restrictTo('sub-admin', 'admin'),companyController.confirmOrder)

router.use(authController.protect,authController.restrictTo('admin'));

router.route('/company/admin/getAllEmployees')
    .get(companyController.getAllEmployees)

router.route('/company/admin/updateEmployee/:id')
    .post(companyController.updateEmployee);
router.get('/company/admin/getEmployee/:id', companyController.getEmployee) 
router.delete('/company/admin/deleteEmployee/:id', companyController.deleteEmployee)
router.get('/company/admin/hireAnEmployee/:id', companyController.hireAnEmployee)
router.get('/company/admin/fireAnEmployee/:id', companyController.FireAnEmployee)


// router.get('/company/admin/AllPendingOrders/:emp_id',companyController.AllPendingOrders)  // specific delivery manager
router.get('/company/admin/AllPendingOrdersNotConfirmed/:emp_id', companyController.AllPendingOrdersNotConfirmed)  // specific manager


router.use(authController.protect,authController.restrictTo('admin','sub-admin'));
router.get('/company/admin/AllOrders/:emp_id', companyController.allOrdersByDId)   // specific delivery person
router.get('/company/admin/AllShipments/:emp_id',companyController.allShipmentByDId)  // specific delivery person
router.get('/company/AllOrdersNotDeliverd/:emp_id', companyController.allShipmentNotDeliverdByDId)  // specific delivery person
router.get('/company/AllShipmentsNotDeliverd/:emp_id', companyController.AllOrdersNotDeliverdByDId) // specific delivery person

router.route('/company/getAllUser')
    .get(companyController.getAllUsers)
    
router.route('/company/updateUser/:id')
    .post(companyController.updateUser);
router.get('/company/getUser/:id', companyController.getUser) 
router.delete('/company/deleteUser/:id', companyController.deleteUser) 

router.route('/company/getAllCloths')
    .get(companyController.getCloths)
router.route('/company/updateCloth/:id')
    .post(companyController.updateCloth);
router.get('/company/getOneCloth/:id', companyController.getOneCloth) 
router.delete('/company/deleteCloth/:id', companyController.deleteCloth) 

router.route('/company/getAllReviews')
    .get(companyController.getReviews)
router.route('/company/updateReview/:id')
    .post(companyController.updateReview);
router.get('/company/getOneReview/:id', companyController.getOneReview) 
router.delete('/company/deleteReview/:id', companyController.deleteReview) 

router.route('/company/getAllStocks')
    .get(companyController.getStocks)
router.route('/company/updateStock/:id')
    .post(companyController.updateStock);
router.get('/company/getOneStock/:id', companyController.getOneStock) 
router.delete('/company/deleteStcok/:id', companyController.deleteStock) 

router.route('/company/getAllRefunds')
    .get(companyController.getAllRefunds)
router.route('/company/updateRefunds/:id')
    .post(companyController.updateRefund);
router.get('/company/getDetailOfRefund/:id', companyController.getRefund) 
router.delete('/company/deleteRefund/:id', companyController.deleteRefund) 

router.route('/company/getAllOrders')
    .get(companyController.getOrders)
router.route('/company/updateOrders/:id')
    .post(companyController.updateOrder);
router.get('/company/getDetailOfOrder/:id', companyController.getOrders) 
router.delete('/company/deleteOrder/:id', companyController.deleteOrder) 


module.exports = router