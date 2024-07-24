const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authenticate = require('../middleware/authenticate');
const mongoose = require('mongoose');
// Endpoint for the admin to view complaints
router.get('/complaints', authenticate, async (req, res) => {
  try {
    // Query the database for all complaints
    const complaints = await Complaint.find({});
    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/complaints/:complaintId/status', authenticate, async (req, res) => {
  try {
    let { complaintId } = req.params;
    const { status } = req.body;

    // Check if complaintId starts with "com_"
    if (!complaintId.startsWith("com_")) {
      return res.status(400).json({ message: 'Invalid complaint ID format' });
    }

    // Update status of complaint in the database
    const updatedComplaint = await Complaint.findOneAndUpdate(
      { complaintId }, // Search by complaintId field
      { $set: { status } },
      { new: true } // Return the updated document
    );

    // Check if the complaint exists
    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Send response with updated complaint
    res.status(200).json({ message: 'Complaint status updated successfully', complaint: updatedComplaint });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
