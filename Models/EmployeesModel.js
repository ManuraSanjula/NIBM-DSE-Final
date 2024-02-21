const mongoose = require('mongoose');
const EmployeesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    isDeliveryPerson:{
        type: Boolean,
        default: false
    },
    isManager:{
        type: Boolean,
        default: false
    },
    isOwner:{
        type: Boolean,
        default: false
    },
    JoinDate: {
        type: Date,
        default: Date.now
    },
    toOrderToBeAvailable: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Orders'
    }],
    toTargetOrder: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Orders'
        }
    ],
    totalShipments: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Shipments'
    }],
    isNew:{
        type: Boolean,
        default: true
    },
    isActive:{
        type: Boolean,
        default: true
    },
    salary:{
        type: Number,
    },
    leaves:{
        type: Number,
        max: 20,
        default:0
    },
    half_days:{
        type: Number,
        max: 30,
        default:0
    },
    isFired:{
        type: Boolean,
        default: false
    }
});

EmployeesSchema.pre(/^find/, function (next) {
    this.populate({
        path: ['totalShipments','toTargetOrder','toOrderToBeAvailable'],
    })
    next();
}); 

const Employees = mongoose.model('Employees', EmployeesSchema);

module.exports = Employees;
