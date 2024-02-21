const UserModel = require('../Models/UserModel');
const StocksModel = require('../Models/StockModel'); // Company
const ShipmentsModel = require('../Models/ShipmentModel'); // Company
const ReviewsModel = require('../Models/ReviewModel');
const RefundsModel = require('../Models/RefundModel');
const OrderModel = require('../Models/OrderModel');
const EmployeeModel = require('../Models/EmployeesModel'); // Company
const ClothModel = require('../Models/ClothModel'); // Company
const CartModel = require('../Models/CartModel');
const factory = require('./handlerFactory');
const errorController = require('./ErrorController');

exports.getAllUsers = factory.getAll(UserModel);
exports.getUser = factory.getOne(UserModel);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

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
    if(type == 'Delivery')
        isDeliveryPerson = true;
    let employee = await EmployeeModel.create({
        user: id,
        isDeliveryPerson,
        isNew: true,
        salary,
    })
    if(employee)
        return employee
}

exports.confirmOrder = async (req, res)=>{
    try{
        let order = OrderModel.findById(req.params.id)
        order.orderIsConfirmed = true;

        // send a email to the user that saying stock is available for the order

        await OrderModel.findByIdAndUpdate(order._id, order)
    }catch(err){
        errorController(req, res, err)
    }
}

exports.FireAnEmployee = async (req, res) => {
    try{
        let user = UserModel.findById(req.params.id);
        if(user){
            let emp = EmployeeModel.find({user: user._id});
            if(emp){
                emp.isFired = true;
                user.role = 'user'
    
                await UserModel.findByIdAndUpdate(user._id, user);
                await EmployeeModel.findByIdAndUpdate(emp._id, emp);
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

exports.hireAnEmployee = async (req, res)=>{
    try {
        let user = UserModel.findById(req.params.id);
        if(user){
            user.role = req.query.typeEmp;
            if(createAnEmployee(user._id, req.query.salary,user.role))
                return res.status(200).json({
                    status: 'success',
                    data: refund
                });
            else
                return res.status(500).json({
                    status: 'error',
                });
        }else
            return res.status(400).json({
                status: 'error',
            });
    }catch(err){
        errorController(req, res, error)
    }
}

exports.getCloths = factory.getAll(ClothModel);
exports.getOneCloth = factory.getOne(ClothModel);
exports.updateCloth = factory.updateOne(ClothModel);
exports.deleteCloth = factory.deleteOne(ClothModel);

exports.getCarts = factory.getAll(CartModel);
exports.getOneCart = factory.getOne(CartModel);
exports.updateCart = factory.updateOne(CartModel);
exports.deleteCart = factory.deleteOne(CartModel);