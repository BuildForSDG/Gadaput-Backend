/* eslint-disable no-unused-vars */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dbconnection = require('./models');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Enable CORS for all HTTP methods
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// basic router
app.get('/', (req, res) => {
  res.send({ message: 'Welcome to GadaPut' });
});

// Routes
const usersRoute = require('./routes/users');
const communitiesRoute = require('./routes/communities');

app.use('/users', usersRoute);
app.use('/communities', communitiesRoute);


// PORT
const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on Port ${PORT}`);
});
