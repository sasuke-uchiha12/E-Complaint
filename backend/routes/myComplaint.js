const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const authenticate = require('../middleware/authenticate');

router.get('/my-complaints', authenticate, async (req, res) => {
    try {
        const department = req.user.department;
        const complaints = await Complaint.find({ department });
        res.status(200).json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
