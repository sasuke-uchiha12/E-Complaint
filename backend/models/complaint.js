const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    // identifier: String,
    title: String,
    issue: String,
    location: String,
    // nature: String,
    phone: String,
    priority: String,
    department: String,
    assignedWorker: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    status: { type: String, default: 'Pending' },
    image: String,
    assignedAt: Date, // New field to track when a worker was assigned
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
