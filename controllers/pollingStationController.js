const PollingStation = require('../models/PollingStation');

const handleMongooseError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate field value',
      details: err.keyValue,
    });
  }

  return res.status(500).json({ error: 'Internal server error' });
};

exports.createStation = async (req, res) => {
  try {
    const station = new PollingStation(req.body);
    await station.save();
    res.status(201).json(station);
  } catch (err) {
    handleMongooseError(err, res);
  }
};

exports.getAllStations = async (req, res) => {
  try {
    const stations = await PollingStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStationById = async (req, res) => {
  try {
    const station = await PollingStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Polling station not found' });
    }
    res.json(station);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStation = async (req, res) => {
  try {
    const station = await PollingStation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!station) {
      return res.status(404).json({ error: 'Polling station not found' });
    }

    res.json(station);
  } catch (err) {
    handleMongooseError(err, res);
  }
};

exports.deleteStation = async (req, res) => {
  try {
    const station = await PollingStation.findByIdAndDelete(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Polling station not found' });
    }
    res.json({ message: 'Polling station deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
