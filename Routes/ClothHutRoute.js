const express = require('express');
const ClothHutController = require('../Controllers/ClothHutController');
const authController = require('../Controllers/authController');
//const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

//router.use('/:tourId/reviews', reviewRouter);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'sub-admin'),
    ClothHutController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(ClothHutController.getClothHutWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(ClothHutController.getDistances);

router
  .route('/')
  .get(ClothHutController.getAllClothHuts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'sub-admin'),
    ClothHutController.uploadClothHutImages,
    ClothHutController.resizeTourImages,
    ClothHutController.addOneClothHut
  );

router
  .route('/:id')
  .get(ClothHutController.getOneClothHut)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'sub-admin'),
    ClothHutController.uploadClothHutImages,
    ClothHutController.resizeTourImages,
    ClothHutController.updateOneClothHut
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'sub-admin'),
    ClothHutController.disable
  );

module.exports = router;
