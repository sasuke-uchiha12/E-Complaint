const bcrypt = require('bcryptjs');

const plainPassword = 'sasuke12';
const hashedPassword = '$2a$10$syeihgRwotwxbRRXuHz38uz6D2ZMLu1MiRh9Q8ukU3wr7mWLrKfme';

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) {
    return console.error('Error during comparison:', err);
  }
  console.log('Password comparison result:', isMatch);
});
