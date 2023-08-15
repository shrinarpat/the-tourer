const Tour = require('../models/Tour');

// exports.checkID = (req, res, next, val) => {
//   const tourID = req.params.id * 1;
//   if (tourID > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   next();
// };

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    // result: tours.length,
    // data: tours,
  });
};
exports.createTour = (req, res) => {
  res.status(201).json({
    status: 'success',
    data: null,
  });
};
exports.getTour = (req, res) => {
  const tourID = req.params.id * 1;
  res.status(200).json({ status: 'success', data: null });
};
exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<Tour updated here...>' } });
};
exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
