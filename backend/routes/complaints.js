const express = require('express');
const multer = require('multer');
const router = express.Router();
const Complaint = require('../models/complaint');

const upload = multer({ dest: 'uploads/' });

// Mock function to check equipment availability (replace with actual logic)
const isEquipmentAvailable = (requiredEquipment) => {
    // Mocked inventory, replace with actual inventory logic
    const inventory = {
        tool1: 10,
        tool2: 0, // Assume tool2 is unavailable
        tool3: 5
    };
    return requiredEquipment.every(equipment => inventory[equipment] > 0);
};

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
    const { title, issue, location, phone, priority, department, equipment } = req.body;
    const image = req.file ? req.file.path : null;

    const complaint = new Complaint({
        title,
        issue,
        location,
        phone,
        priority,
        department,
        status: 'Pending',
        image,
        equipment: equipment ? equipment.split(',') : [], // Store equipment as an array
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
        const complaint = await Complaint.findById(req.params.id);

        // Check worker and equipment availability
        const workersAvailable = ['Worker 1', 'Worker 2']; // Replace with actual worker availability logic
        const equipmentAvailable = isEquipmentAvailable(complaint.equipment);

        if (!workersAvailable.includes(assignedWorker) || !equipmentAvailable) {
            complaint.status = 'Delayed';
            const io = req.app.get('io');
            io.emit('complaintUpdated', complaint);
            await complaint.save();
            return res.status(200).json({ message: 'Work delayed due to unavailable resources', complaint });
        }

        complaint.assignedWorker = assignedWorker;
        complaint.status = 'In Progress';
        complaint.assignedAt = new Date();
        await complaint.save();

        const io = req.app.get('io');
        io.emit('complaintUpdated', complaint);
        res.json(complaint);
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

// Mark complaint as delayed by admin
router.patch('/delay/:id', async (req, res) => {
    try {
        const updatedComplaint = await Complaint.findByIdAndUpdate(req.params.id, {
            status: 'Delayed',
        }, { new: true });
        const io = req.app.get('io');
        io.emit('complaintUpdated', updatedComplaint);
        res.json(updatedComplaint);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Reassign and resume work on delayed complaint
router.patch('/resume/:id', async (req, res) => {
    const { assignedWorker } = req.body;
    try {
        const complaint = await Complaint.findById(req.params.id);

        // Check worker and equipment availability
        const workersAvailable = ['Worker 1', 'Worker 2']; // Replace with actual worker availability logic
        const equipmentAvailable = isEquipmentAvailable(complaint.equipment);

        if (!workersAvailable.includes(assignedWorker) || !equipmentAvailable) {
            return res.status(200).json({ message: 'Cannot resume work due to unavailable resources', complaint });
        }

        complaint.assignedWorker = assignedWorker;
        complaint.status = 'In Progress';
        complaint.assignedAt = new Date();
        await complaint.save();

        const io = req.app.get('io');
        io.emit('complaintUpdated', complaint);
        res.json(complaint);
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
