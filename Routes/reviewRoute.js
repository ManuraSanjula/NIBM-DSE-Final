const express = require('express');
const reviewController = require('../Controllers/ReviewController');
const authController = require('../Controllers/AuthController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('admin','sub-admin'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('admin','sub-admin'),
    reviewController.deleteReview
  );

module.exports = router;
