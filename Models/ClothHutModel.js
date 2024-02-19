const mongoose = require('mongoose');
const slugify = require('slugify');
const Cloth = require('./ClothModel');

const ClothHutModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A ClothHut must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A ClothHut name must have less or equal then 40 characters'],
            minlength: [10, 'A ClothHut name must have more or equal then 10 characters']
            // validate: [validator.isAlpha, 'ClothHut name must only contain characters']
        },
        slug: String,
        GroupSizePerTable: {
            type: Number,
            default: 4
        },
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
        summary: {
            type: String,
            trim: true,
            required: [true, 'A ClothHut must have a summary']
        },
        description: {
            type: String,
            trim: [true, 'A ClothHut must have a description']
        },
        imageCover: {
            type: String,
            required: [true, 'A ClothHut must have a cover image']
        },
        images: [String],
        openAt: {
            type: String,
            required: true
        },
        Location: {
            // GeoJSON
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String
        },
        reviews: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'ClothHutReview'
            }
        ],
        Cloths: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'Cloths'
            }
        ],
        chefs: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

ClothHutModel.index({ price: 1, ratingsAverage: -1 });
ClothHutModel.index({ slug: 1 });
ClothHutModel.index({ startLocation: '2dsphere' });


ClothHutModel.post('save', async function () {
    const array = [...this.Cloths];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        const Cloth = await Cloth.findById(element);
        const ClothHutSet = new Set(Cloth.ClothHuts);
        ClothHutSet.add(this._id);
        Cloth.ClothHuts = Array.from(ClothHutSet);
        Cloth.save();
    }

});
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
ClothHutModel.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});


ClothHutModel.post(/^find/, function (docs, next) {
    next();
});


const ClothHut = mongoose.model('ClothHuts', ClothHutModel);

module.exports = ClothHut;
