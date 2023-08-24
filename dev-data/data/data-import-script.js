const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/Tour');
const Review = require('../../models/Review');
const User = require('../../models/User');

dotenv.config({ path: `${__dirname}/../../config.env` });

const tours = JSON.parse(
  fs.readFileSync(path.join(`${__dirname}/./tours.json`)),
);
// const reviews = JSON.parse(
//   fs.readFileSync(path.join(`${__dirname}/./reviews.json`)),
// );
// const users = JSON.parse(
//   fs.readFileSync(path.join(`${__dirname}/./users.json`)),
// );

const importData = async () => {
  try {
    await Tour.create(tours);
    // await Review.create(reviews);
    // await User.create(users, { validateBeforeSave: false });
    console.log('data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    // await Review.deleteMany();
    // await User.deleteMany();
    console.log('deleted successfully');
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
};

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('connection successful');

    if (process.argv[2] === '--import') {
      importData();
    }
    if (process.argv[2] === '--delete') {
      deleteData();
    }
  });
