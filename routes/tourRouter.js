const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', checkID);

router.get(
  '/alias-top-five',
  tourController.topFiveTour,
  tourController.getAllTours,
);

router.get('/tour-stats', tourController.getTourStats);
router.get('/monthly-plan/:year', tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
