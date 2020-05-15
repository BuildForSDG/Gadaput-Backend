const mongoose = require('mongoose');

const communitiesSchema = new mongoose.Schema({
  name: { type: String, required: 'Required' },
  population: { type: Number, required: 'Required' },
  location: { type: String, required: 'Required' },
  verified: { type: Boolean, required: 'Required' }
});

mongoose.model('communities', communitiesSchema);
