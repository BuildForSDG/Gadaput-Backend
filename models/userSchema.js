const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: 'Required' },
  lastName: { type: String, required: 'Required' },
  username: { type: String, required: 'Required' },
  email: { type: String, required: 'Required' },
  password: { type: String, required: 'Required' }
});

mongoose.model('users', userSchema);
