const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const AppError = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    status: 'success',
    result: user.length,
    data: { user },
  });
});
exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'fail', message: 'This route is not yet defined' });
};
exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'fail', message: 'This route is not yet defined' });
};
exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'fail', message: 'This route is not yet defined' });
};
exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'fail', message: 'This route is not yet defined' });
};

const filterObj = (originalObj, ...allowedFields) => {
  const obj = {};
  Object.keys(originalObj).forEach((key) => {
    if (allowedFields.includes(key)) {
      obj[key] = originalObj[key];
    }
  });
  return obj;
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
