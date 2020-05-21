const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: 'Required' },
  population: { type: Number, required: 'Required' },
  location: { type: String, required: 'Required' },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Community', communitySchema);
