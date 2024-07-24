const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const bodyParser = require('body-parser');
const authenticate = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const app = express();

const Sequence = require('../models/Sequence');

async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Sequence.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.sequence_value;
}

async function generateComplaintId() {
  const lastComplaintId = await getNextSequenceValue('complaintId');
  const complaintId = `com_${lastComplaintId}`;
  return complaintId;
}

app.use(bodyParser.urlencoded({
  extended: true
}));

// Endpoint for submitting complaints
router.post('/submit', authenticate, async (req, res) => {
  try {
    const { description, department } = req.body;
    const name = req.user;
    const complaintId = await generateComplaintId();
    const newComplaint = new Complaint({ name, complaintId, description, department });
    await newComplaint.save();
    res.status(201).json({ message: 'Complaint submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
