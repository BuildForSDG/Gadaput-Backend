/* eslint-disable no-console */
const express = require('express');
// const mongoose = require('mongoose');

const router = express.Router();

const Community = require('../models/communitySchema');

// const communityModel = mongoose.model('Community');

router.get('/', (req, res) => {
  // communityModel
  //   .find()
  //   .then((Community) => {
  //     console.log(Community);
  //     res.status(200).send({ Community });
  //     // res.send({ community });
  //   })
  //   .catch((err) => {
  //     res.status(500).send({
  //       message: err.message || 'Something wrong while retrieving Communities.'
  //     });
  //   });
  res.send('welcome to Gadaput');
});

router.post('/community/add', (req, res) => {
  const community = new Community({
    name: req.body.name,
    population: req.body.population,
    location: req.body.location
  });
  community
    .save()
    .then(() => {
      console.log(community);
      res.status(200).send({ community });
      // res.send({ community });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while adding Community.'
      });
    });
});
router.get('/community', (req, res) => {
  Community
    .find()
    .then((communities) => {
      console.log(communities);
      res.status(200).send({ communities });
      // res.send({ community });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving Communities.'
      });
    });
});
router.get('/community/:id', (req, res) => {
  Community.findOne({
    _id: req.params.id
  }).then(
    (community) => {
      res.status(200).json(community);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error
      });
    }
  );
});

module.exports = router;
