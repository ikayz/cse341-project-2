const mongoose = require('mongoose');

const allowedFields = ['name', 'province', 'constituency', 'ward', 'address'];

const validatePollingStationPayload = (req, res, next) => {
  const data = req.body;

  if ('_id' in data) {
    delete req.body._id;
  }

  const missingFields = allowedFields.filter(field => !(field in data));
  if (missingFields.length) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  const invalidFields = Object.keys(data).filter(
    field => !allowedFields.includes(field),
  );
  if (invalidFields.length) {
    return res.status(400).json({
      error: `Invalid field(s): ${invalidFields.join(', ')}`,
    });
  }

  next();
};

const validatePollingStationId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid ID format' });
  }
  next();
};

module.exports = {
  validatePollingStationPayload,
  validatePollingStationId,
};
