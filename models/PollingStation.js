const mongoose = require('mongoose');

const pollingStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    constituency: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model(
  'PollingStation',
  pollingStationSchema,
  'pollingstations',
);
