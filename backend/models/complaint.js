const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    title: String,
    issue: String,
    location: String,
    phone: String,
    priority: String,
    department: String,
    assignedWorker: String,
    status: { type: String, default: 'Pending' },
    image: String,
    assignedAt: Date,
    equipment: [String], // New field to track required equipment
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
