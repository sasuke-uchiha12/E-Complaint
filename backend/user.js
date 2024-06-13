const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Ensure this path is correct

mongoose.connect('mongodb://localhost:27017/complaints-system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    const plainPassword = 'sasuke12';
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    console.log('Hashed password:', hashedPassword);

    const user = new User({
      username: 'sasuke',
      email: 'tryvasan02@gmail.com',
      password: hashedPassword, // Use the synchronously hashed password
      userType: 'admin'
    });

    await user.save();
    console.log('User created');

    mongoose.connection.close();
  })
  .catch((err) => console.log('MongoDB connection error:', err));
