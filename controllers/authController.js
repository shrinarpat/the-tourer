const util = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    httpOnly: true,
    expiresIn: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    secure: false, // make it true in production
  });

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    passwordConfirm: passwordConfirm,
    role: role,
  });

  // remove password from the user data for client
  newUser.password = undefined;

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) get email and password from request body
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) get email and password from database
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // remove password field before sending the user data to client
  user.password = undefined;

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) get token from request
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in!, Please log in to get access', 401),
    );
  }

  // 2) verify token

  const decoded = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );

  // 3) check if user still exists in db

  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError('User does not exist!', 401));
  }

  // 4) check if user has changed the password after the token is issued

  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401),
    );
  }

  // 5) GRANT ACCESS TO THE PROTECTED ROUTE
  req.user = freshUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on email from req body
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User with provided email does not exist', 404));
  }
  // 2) Generate reset token
  const resetToken = user.createResetPasswordToken();

  user.save({
    validateBeforeSave: false,
  });

  // 3) Send the reset token on user email
  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}. \n If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({
      validateBeforeSave: false,
    });

    return next(
      new AppError(
        'There was an error in sending the email, Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get token from params and encrypt it
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // 2) Get user based on encrypted token and token expiry time
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid token or token is expired', 400));
  }

  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 3) update change password at
  // 4) login and send token
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get password from user
  const { passwordCurrent, password, passwordConfirm } = req.body;

  // 2) get user from db
  const user = await User.findById(req.user.id).select('+password');

  // 3) compare password and update

  if (!(await user.correctPassword(passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.save();

  // 4) login and send token
  createSendToken(user, 201, res);
});