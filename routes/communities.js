/* eslint-disable no-console */
const express = require('express');

const router = express.Router();

// importing community schema
const Community = require('../models/communitySchema');

// *Communities Route.

router.post('/community/add', (req, res) => {
  // new instance of community to recieve request from client
  const community = new Community({
    name: req.body.name,
    population: req.body.population,
    location: req.body.location
  });
  // save the comunity details to databse
  community
    .save()
    .then(() => {
      console.log(community);
      res.status(200).send({ community });
      // res.send({ community });
    })
    // throw error if community detais is not saved
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while adding Community.'
      });
    });
});

// fetch communities upon request
router.get('/community', (req, res) => {
  Community.find()
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
// Fetch a single community upon request
router.get('/community/:id', (req, res) => {
  Community.findOne({
    _id: req.params.id
  })
    .then((community) => {
      res.status(200).json(community);
    })
    .catch((error) => {
      res.status(404).json({
        error
      });
    });
});

module.exports = router;
