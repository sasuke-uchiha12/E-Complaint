const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint');
const authenticate = require('../middleware/authenticate'); // Import authenticate middleware

router.get('/complaints', authenticate, async (req, res) => {
    try {
        const complaints = await Complaint.find({});
        res.status(200).json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
