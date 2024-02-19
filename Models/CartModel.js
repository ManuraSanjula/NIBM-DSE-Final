const mongoose = require('mongoose');
const ClothModel = require('./ClothModel');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Cart must belong to a user']
    },
    Cloth: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cloths',
        required: [true, 'Cart must belong to a Cloth.']
    },
    price: {
        type: Number,
       
    },
    quantity: {
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
cartSchema.index({ Cloth: 1 }, { unique: true });

cartSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'Cloth',
        select: 'name coverImg img description'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
}); 

cartSchema.pre('save', async function (next) {
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

cartSchema.post(/^find/, function (docs, next) {
    next();
});


const Cart = mongoose.model('carts', cartSchema);

module.exports = Cart;
