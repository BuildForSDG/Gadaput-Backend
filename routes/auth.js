/* eslint-disable no-console */
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
// eslint-disable-next-line prefer-const
let mongoose = require('mongoose');
// eslint-disable-next-line import/no-unresolved

const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

require('dotenv').config();

// eslint-disable-next-line prefer-const
let router = express.Router();

const User = require('../models/userSchema');
const Token = require('../models/token');

let hashedPass;

mongoose.connect(process.env.URL, {
  useNewUrlParser: true, useUnifiedTopology: true

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
                      }/auth/confirmation/${token.token}.\n`
                      }/auth/verify/${token.token}\n`
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


router.get('/verify/:token', (req, res) => res.status(200).send({ token: req.params.token }));

router.post('/verify', (req, res) => {
  const { email, token } = req.body;

  if (!email) {
    res.send({ message: "User doesn't exist" });
  }
  if (!token) {
    res.send({ message: "Token doesn't exist or may have expired" });
  } else {
    // Find a matching token
    // eslint-disable-next-line no-shadow
    Token.findOne({ token: req.body.token }, (err, token) => {
      if (!token) {
        res.status(400).send({
          msg: 'We were unable to find a valid token. Your token may have expired.'
        });
      } else {
        // If we found a token, find a matching user
        // eslint-disable-next-line no-underscore-dangle
        User.findOne({ _id: token._userId, email: req.body.email }, (errr, user) => {
          if (errr) {
            res.status(500).send({ msg: err.message });
          } else {
            if (!user) {
              return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
            }
            if (user.isVerified) {
              return res.status(400).send({ msg: 'This user has already been verified.' });
            }
            // Verify and save the user
            user.isVerified = true;
            user.save((errrr) => {
              if (errrr) {
                res.status(500).send({ msg: err.message });
              }
              return res.status(200).send('The account has been verified. Please log in.');
            });
          }
          return res.status(200);
        });
      }
    });
  }
});

router.get('/login', (req, res) => res.status(200).send('The login page'));

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      if (user.isVerified) {
        // Load hash from your password DB.
        bcrypt.compare(password, user.password, (err, isMatch) => {
          // res == true
          if (!isMatch) {
            res.send({ message: 'Password is incorrect' });
            console.log('incorrect password');
          }
          if (isMatch) {
            jwt.sign({ email }, 'secretkey', { expiresIn: '3h' }, (erry, token) => {
              res.cookie('token', token, { maxAge: 180 * 60 * 1000 });
              res.send({ message: 'Logged in successfully' });
              console.log('logged in successfully', token);
            });
          }
        });
      } else {
        console.log('user is not verified');
        return res.status(200).res.redirect('/verify');
      }
    } else {
      console.log('user does not exist');
      return res.status(200).res.redirect('/register');
    }
    return res.status(200);
  });
});

module.exports = router;
