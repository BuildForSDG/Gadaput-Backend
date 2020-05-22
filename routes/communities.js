/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// importing community schema
const Community = require('../models/communitySchema');

// Communities Route.

// fetch Communities upon request
router.get('/community', (req, res) => {
  Community.find()
    .then((communities) => {
      console.log(communities);
      res.status(200).send({ communities });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Something wrong while retrieving Communities.'
      });
    });
});
// Fetch a single Community upon request
router.get('/community/:id', (req, res) => {
  Community.findOne({
    _id: mongoose.Types.ObjectId(req.params.id)
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


// Updating a Community
router.put('/community/:id', (req, res) => {
  const community = {
    // normal object
    // _id: req.params.id, // we don't need to update the _id
    name: req.body.name,
    population: req.body.population,
    location: req.body.location
  };

  Community.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.params.id) }, // filter part
    { $set: community }, // update part
    { new: true } // options part, new: true means return the document after the update
  )
    .then((updatedCommunity) => {
      res.status(201).json({
        message: 'Community updated successfully!',
        community: updatedCommunity
      });
    })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
});


// Deleting A community
router.delete('/community/:id', (req, res) => {
  Community.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
    .then(() => {
      res.status(200).json({
        message: 'Community Deleted'
      });
    })
    .catch((error) => {
      res.status(400).json({
        error
      });
    });
});

//   Create Community
router.post('/community', (req, res) => {
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

module.exports = router;
