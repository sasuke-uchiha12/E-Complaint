const jwt = require('jsonwebtoken');
const config = require('../config/config');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization token is missing' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    try {
        const data = jwt.verify(token, config.jwtSecret);
        req.user = { username: data.username, department: data.department };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.error('Error verifying token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = authenticate;
