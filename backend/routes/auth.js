const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

router.post('/signup', async (req, res) => {
    const { name, email, password, userType, department } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            username: email,
            email,
            password,
            userType,
            department: userType === 'department' ? department : null
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

router.post('/login', async (req, res) => {
    const { uname, password } = req.body;

    try {
        const user = await User.findOne({ username: uname });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid username or password' });
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
                    console.error('Error sending OTP email:', error);
                    return res.status(500).json({ message: 'Error sending OTP email' });
                }
                console.log('OTP email sent:', info.response);
                return res.status(200).json({ message: 'OTP sent to email' });
            });
        } else {
            const token = jwt.sign({ id: user._id, userType: user.userType, department: user.department }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({ token, role: user.userType, department: user.department });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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

        const token = jwt.sign({ id: user._id, userType: user.userType, department: user.department }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({ message: 'OTP verified successfully', token, role: user.userType, department: user.department });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
