const mongoose = require('mongoose');
const EmployeesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    NIC: {
        type: String
    },
    LicenceNumber:{
        type: String
    },
    isDeliveryPerson:{
        type: Boolean,
        default: false,
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
    isNewEmployee:{
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
        path: 'user_id',
        select: 'name'
    })
    next();
}); 

const Employees = mongoose.model('Employees', EmployeesSchema);

module.exports = Employees;
