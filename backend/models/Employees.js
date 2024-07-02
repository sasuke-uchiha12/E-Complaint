
const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    employeeid: Number,
    name: String,
    designation: String,
});

module.exports = mongoose.model('Employee', EmployeeSchema);
