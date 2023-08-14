const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');

const app = express();

// ? 1) MIDDLEWARE  //

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(`${__dirname}/public`));
//* Using express.json middleware below
app.use(express.json());

//* Custom middleware below

// const emojiLoggerMiddleware = (req, res, next) => {
//   console.log('😊😊😊😊😊');

//   //! must call next else your request response cycle will stuck
//   next();
// };
// app.use(emojiLoggerMiddleware);

const addRequestedDateMiddleware = (req, res, next) => {
  req.requestedAt = new Date().toISOString();
  next();
};
app.use(addRequestedDateMiddleware);

// ? 2) ROUTERS  //
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
