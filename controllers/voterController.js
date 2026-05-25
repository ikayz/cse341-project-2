const Voter = require('../models/Voter');

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

exports.createVoter = async (req, res) => {
  try {
    const voter = new Voter(req.body);
    await voter.save();
    res.status(201).json(voter);
  } catch (err) {
    handleMongooseError(err, res);
  }
};

exports.getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find();
    res.json(voters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVoterById = async (req, res) => {
  try {
    const voter = await Voter.findById(req.params.id);
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    res.json(voter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateVoter = async (req, res) => {
  try {
    const voter = await Voter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    res.json(voter);
  } catch (err) {
    handleMongooseError(err, res);
  }
};

exports.deleteVoter = async (req, res) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.params.id);
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }
    res.json({ message: 'Voter deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
