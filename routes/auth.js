const express = require('express');
const bcrypt = require('bcrypt-nodejs');
// eslint-disable-next-line prefer-const
let mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { check, validationResult } = require('express-validator');

require('dotenv').config();

// eslint-disable-next-line prefer-const
let router = express.Router();

const User = require('../models/userSchema');
const Token = require('../models/token');

let hashedPass;

mongoose.connect(process.env.URL, {
  useNewUrlParser: true
});

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.log.bind(console, 'connection error'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('Database connection succeeded for auth');
});

router.get('/register', (req, res) => res.status(200).send('The registration page'));

router.post(
  '/register',
  [
    check('username', 'UserName cannot be blank').notEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('email', 'Email cannot be blank').notEmpty(),
    check('password', 'Password must be at least 4 characters long').isLength({ min: 4 }),
    check('email').normalizeEmail({ remove_dots: false })
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
    } else {
      // Make sure this account doesn't already exist
      User.findOne({ email: req.body.email }, (err, user) => {
        // Make sure user doesn't already exist
        if (user) {
          res
            .status(400)
            .send({ msg: 'The email address you have entered is already associated with another account.' });
        } else {
          // Hash password
          // eslint-disable-next-line no-shadow
          bcrypt.hash(req.body.password, null, null, (err, hash) => {
            if (err) {
              res.send(err);
            }
            hashedPass = hash;
            // console.log(hashedPass);

            // req.body.password = hashedPassword;
            // Create and save the user
            // eslint-disable-next-line no-param-reassign
            user = new User({
              email: req.body.email,
              username: req.body.username,
              password: hashedPass,
              firstName: req.body.firstName,
              lastName: req.body.lastName
            });
            // eslint-disable-next-line no-shadow
            user.save((err) => {
              if (err) {
                res.status(500).send({ msg: err.message });
              } else {
                // Create a verification token for this user
                const token = new Token({ _userId: user.id, token: crypto.randomBytes(16).toString('hex') });

                // Save the verification token
                // eslint-disable-next-line no-shadow
                token.save((err) => {
                  if (err) {
                    res.status(500).send({ msg: err.message });
                  } else {
                    // Send the email
                    const transporter = nodemailer.createTransport({
                      service: 'Sendgrid',
                      // eslint-disable-next-line max-len
                      auth: { user: process.env.SENDGRID_USERNAME, pass: process.env.SENDGRID_PASSWORD }
                    });
                    const mailOptions = {
                      from: 'no-reply@gadaput.com',
                      to: user.email,
                      subject: 'Account Verification Token',
                      text: `${'Hello,\n\n Please verify your account by clicking the link: \nhttp://'}${
                        req.headers.host
                      }/auth/verify/${token.token}.\n`
                    };
                    // eslint-disable-next-line no-shadow
                    transporter.sendMail(mailOptions, (err) => {
                      if (err) {
                        return res.status(500).send({ msg: err.message });
                      }
                      return res.status(200).send(`A verification email has been sent to ${user.email}.`);
                    });
                  }
                });
              }
            });
          });
        }
      });
    }
  }
);

router.get('/login', (req, res) => res.status(200).send('The login page'));

module.exports = router;
