/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const mongoose = require('mongoose');

const config = require('../config/dbConfig');

mongoose.Promise = global.Promise;

mongoose
  .connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Successfully connected to db');
  })
  .catch((err) => {
    console.log(`cannot connect to db due to ${err}`);
  });

const users = require('./userSchema');
const communities = require('./communitiesSchema');
