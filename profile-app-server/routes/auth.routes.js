const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const router = require('express').Router();

const { isAuthenticated } = require('./../middleware/jwt.middleware.js'); // <== IMPORT

const saltRounds = 10;

router.post('/signup', (req, res, next) => {
  const { email, password, course, campus } = req.body;

  if (email === '' || password === '' || course === '' || campus === '') {
    res.status(400).json({ message: 'Provide email, password and name' });
    return;
  }

  // Use regex to validate the email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Provide a valid email address.' });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      return User.create({ email, password: hashedPassword, campus, course });
    })
    .then((createdUser) => {
      const { email, name, _id } = createdUser;
      const user = { email, name, _id, campus, course };
      return res.status(201).json({ user: user });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: 'Internal Server Error' });
    });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  if (email === '' || password === '') {
    res.status(400).json({ message: 'Provide email and password.' });
    return;
  }

  User.findOne({ email }).then((foundUser) => {
    if (!foundUser) {
      // If the user is not found, send an error response
      res.status(401).json({ message: 'User not found.' });
      console.log("sucks user not found...")
      return;
    }

    // Compare the provided password with the one saved in the database
    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (passwordCorrect) {
      // Deconstruct the user object to omit the password
      const { _id, email, course, campus } = foundUser;

      // Create an object that will be set as the token payload
      const payload = { _id, email, course, campus };

      // Create and sign the token
      const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '6h',
      });

      // Send the token as the response
      res.status(200).json({ authToken: authToken });
    } else {
      res.status(401).json({ message: 'Unable to authenticate the user, sucks' });
      console.log("suck...")
    }
  });

  //   res.json('All good in here, auth/login post');
});

router.get('/verify', (req, res, next) => {
  console.log('req.payload', req.payload);
  res.status(200).json(req.payload);
});

module.exports = router;
