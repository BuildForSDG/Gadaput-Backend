/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const communitiesModel = mongoose.model('communities');

router.get('/', (req, res) => {
  communitiesModel
    .find()
    .then((community) => {
      console.log(community);
      res.send({ community });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving Communities.'
      });
    });

  res.send({ massage: 'Welcome to Gadaput Communities' });
});

module.exports = router;
