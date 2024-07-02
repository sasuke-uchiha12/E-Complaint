const express = require('express');
const router = express.Router();
// const Complaint = require('../models/Complaint');
const Employee = require('../models/Employees');
// Endpoint to get employees with the number of complaints they have handled
router.get('/complaints-count', async (req, res) => {
  try {
    const complaintCounts = await Complaint.aggregate([
      { $match: { assignedWorker: { $exists: true } } },
      { $group: { _id: '$assignedWorker', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      { $project: { _id: 0, employeeId: '$_id', name: '$employee.name', count: 1 } },
    ]);

    res.status(200).json(complaintCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
