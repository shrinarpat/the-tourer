const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/./config.env` });
const app = require('./app');
const mongoose = require('mongoose');

const DB_CONNECTION = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('connected to database');
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
