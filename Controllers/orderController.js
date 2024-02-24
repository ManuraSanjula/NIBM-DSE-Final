const orderModel = require('../Models/OrderModel');
const PDFDocument = require('pdfkit');
const Email = require('../utils/email');
const errorController = require('./errorController');
const EmployeeModel = require('../Models/EmployeesModel');
const ShipementModel = require('../Models/ShipmentModel');

async function setDeliveryJob(orderItem, req) {

    const emp = EmployeeModel.find({ isDeliveryPerson: true });
    const oneDEmp = emp[Math.floor(Math.random() * emp.length)];
    if (oneDEmp.toTargetOrder == undefined || oneDEmp.toTargetOrder == null || oneDEmp.toTargetOrder.length <= 0) {
        oneDEmp.toTargetOrder = [];
        oneDEmp.toTargetOrder.push(orderItem._id);
    } else {
        oneDEmp.toTargetOrder.push(orderItem._id);
    }
    const shipment = await ShipementModel.create({
        user: req.user._id,
        order : orderItem._id,
        status:"pending",
        dilverPerson: oneDEmp._d
    })

    if (oneDEmp.totalShipments == undefined || oneDEmp.totalShipments == null || oneDEmp.totalShipments.length <= 0) {
        oneDEmp.totalShipments = [];
        oneDEmp.totalShipments.push(shipment._id);
    } else {
        oneDEmp.totalShipments.push(shipment._id);
    }

    await EmployeeModel.findByIdAndUpdate(oneDEmp._id, oneDEmp);
    // after notify the DeliveryPerson
}

exports.success_fully_confirm_order = async (req, res, next)=>{
    try{
        let orderItem = await orderModel.findOne({ user: req.user, _id: req.params.id });
        if (!orderItem) {
            return res.status(400).json({
                status: 'fail',
                message: 'No found Order'
            })
        }
        if(!orderItem.orderIsConfirmed){
            return res.status(400).json({
                status: 'fail',
                message: 'Your Order have not confirmed by management yet'
            })
        }
        if(orderItem.paymentOnline)
            orderItem.successfullyPayed = true;

        if(orderItem.HomeDelivery)
            await setDeliveryJob(orderItem, req);

        orderItem.orderIsSuccesfullyConfirmed = true;
        orderItem = await orderModel.findByIdAndUpdate(orderItem._id, orderItem);

        return res.status(200).json({
            status: 'success',
        })
    }catch(err){
        errorController(req, res, err)
    }
}


exports.getInvoice = async (req, res, next) => {
    try {
        const orderItem = await orderModel.findOne({ user: req.user, _id: req.params.id });
        if (!orderItem) {
            return res.status(400).json({
                status: 'fail',
                message: 'No found Order'
            })
        }
        if(!orderItem.orderIsConfirmed){
            return res.status(400).json({
                status: 'fail',
                message: 'Your Order have not confirmed by management yet'
            })
        }
        const invoiceName = 'invoice-' + req.params.id + '.pdf';
        const pdfDoc = new PDFDocument();
        console.log(orderItem.quantity)
        console.log(orderItem.price)
        console.log(orderItem.orderAt)
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            'inline; filename="' + invoiceName + '"'
        );
        pdfDoc.pipe(res);

        pdfDoc.fontSize(26).text('Invoice', {
            underline: true
        });
        pdfDoc.text('-----------------------');
        pdfDoc.fontSize(20).text('Total Price: $' + orderItem.price);
        pdfDoc.text('-------------------------');
        pdfDoc.text('-------------------------');
        pdfDoc.fontSize(20).text('Total quantity: $' + orderItem.quantity);
        pdfDoc.fontSize(20).text('orderAt: $' + orderItem.orderAt);

        pdfDoc.end();
    } catch (error) {
        return res.status(400).json({
            status: 'fail',
            message:err.message
        })
    }

};

exports.confrimRecive = async (req, res, next) => {
    try {
        if (!req.user._id || !req.params.id) {
            return res.status(400).json({
                status: 'fail',
                data: null,
                message: 'UserID and orderId Missing  '
            })
        }
        const orderItem = await orderModel.findOne({ user: req.user, _id: req.params.id });
        if(!orderItem.orderIsConfirmed){
            return res.status(400).json({
                status: 'fail',
                message: 'Your Order have not confirmed by management yet'
            })
        }
        if (!orderItem) {
            return res.status(400).json({
                status: 'fail',
                data: null,
                message: 'No found orderItem please give correct id  '
            })
        }

        orderItem.confrimRecive = true;
        orderItem.save();
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/user/order/${orderItem._id}/getInvoice?userId=${req.user._id}`;
        await new Email(req.user, resetURL).confrimOrder();
        return res.status(201).json({
            status: 'success',
            data: orderItem,
        })
    } catch (error) {
        errorController(req, res, err)
    }
}

exports.checkData = (req, res, next) => {
    req.body.user = req.user;
    if (!req.body.hasOwnProperty('user') || !req.body.hasOwnProperty('Cloth')) {
        return res.status(400).json({
            status: 'failed',
            message: 'major fields are missing Ex - Cloth , User '
        })
    }
    return next();
}

let setOrdersToAvailable = async (newOrder) => {
    const emp = EmployeeModel.find({ isManager: true });
    const oneMEmp = emp[Math.floor(Math.random() * emp.length)];

    if (oneMEmp.toOrderToBeAvailable === undefined || oneMEmp.toOrderToBeAvailable == null || oneMEmp.toOrderToBeAvailable.length <= 0) {
        oneMEmp.toOrderToBeAvailable = [];
        oneMEmp.toOrderToBeAvailable.push(newOrder._id);
    } else {
        oneMEmp.toOrderToBeAvailable.push(newOrder._id);

    await EmployeeModel.findByIdAndUpdate(oneMEmp._id, oneMEmp);
}


exports.createOrder = async (req, res, next) => {
    try {
        const newOrder = await orderModel.create(req.body)
        await setOrdersToAvailable(newOrder)
        return res.status(201).json({
            size: newOrder.length,
            status: 'success',
            data: newOrder,
        })
    } catch (error) {
        errorController(req, res, err)
    }
}
exports.getOneOrder = async (req, res, next) => {
    try {
        if (!req.user._id || !req.params.id) {
            return res.status(400).json({
                status: 'fail',
                data: null,
                message: 'UserID and orderId Missing  '
            })
        }
        const orderItem = await orderModel.findOne({ user: req.user, _id: req.params.id });
        return res.status(200).json({
            status: 'success',
            data: orderItem,
        })
    } catch (error) {
        errorController(req, res, err)
    }
    }
}
