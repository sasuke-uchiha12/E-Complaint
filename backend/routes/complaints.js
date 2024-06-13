const express = require('express');
const Complaint = require('../models/Complaint');
const { authenticate } = require('../middleware/authenticate');

module.exports = (io) => {
  const router = express.Router();

  // Middleware to authenticate the user
  router.use(authenticate);

  // Create a complaint
  router.post('/', async (req, res) => {
    const { title, issue, location, phone, priority, department, assignedWorker, status, image, assignedAt } = req.body;

    try {
      const complaint = new Complaint({
        title,
        issue,
        location,
        phone,
        priority,
        department: req.user.userType === 'department' ? req.user.department : department,
        assignedWorker,
        status,
        image,
        assignedAt: new Date()
      });

      await complaint.save();
      io.emit('complaintCreated', complaint); // Emit event
      res.status(201).json(complaint);
    } catch (err) {
      console.error('Error creating complaint:', err);
      res.status(500).json({ message: err.message });
    }
  });

  // Get complaints for a department
  router.get('/department', async (req, res) => {
    try {
      const complaints = await Complaint.find({ department: req.user.department });
      res.status(200).json(complaints);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all complaints (Admin only)
  router.get('/admin', async (req, res) => {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const complaints = await Complaint.find();
      res.status(200).json(complaints);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Update complaint status
  router.put('/:id', async (req, res) => {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    try {
      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      const updates = req.body;
      Object.assign(complaint, updates);

      await complaint.save();
      io.emit('complaintUpdated', complaint); // Emit event
      res.status(200).json(complaint);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  return router;
};
