// eslint-disable-next-line prefer-const
let mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  passwordResetToken: String,
  passwordResetExpires: Date,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
