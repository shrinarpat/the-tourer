const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleMongoErrorDB = (err) => {
  let message = 'Something went wrong';
  if (err.code === 11000) {
    // duplicate key error
    message = `Duplicate key error: ${Object.keys(err.keyValue)}`;
  }

  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  let message = 'Invalid input data. ';
  Object.entries(err.errors).forEach((entry) => {
    const [key, value] = entry;
    message += `${key}: ${value.message}. `;
  });
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login agian', 401);

const handleTokenExpiredError = () =>
  new AppError('Token is expired, Please login again', 401);

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
};

const sendErrorProd = (err, req, res) => {
  if (req.originalUrl && req.originalUrl.startsWith('/api')) {
    //Operational error
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming unknown error

      // 1) Log the error
      console.error('ERROR 🔥', err);

      // 2) Send generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong, please try again later',
      });
    }
  } else {
    //Operational error
    // eslint-disable-next-line no-lonely-if
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
      });
    } else {
      // Programming unknown error

      // 1) Log the error
      console.error('ERROR 🔥', err);

      // 2) Send generic message
      res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Something went wrong, please try again later',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    } else if (error.name === 'MongoError') {
      error = handleMongoErrorDB(error);
    } else if (error._message && error._message.includes('validation')) {
      error = handleValidationError(error);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredError();
    }

    sendErrorProd(error, req, res);
  }
};
