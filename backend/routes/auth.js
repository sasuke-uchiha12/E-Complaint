const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Signup Endpoint
router.post('/signup', async (req, res) => {
  const { name, email, password, userType, department } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      username: name,
      email,
      password, // Store plain text password
      userType,
      department: userType === 'department' ? department : undefined
    });

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP email' });
      }
      console.log('OTP email sent:', info.response);
      return res.status(200).json({ message: 'OTP sent to email' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP Endpoint
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    user.otp = null;  // Clear the OTP after successful verification
    user.otpExpires = null;
    await user.save();

    return res.status(200).json({ message: 'OTP verified, please login' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.userType === 'admin' || user.userType === 'superadmin') {
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
      user.otp = otp;
      user.otpExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ message: 'Error sending OTP email' });
        }
        return res.status(200).json({ message: 'OTP sent to email' });
      });
    } else {
      const token = jwt.sign({ id: user._id, userType: user.userType, department: user.department }, JWT_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, { httpOnly: true });
      return res.status(200).json({ token });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Forgot Password Endpoint
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ message: 'Error sending OTP email' });
      }
      console.log('OTP email sent:', info.response);
      return res.status(200).json({ message: 'OTP sent to email' });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reset Password Endpoint
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid OTP or OTP expired' });
    }

    user.password = newPassword; // Store plain text password
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
