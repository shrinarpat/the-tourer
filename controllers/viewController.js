const Tour = require('../models/Tour');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // TODO 1: Get our tour data from collection
  const tours = await Tour.find();

  // TODO 3: Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // TODO 1: Get our tour data from collection
  const { slug } = req.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with this name', 404));
  }

  // TODO 3: Render that template using tour data from 1)
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

exports.getLogin = (req, res) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com",
    )
    .render('login', {
      title: 'Log into your account',
    });
};

exports.getMe = (req, res) => {
  res.status(200).render('account', {
    title: 'User Account',
  });
};
