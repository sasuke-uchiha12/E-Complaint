const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

router.post('/signup', async (req, res) => {
    try {
        const { uname, password, email, phoneNumber, name } = req.body;
        const userId = generateUserId();
        const existingUser = await User.findOne({ username: uname });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            userId,
            username: uname,
            password: hashedPassword,
            email,
            phoneNumber,
            name
        });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { uname, password } = req.body;
        const user = await User.findOne({ username: uname });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        const tokenPayload = {
            userId: user._id,
            username: user.username,
            department: user.department
        };

        const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ token, role: user.role, department: user.department });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
