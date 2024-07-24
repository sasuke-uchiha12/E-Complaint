const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint');
const authenticate = require('../middleware/authenticate'); // Import authenticate middleware

router.get('/my-complaints', authenticate, async (req, res) => {
    const { department } = req.query;

    try {
        const complaints = await Complaint.find({ department });
        res.status(200).json(complaints);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
