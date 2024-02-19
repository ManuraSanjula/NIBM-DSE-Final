const ClothHutReview = require('./../Models/ClothHutReviewModel');
const errorController = require('./errorController');
const UserModel = require('../Models/userModel');
const ClothHutModel = require('../Models/ClothHutModel')

exports.setTourUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = async (req, res, next) => {
  try {
    const review = await ClothHutReview.find();
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
    const review = await ClothHutReview.findById(req.params.id);
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
    if (!req.body.ClothHutReview || !req.body.rating || !req.body.ClothHut) {
      return res.status(400).json({
        status: 'fail',
        message: 'Major Fileds ClothHutReview , Rating , ClothHut Missing.',
      })
    }
    req.body.user = req.user._id;
    const user = await UserModel.findById(req.body.user._id);
    console.log(req.body.ClothHut)
    const ClothHut =  await ClothHutModel.findById(req.body.ClothHut);
  
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message:'Not Authenthicate'
      })
    }

    if (!ClothHut) {
      return res.status(400).json({
        status: 'fail',
        message:'No Cloth Found Given Id'
      })
    }
    const review = await ClothHutReview.create(req.body);
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
    if (req.body.ClothHutReview || req.body.rating || !req.body.ClothHut) {
      return res.status(400).json({
        status: 'fail',
        message: 'Major Fileds ClothHutReview , Rating , ClothHut Missing.',
      })
    }
    const review = await ClothHutReview.findOneAndUpdate(req.params.id, req.body);
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
    const review = await ClothHutReview.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      status: 'success',
    })
  } catch (err) {
    errorController(req, res, err)
  }
}
