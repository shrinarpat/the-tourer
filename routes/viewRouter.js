const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/me', authController.protect, viewController.getMe);

router.use(authController.isLoggedIn);
router.get('/', viewController.getOverview);
router.get('/tours/:slug', viewController.getTour);
router.get('/login', viewController.getLogin);

module.exports = router;
