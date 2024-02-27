const orderModel = require('../Models/OrderModel');
const PDFDocument = require('pdfkit');
const Email = require('../utils/email');
const errorController = require('./errorController');
const EmployeeModel = require('../Models/EmployeesModel');
const ShipementModel = require('../Models/ShipmentModel');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const UserModel = require("../Models/UserModel")
function lkrToUsd(amountInLKR, exchangeRate) {
    return amountInLKR / exchangeRate;
}

const exchangeRate = 0.005;

exports.getCheckoutSession = async (req, res, next) => {
    const order = await orderModel.findById(req.params.orderId).populate({path : "Cloth"});

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/success-purchase/${order._id}/${req.params.email}`,
        cancel_url: `${req.protocol}://${req.get('host')}/success-cancel`,
        customer_email: req.params.email,
        client_reference_id: req.params.orderId,
        line_items: [
            {
                price_data: {
                    currency: 'lkr',
                    product_data: {
                        name: `${order.Cloth.name} order`,
                        description: order.Cloth.description,
                        images: [
                            `${req.protocol}://${req.get('host')}/img/orders/${order.Cloth.coverImg}`
                        ],
                    },
                    unit_amount: order.price * 10, // Amount in smallest currency unit (e.g., cents).
                },
                quantity: 1
            }
        ],
        mode: 'payment',
    });


    // 3) Create session as response
    res.status(200).json({
        status: 'success',
        session
    });
}

const createBookingCheckout = async session => {
    const order = session.client_reference_id;
    const user = (await User.findOne({ email: session.customer_email })).id;
    const price = session.display_items[0].amount / 100;
    await Booking.create({ order, user, price });
};

exports.webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed')
        createBookingCheckout(event.data.object);

    res.status(200).json({ received: true });
};

async function setDeliveryJob(orderItem, req) {

    const emp = await EmployeeModel.find({ isDeliveryPerson: true });
    const oneDEmp = emp[Math.floor(Math.random() * emp.length)];
    if (oneDEmp.toTargetOrder === undefined || oneDEmp.toTargetOrder == null || oneDEmp.toTargetOrder.length <= 0) {
        oneDEmp.toTargetOrder = [];
        oneDEmp.toTargetOrder.push(orderItem._id);
    } else {
        oneDEmp.toTargetOrder.push(orderItem._id);
    }
    const customer = await UserModel.findOne({email: req.params.email })
    const shipment = await ShipementModel.create({
        user: customer._id,
        order : orderItem._id,
        status:"pending",
        dilverPerson: oneDEmp._d
    })

    if (oneDEmp.totalShipments === undefined || oneDEmp.totalShipments == null || oneDEmp.totalShipments.length <= 0) {
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
        let orderItem = await orderModel.findById(req.params.id);
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
        orderItem.successfullyPayed = true
        orderItem = await orderModel.findByIdAndUpdate(orderItem._id, orderItem);

        return res.status(200).render('order_succes');
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
