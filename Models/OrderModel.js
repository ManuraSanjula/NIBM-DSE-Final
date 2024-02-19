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
    confrimRecive: {
        type: Boolean,
        default: false
    }
});


orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'Cloth',
        select: 'name description '
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