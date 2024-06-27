const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    userType: { type: String, required: true },
    department: { type: String },
    otp: { type: String },
    otpExpires: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
