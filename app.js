const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRouter');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ? 1) MIDDLEWARE  //

app.set('view engine', 'pug');
// Serving static files
app.use(express.static(`${__dirname}/public`));

// Set security http response header
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit api calls from same client IP
const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try after an hour',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

//* Custom middleware below

const addRequestedDateMiddleware = (req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
};
app.use(addRequestedDateMiddleware);

// ? 2) ROUTERS  //
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
