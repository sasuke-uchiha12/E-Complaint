const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  department: { type: String },
  userId: { type: String, unique: true, default: () => new mongoose.Types.ObjectId().toString() } // Ensure a unique userId is generated
});

module.exports = mongoose.model('User', UserSchema);
