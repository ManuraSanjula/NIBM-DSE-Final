const mongoose = require('mongoose');

const refundSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Refund must belong to a user']
    },
    Cloth: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cloths',
        required: [true, 'Refund must belong to a Cloth.']
    },
    price: {
        type: Number,
    },
    evidence: [String],
    feedback: {
        type: String,
        default: 'No Admin FeedBack so far ',
    },
    quantity: {
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    why: {
        type: String,
    },
    success: {
        type: Boolean,
        default: false
    }
});
refundSchema.index({ Cloth: 1 });
refundSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'Cloth',
        select: 'name coverImg img description'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
});


const Refund = mongoose.model('refunds', refundSchema);

module.exports = Refund;
