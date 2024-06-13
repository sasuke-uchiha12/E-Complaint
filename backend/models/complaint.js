const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issue: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  priority: { type: String, required: true },
  department: { type: String, required: true },
  assignedWorker: { type: String },
  status: { type: String, default: 'Pending' },
  image: { type: String },
  assignedAt: { type: Date }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
