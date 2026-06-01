const express = require('express');
const {
  createStation,
  getAllStations,
  getStationById,
  updateStation,
  deleteStation,
} = require('../controllers/pollingStationController');
const {
  validatePollingStationPayload,
  validatePollingStationId,
} = require('../middleware/pollingStationValidation');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllStations);
router.get('/:id', validatePollingStationId, getStationById);
router.post(
  '/',
  ensureAuthenticated,
  validatePollingStationPayload,
  createStation,
);
router.put(
  '/:id',
  ensureAuthenticated,
  validatePollingStationId,
  validatePollingStationPayload,
  updateStation,
);
router.delete(
  '/:id',
  ensureAuthenticated,
  validatePollingStationId,
  deleteStation,
);

module.exports = router;
