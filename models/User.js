const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    photo: {
      type: String,
    },
    provider: {
      type: String,
      default: 'github',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema, 'users');
