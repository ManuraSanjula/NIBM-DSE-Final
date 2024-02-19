const mongoose = require('mongoose');
const Cloth = require('./ClothModel');
const User = require('./UserModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
      unique: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    Cloth: {
      type: mongoose.Schema.ObjectId,
      ref: 'Cloths',
      required: [true, 'Review must belong to a Cloth.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ Cloth: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'Cloth',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (ClothId) {
  const stats = await this.aggregate([
    {
      $match: { Cloth: ClothId }
    },
    {
      $group: {
        _id: '$Cloth',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // (stats);

  if (stats.length > 0) {
    await Cloth.findByIdAndUpdate(ClothId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Cloth.findByIdAndUpdate(ClothId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save',async function () {
  // this points to current review
  const Cloth = await Cloth.findById(this.Cloth);
  const arry = Cloth['review'];
  arry.push(this._id);
  Cloth['review'] = arry
  Cloth.save()
  this.constructor.calcAverageRatings(this.Cloth);
});

reviewSchema.post('save',async function () {
  // this points to current review
  const user = await User.findById(this.user);
  const arry = user['review'];
  arry.push(this._id);
  user['review'] = arry
  user.save({ validateBeforeSave: false })
});


reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.Cloth);
});

reviewSchema.post(/^find/, function (docs, next) {
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
