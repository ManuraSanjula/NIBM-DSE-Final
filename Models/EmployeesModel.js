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
    JoinDate: {
        type: Date,
        default: Date.now
    },
    toTargetOrder: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Orders'
        }
    ],
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

const Employees = mongoose.model('Employees', EmployeesSchema);

module.exports = Employees;
