const express = require('express');
const ClothHutreview = require('./../Controllers/ClothHutReviewController');
const authController = require('./../Controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .post('/',
    authController.restrictTo('user','admin','chef'),
    ClothHutreview.setTourUserIds,
    ClothHutreview.createReview
  );

router
  .route('/:id')
  .get(ClothHutreview.getReview)
  .patch(
    authController.restrictTo('user', 'admin','chef'),
    ClothHutreview.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin','chef'),
    ClothHutreview.deleteReview
  );

module.exports = router;
