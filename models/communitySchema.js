const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  population: { type: Number, required: true },
  location: { type: String, required: true },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Community', communitySchema);
