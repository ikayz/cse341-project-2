const express = require('express');
const {
  createVoter,
  getAllVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
} = require('../controllers/voterController');
const {
  validateVoterPayload,
  validateVoterUpdate,
  validateVoterId,
} = require('../middleware/voterValidation');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllVoters);
router.get('/:id', validateVoterId, getVoterById);
router.post('/', ensureAuthenticated, validateVoterPayload, createVoter);
router.put(
  '/:id',
  ensureAuthenticated,
  validateVoterId,
  validateVoterUpdate,
  updateVoter,
);
router.delete('/:id', ensureAuthenticated, validateVoterId, deleteVoter);

module.exports = router;
