const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get('/me', authController.protect, viewController.getMe);
router.get(
  '/my-bookings',
  authController.protect,
  viewController.getMyBookings,
);

router.use(authController.isLoggedIn);
router.get(
  '/',
  bookingController.createBookingCheckout,
  viewController.getOverview,
);
router.get('/tours/:slug', viewController.getTour);
router.get('/login', viewController.getLogin);

module.exports = router;
