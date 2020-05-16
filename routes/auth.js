const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require('dotenv').config();

const router = express.Router();

const User = require('../models/userSchema');
const Token = require('../models/token');

let hashedPassword;

mongoose.connect('mongodb+srv://gadaput:gadaput231%23%23@cluster0-5kzif.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });


const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.log.bind(console, 'connection error'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Database connection succeeded for auth');
});

router.get('/register', (req, res) => {
  res.send('The registration page');
});

router.post('register', (req, res) => {
  req.assert('username', 'UserName cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('email', 'Email cannot be blank').notEmpty();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  // Check for validation errors
  const errors = req.validationErrors();
  if (errors) {
    return res.status(400).send(errors);
  }

  // Make sure this account doesn't already exist
  User.findOne({ email: req.body.email, username: req.body.username }, (err, user) => {
    // Make sure user doesn't already exist
    if (user) {
      return res
        .status(400)
        .send({ msg: 'The email address you have entered is already associated with another account.' });
    }

    // Hash password
    // eslint-disable-next-line no-shadow
    bcrypt.hash(req.body.password, null, null, (err, hash) => {
      if (err) {
        res.send(err);
      } else {
        hashedPassword = hash;
      }
    });
    // Create and save the user
    // eslint-disable-next-line no-param-reassign
    user = new User({ name: req.body.name, email: req.body.email, password: hashedPassword });
    // eslint-disable-next-line no-shadow
    user.save((err) => {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }

      // Create a verification token for this user
      const token = new Token({ _userId: user.id, token: crypto.randomBytes(16).toString('hex') });

      // Save the verification token
      // eslint-disable-next-line no-shadow
      token.save((err) => {
        if (err) {
          return res.status(500).send({ msg: err.message });
        }

        // Send the email
        const transporter = nodemailer.createTransport({
          service: 'Sendgrid',
          auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
        });
        const mailOptions = {
          from: 'no-reply@yourwebapplication.com',
          to: user.email,
          subject: 'Account Verification Token',
          text:
            `${'Hello,\n\n' +
            'Please verify your account by clicking the link: \nhttp://'}${
              req.headers.host
            }/confirmation/${
              token.token
            }.\n`
        };
        // eslint-disable-next-line no-shadow
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.status(200).send(`A verification email has been sent to ${user.email}.`);
        });
      });
    });
  });
});
module.exports = router;
