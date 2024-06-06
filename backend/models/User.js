// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   email: { type: String, required: true }, 
//   userType: { type: String, required: true }, 
//   otp: { type: String },
//   otpExpires: { type: Date }
// });

// UserSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// UserSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true }, // Ensure email is required
  userType: { type: String, required: true }, // superadmin, admin, department
  otp: { type: String },
  otpExpires: { type: Date }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
