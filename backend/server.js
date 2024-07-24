const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS middleware
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const complaintRoutes = require('./routes/complaint');
const config = require('./config/config');
const authenticate = require('./middleware/authenticate');
const adminRoutes = require('./routes/admin');
const myComplaints = require('./routes/myComplaint');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }
});
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://127.0.0.1/eooffice';

// Define CORS options
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true // Add this if you need to include credentials like cookies, authorization headers, etc.
};

// Use CORS middleware
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Socket.io setup
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Make io accessible to routers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
app.use('/complaint', authenticate);
app.use('/complaint', complaintRoutes);
app.use('/admin', adminRoutes);
app.use('/complaint', myComplaints);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => console.error('Error connecting to MongoDB:', err));
