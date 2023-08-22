const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'fail', message: 'Please use /signup for registration' });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

const filterObj = (originalObj, ...allowedFields) => {
  const obj = {};
  Object.keys(originalObj).forEach((key) => {
    if (allowedFields.includes(key)) {
      obj[key] = originalObj[key];
    }
  });
  return obj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password update kindly use /updateMyPassword',
      ),
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // user.name = req.body.name || user.name;
  // user.email = req.body.email || user.email;
  // user.save({});

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
