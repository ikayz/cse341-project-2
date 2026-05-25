const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nationalID: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
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
  pollingStation: {
    type: String,
    required: true,
  },
});

const Voter = mongoose.model('Voter', voterSchema, 'voters');

module.exports = Voter;
