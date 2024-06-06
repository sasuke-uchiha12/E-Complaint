// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const complaintsRouter = require('./routes/complaints');
// const http = require('http');
// const { Server } = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:3000", // Replace with your frontend's URL
//         methods: ["GET", "POST", "PATCH"],
//     },
// });

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost/your-database-name', { useNewUrlParser: true, useUnifiedTopology: true });

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/complaints', complaintsRouter);

// // Socket.io connection
// io.on('connection', (socket) => {
//     console.log('A user connected');
    
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

// app.set('io', io);

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth'); // Ensure this path is correct
const complaintsRouter = require('./routes/complaints');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH"],
  },
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter); // Ensure this path matches the one used in the frontend
app.use('/api/complaints', complaintsRouter);

app.set('io', io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
