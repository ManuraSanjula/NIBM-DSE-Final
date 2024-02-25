const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");

const ClothInventorySchema = new mongoose.Schema({
    _id: {
        type: ObjectId,
        ref: 'Cloths'
    },
    intern_id: {
        type: Number,
    },
    intern_name: {
        type: String
    },
    price:{
        type: Number
    },
    user: [{
        type: ObjectId,
        ref: 'User',
    }],
    user_count:{
        type: Number,
        default: 0
    },
    availability:{
        type: Number,
    },
    allItems: [{
        intern_name: {
            type: String
        },
        user:{
            type: ObjectId,
            ref: 'User'  
        }
    }]
},{ _id: false });

const ClothInvent = mongoose.model('ClothInvent', ClothInventorySchema);
module.exports = ClothInvent;