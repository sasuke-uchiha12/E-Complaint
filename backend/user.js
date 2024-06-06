const mongoose = require('mongoose');
const User = require('./models/User'); // Ensure this path is correct

mongoose.connect('mongodb://localhost:27017/complaints-system', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');

    const user = new User({
      username: 'computer science',
      email: 'cs@gmail.com', // Ensure email is set
      password: 'sasuke12', // This will be hashed by the pre-save hook
      userType: 'department'
    });

    await user.save();
    console.log('User created');

    mongoose.connection.close();
  })
  .catch((err) => console.log('MongoDB connection error:', err));
