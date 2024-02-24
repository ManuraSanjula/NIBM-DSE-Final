const Review = require('./../Models/ReviewModel');
const errorController = require('./errorController');
const UserModel = require('../Models/UserModel');
const ClothModel = require('../Models/ClothModel')

exports.setClothUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.Cloth) req.body.Cloth = req.params.clothId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const review = await Review.find();
    return res.status(200).json({
      status: 'success',
      data: review
    })
  } catch (err) {
    errorController(req, res, err)
  }
}
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    return res.status(200).json({
      status: 'success',
      data: review
    })
  } catch (err) {
    errorController(req, res, err)
  }
}
exports.createReview = async (req, res, next) => {
  try {
    if (!req.body.review || !req.body.rating || !req.body.Cloth) {
      return res.status(400).json({
        status: 'fail',
        message: 'Major Fileds Review , Rating , Cloth Missing.',
      })
    }
    req.body.user = req.user._id;
    
    const user = await UserModel.findById(req.body.user._id);
    const Cloth =  await ClothModel.findById(req.body.Cloth);
  
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message:'Not Authenthicate'
      })
    }

    if (!Cloth) {
      return res.status(400).json({
        status: 'fail',
        message:'No Cloth Found Given Id'
      })
    }

    const review = await Review.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: review
    })
  } catch (err) {
    errorController(req, res, err)
  }
}
exports.updateReview = async (req, res, next) => {
  try {
    if (!req.body.review || !req.body.rating || !req.body.Cloth) {
      return res.status(400).json({
        status: 'fail',
        message: 'Major Fileds Review , Rating , Cloth Missing.',
      })
    }
    const review = await Review.findOneAndUpdate(req.params.id, req.body);
    return res.status(200).json({
      status: 'success',
      data: review
    })
  } catch (err) {
    errorController(req, res, err)
  }
}
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: 'success',
    })
  } catch (err) {
    errorController(req, res, err)
  }
}
