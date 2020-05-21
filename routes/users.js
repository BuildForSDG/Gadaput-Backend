/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const usersModel = mongoose.model('User');

router.get('/', (req, res) => {
  usersModel
    .find()
    .then((User) => {
      console.log(User);
      res.send({ User });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving users.'
      });
    });
});

module.exports = router;
