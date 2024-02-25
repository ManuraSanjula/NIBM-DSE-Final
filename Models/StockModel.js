const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    cloth: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cloths',
    },
    prerequisites:{
        type: [{
            name: String,
            fullied: Boolean
        }]
    }
});


const stock = mongoose.model('InventoryStocks', stockSchema);

module.exports = stock;