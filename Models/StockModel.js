const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    cloth: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cloths',
    },
    prerequisites:{
        type: [{
            name: String,
            values: Object
        }]
    }
});


const stock = mongoose.model('Stocks', stockSchema);

module.exports = stock;