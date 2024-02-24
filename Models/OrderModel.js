const mongoose = require('mongoose');
const ClothModel = require('./ClothModel')
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Order must belong to a user']
    },
    Cloth: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cloths',
        required: [true, 'Order must belong to a Cloth.']
    },
    Shipement:{
        type: mongoose.Schema.ObjectId,
        ref: 'Shipments',
    },
    price: {
        type: Number,
    },
    quantity: {
        type: Number,
        default: 1,
    },
    orderAt: {
        type: Date,
        default: Date.now
    },
    delivered: {
        type: Boolean,
        default: false
    },
    orderIsConfirmed: {
        type: Boolean,
        default: false
    },
    orderIsSuccesfullyConfirmed: {
        type: Boolean,
        default: false
    },
    confrimRecive: {
        type: Boolean,
        default: false
    },
    HomeDelivery:{
        type: Boolean,
    },
    paymentOnline:
    {
        type: Boolean,
        default: false
    },
    successfullyPayed:{
        type: Boolean,
        default: false
    }
});


orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'Cloth',
        select: 'name description coverImg'
    }).populate({
        path: 'user',
        select: 'name photo address coverImg'
    });
    next();
});

orderSchema.pre('save', async function (next) {
    if (this.quantity === 1) {
        const Cloth = await ClothModel.findById(this.Cloth);
        const Clothprice = Cloth.price;
        this.price = Clothprice
        next();
    } else {
        const Cloth = await ClothModel.findById(this.Cloth);
        const Clothprice = Cloth.price * this.quantity;
        this.price = Clothprice
        next();
    }
});


orderSchema.post(/^find/, function (docs, next) {
  
    next();
});


const order = mongoose.model('Orders', orderSchema);

module.exports = order;