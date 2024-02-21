const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');

const ClothSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    img: {
        type: [String],
        default: []
    },
    description: {
        type: String,
        min: 10,
        required: true
    },
    likes: Number,
    unLikes: Number,
    ratingsAverage: {
        type: Number,
        default: 3.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    coverImg: {
        type: String,
        default: 'coverImg.png'
    },
    tags: [String],
    price: {
        default: 10,
        type: Number
    },
    like: Boolean,
    review: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Review'
        }
    ],
    offer: {
        type: Boolean,
        default: true
    }
});


ClothSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

ClothSchema.post(/^find/, function (docs, next) {

    next();
});

const Cloth = mongoose.model('Cloths', ClothSchema);

module.exports = Cloth;