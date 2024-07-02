const express = require('express');
const multer = require('multer');
const router = express.Router();
const Complaint = require('../models/complaint');


const upload = multer({ dest: 'uploads/' });

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new complaint
router.post('/', upload.single('image'), async (req, res) => {
    const { identifier, title, issue, location, nature, phone, priority, department, assignedWorker, status } = req.body;
    const image = req.file ? req.file.path : null;
    
    const complaint = new Complaint({
        // identifier,
        title,
        issue,
        location,
        // nature,
        phone,
        priority,
        department,
        assignedWorker,
        status,
        image,
    });

    try {
        const newComplaint = await complaint.save();
        const io = req.app.get('io');
        io.emit('complaintCreated', newComplaint);
        res.status(201).json(newComplaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Assign a worker and update status
router.patch('/assign/:id', async (req, res) => {
    const { assignedWorker } = req.body;
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, {
            assignedWorker,
            status: 'In Progress',
            assignedAt: new Date(),
        }, { new: true });
        const io = req.app.get('io');
        io.emit('complaintUpdated', updatedComplaint);
        res.json(updatedComplaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Mark work as done by department
router.patch('/mark-done/:id', async (req, res) => {
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, {
            status: 'Done',
            doneAt: new Date(),
        }, { new: true });
        const io = req.app.get('io');
        io.emit('complaintUpdated', updatedComplaint);
        res.json(updatedComplaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update status by ID
router.patch('/status/:id', async (req, res) => {
    const { status } = req.body;
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
        const io = req.app.get('io');
        io.emit('complaintUpdated', updatedComplaint);
        res.json(updatedComplaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Check and revert status if needed
setInterval(async () => {
    const sixHoursAgo = new Date(Date.now() - 6 * 60 * 60 * 1000);
    try {
        const complaints = await Complaint.find({ status: 'In Progress', assignedAt: { $lt: sixHoursAgo } });
        complaints.forEach(async (complaint) => {
            const updatedComplaint = await Complaint.findByIdAndUpdate(complaint._id, { status: 'Pending' });
            const io = req.app.get('io');
            io.emit('complaintUpdated', updatedComplaint);
        });
    } catch (err) {
        console.error('Error updating status:', err.message);
    }
}, 60000); // Check every minute



module.exports = router;
