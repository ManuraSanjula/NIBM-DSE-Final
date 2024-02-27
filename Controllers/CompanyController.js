const UserModel = require('../Models/UserModel');
const StocksModel = require('../Models/StockModel'); // Company
const ShipmentsModel = require('../Models/ShipmentModel'); // Company
const ReviewsModel = require('../Models/ReviewModel');
const RefundsModel = require('../Models/RefundModel');
const OrderModel = require('../Models/OrderModel');
const EmployeeModel = require('../Models/EmployeesModel'); // Company
const ClothModel = require('../Models/ClothModel'); // Company
const factory = require('./handlerFactory');
const errorController = require('./ErrorController');
const Email = require("../utils/email")

exports.getAllUsers = factory.getAll(UserModel);
exports.getUser = factory.getOne(UserModel);
exports.updateUser = factory.updateOne(UserModel);
exports.deleteUser = factory.deleteOne(UserModel);

exports.getStocks = factory.getAll(StocksModel);
exports.getOneStock = factory.getOne(StocksModel);
exports.updateStock = factory.updateOne(StocksModel);
exports.deleteStock = factory.deleteOne(StocksModel);

exports.getAllShipments = factory.getAll(ShipmentsModel);
exports.getShipment = factory.getOne(ShipmentsModel);
exports.updateShipment = factory.updateOne(ShipmentsModel);
exports.deleteShipment = factory.deleteOne(ShipmentsModel);

exports.getReviews = factory.getAll(ReviewsModel);
exports.getOneReview = factory.getOne(ReviewsModel);
exports.updateReview = factory.updateOne(ReviewsModel);
exports.deleteReview = factory.deleteOne(ReviewsModel);

exports.getAllRefunds = factory.getAll(RefundsModel);
exports.getRefund = factory.getOne(RefundsModel);
exports.updateRefund = factory.updateOne(RefundsModel);
exports.deleteRefund = factory.deleteOne(RefundsModel);

exports.getOrders = factory.getAll(OrderModel);
exports.getOneOrder = factory.getOne(OrderModel);
exports.updateOrder = factory.updateOne(OrderModel);
exports.deleteOrder = factory.deleteOne(OrderModel);

exports.getAllEmployees = factory.getAll(EmployeeModel);
exports.getEmployee = factory.getOne(EmployeeModel);
exports.updateEmployee = factory.updateOne(EmployeeModel);
exports.deleteEmployee = factory.deleteOne(EmployeeModel);


async function createAnEmployee(id, salary, type){
    let isDeliveryPerson = false;
    let isManager = false;
    if(type === 'employee-dilivery')
        isDeliveryPerson = true;
    if(type === 'sub-admin')
        isManager = true;
    let employee = await EmployeeModel.create({
        user_id: id,
        isDeliveryPerson,
        isManager,
        isNewEmployee: true,
        salary,
    })
    if(employee)
        return employee
}

exports.confirmOrder = async (req, res, next)=>{
    try{
        let order = await OrderModel.findById(req.params.order_id).populate({path : 'user'})
        order.orderIsConfirmed = true;
        await OrderModel.findByIdAndUpdate(order._id, order)

        await new Email(order.user, `${req.protocol}://${req.get('host')}/proceed-for-payment/${order._id}/${order.user.email}/1`).send_order(order, "Grant the order");

        return res.status(200).json({
            status: 'success',
            data: order
        });
    }catch(err){
        errorController(req, res, err)
    }
}

exports.FireAnEmployee = async (req, res,next) => {
    try{
        let user = UserModel.findById(req.params.id);
        if(user){
            let emp = await EmployeeModel.find({user: user._id});
            if(emp){
                emp.isFired = true;
                user.role = 'user'
    
                await UserModel.findByIdAndUpdate(user._id, user);
                const emp = await EmployeeModel.findByIdAndUpdate(emp._id, emp);
                return res.status(200).json({
                    status: 'success',
                    data: emp
                });
            }else{
                return res.status(401).json({
                    status: 'fail',
                    message: 'Cound not find User'
                    })
            }
        }else{
             return res.status(401).json({
                status: 'fail',
                message: 'Cound not find User'
                })
        }
    }catch(err){
        errorController(req, res, err)
    }
}

exports.hireAnEmployee = async (req, res,next)=>{
    try {
        if(!req.params.id || !req.query.salary || !req.query.typeEmp)
            return res.status(400).json({
                status: 'error',
            });
        let user = await UserModel.findById(req.params.id);
        if(user){
            user.role = req.query.typeEmp;
            const emp = await createAnEmployee(req.params.id, req.query.salary,user.role)
            await UserModel.findByIdAndUpdate(user._id, user);
            if(emp)
                return res.status(200).json({
                    status: 'success',
                    data: emp
                });
            else
                return res.status(400).json({
                    status: 'error',
                });
        }else
            return res.status(400).json({
                status: 'error',
            });
    }catch(err){
        errorController(req, res, err)
    }
}

exports.getCloths = factory.getAll(ClothModel);
exports.getOneCloth = factory.getOne(ClothModel);
exports.updateCloth = factory.updateOne(ClothModel);
exports.deleteCloth = factory.deleteOne(ClothModel);

exports.allOrdersByDId = async (req, res, next) => {
    const emp = await EmployeeModel.findById(req.params.emp_id)
    let toTargetOrder = []
    for(let i = 0; i < emp.toTargetOrder.length; i++){
        let order = await OrderModel.findById(emp.toTargetOrder[i])
        toTargetOrder.push(order)
    }
    return res.status(200).json({
        status: 'success',
        data: toTargetOrder
    });
}
exports.allShipmentByDId = async (req, res, next) => {
    const emp = await EmployeeModel.findById(req.params.emp_id)
    let totalShipments = []
    for(let i = 0; i < emp.totalShipments.length; i++) {
        let order = await ShipmentsModel.findById(emp.totalShipments[i])
        totalShipments.push(order)
    }
    return res.status(200).json({
        status: 'success',
        data: totalShipments
    });
}
exports.AllPendingOrdersByMId = async (req, res, next) => {
    const emp = await EmployeeModel.findOne({ user_id : req.user._id} )
    let allPendingOrdersConfirmed = [];
    for(let i = 0; i < emp.toOrderToBeAvailable.length; i++) {
        let order = await OrderModel.findById(emp.toOrderToBeAvailable[i])
        allPendingOrdersConfirmed.push(order);
    }
    return res.status(200).json({
        status: 'success',
        data: allPendingOrdersConfirmed
    });
}

exports.AllPendingOrdersNotConfirmed = async (req, res, next) => {
    const emp = await EmployeeModel.findById(req.params.emp_id)
    let allPendingOrdersNotConfirmed = [];
    for(let i = 0; i < emp.toOrderToBeAvailable.length; i++) {
       let order = await OrderModel.findById(emp.toOrderToBeAvailable[i])
       if(!order.orderIsConfirmed){
            allPendingOrdersNotConfirmed.push(order);
       }
    }

    return res.status(200).json({
        status: 'success',
        data: allPendingOrdersNotConfirmed
    });
}


exports.AllOrdersNotDeliverdByDId = async (req, res, next) => {
    const emp = await EmployeeModel.findById(req.params.emp_id)
    let toTargetOrder = [];
    for(let i = 0; i < emp.toTargetOrder.length; i++) {
       let order = await OrderModel.findById(emp.toTargetOrder[i])
        if(!order.delivered){
            toTargetOrder.push(order);
        }
    }

    return res.status(200).json({
        status: 'success',
        data: toTargetOrder
    });
}

exports.allShipmentNotDeliverdByDId = async (req, res, next) => {
    const emp = await EmployeeModel.findById(req.params.emp_id)
    let totalShipments = []
    for(let i = 0; i < emp.totalShipments.length; i++) {
        let shipment = await ShipmentsModel.findById(emp.totalShipments[i])
        if(shipment.dilivered)
            totalShipments.push(shipment)
    }
    return res.status(200).json({
        status: 'success',
        data: totalShipments
    });
}