const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/Tour');

dotenv.config({ path: `${__dirname}/../../config.env` });

const data = JSON.parse(
  fs.readFileSync(path.join(`${__dirname}/./tours-simple.json`)),
);

const importData = async () => {
  try {
    const tours = await Tour.create(data);
    if (tours) console.log('data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
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

    console.log(process.argv);

    if (process.argv[2] === '--import') {
      importData();
    }
    if (process.argv[2] === '--delete') {
      deleteData();
    }
  });
