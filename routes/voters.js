const express = require('express');
const mongoose = require('mongoose');
const {
  createVoter,
  getAllVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
} = require('../controllers/voterController');

const router = express.Router();

const allowedFields = [
  'firstName',
  'lastName',
  'nationalID',
  'dateOfBirth',
  'gender',
  'province',
  'constituency',
  'ward',
  'pollingStation',
];

const validateVoterPayload = (req, res, next) => {
  const data = req.body;

  // Remove _id if present (MongoDB generates it automatically)
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

  if (!['male', 'female', 'other'].includes(data.gender)) {
    return res
      .status(400)
      .json({ error: 'gender must be one of male, female, or other' });
  }

  if (isNaN(Date.parse(data.dateOfBirth))) {
    return res
      .status(400)
      .json({ error: 'dateOfBirth must be a valid ISO date string' });
  }

  next();
};

const validateVoterUpdate = (req, res, next) => {
  const data = req.body;
  const updateKeys = Object.keys(data);

  if (updateKeys.length === 0) {
    return res
      .status(400)
      .json({
        error: 'Request body must include at least one field to update',
      });
  }

  const invalidFields = updateKeys.filter(
    field => !allowedFields.includes(field),
  );
  if (invalidFields.length) {
    return res.status(400).json({
      error: `Invalid field(s): ${invalidFields.join(', ')}`,
    });
  }

  if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
    return res
      .status(400)
      .json({ error: 'gender must be one of male, female, or other' });
  }

  if (data.dateOfBirth && isNaN(Date.parse(data.dateOfBirth))) {
    return res
      .status(400)
      .json({ error: 'dateOfBirth must be a valid ISO date string' });
  }

  next();
};

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: 'Invalid voter ID' });
  }
  next();
};

router.get('/', getAllVoters);
router.get('/:id', validateObjectId, getVoterById);
router.post('/', validateVoterPayload, createVoter);
router.put('/:id', validateObjectId, validateVoterUpdate, updateVoter);
router.delete('/:id', validateObjectId, deleteVoter);

module.exports = router;
