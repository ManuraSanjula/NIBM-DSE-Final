const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    order: {
        type: mongoose.Schema.ObjectId,
        ref: 'Orders',
    },
    status: {
        type: String
    },
    dilivered: {
        type: Boolean,
        default: false
    },
    dilverPerson:{
        type: mongoose.Schema.ObjectId,
        ref: 'Employees',
    },
    feedback: {
        type: String,
    }
});

const shipment = mongoose.model('Shipments', shipmentSchema);

module.exports = shipment;