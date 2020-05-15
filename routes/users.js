/* eslint-disable no-console */
const express = require('express');
// const mongoose = require('mongoose');

const router = express.Router();

// const usersModel = mongoose.model('users');

router.get('/', (req, res) => {
  //   usersModel
  //     .find()
  //     .then((users) => {
  //       console.log(users);
  //       res.send({ users });
  //     })
  //     .catch((err) => {
  //       res.status(500).send({
  //         message: err.message || 'Something wrong while retrieving users.'
  //       });
  //     });
  res.send({ message: 'Welcome to users page' });
});

module.exports = router;
