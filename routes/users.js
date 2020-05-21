/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

let token;
let decoded;

const checkToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (header) {
    // const bearer = header.split(' ');
    token = header;

    decoded = jwt.verify(token, 'secretkey');
    // req.token = token;
    console.log(req.token);
    next();
  } else {
    // If header is undefined return Forbidden (403)
    res.send({ message: 'You need to log in' });
  }
};

router.get('/profile', checkToken, (req, res) => {
  // eslint-disable-next-line no-shadow
  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      // If error send Forbidden (403)
      console.log('ERROR: Could not connect to the protected route');
      // render the error page
      res.status(err.status || 403).send('ERROR: Could not connect to the protected route');
    } else {
      // If token is successfully verified, we can send the autorized data
      console.log('Token verified');
      return res.status(200).send('Here is your profile');
    }
    return res.end();
  });
});

module.exports = router;
