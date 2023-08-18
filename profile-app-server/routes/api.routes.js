const router = require('express').Router();
const User = require('../models/User.model');
const express = require('express');
const fileUploader = require('../config/cloudinary.config');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/jwt.middleware');

router.get('/user', isAuthenticated, (req, res, next) => {
  // const token =
  //   req.headers.authorization && req.headers.authorization.split(' ')[1];
  // don't need to do this, since the middleware "isAuthenticated" has been handleded.

  const decodedToken = req.payload;
  const userId = decodedToken._id;

  if (!decodedToken) {
    return res.status(401).json({ message: 'No token provided' });
  }

  User.findById(userId)
    .then((foundUser) => {
      console.log(foundUser);
      const user = {
        _id: foundUser._id,
        email: foundUser.email,
        course: foundUser.course,
        campus: foundUser.campus,
        imageUrl: foundUser.image,
      };
      res.json(user);
    })
    .catch((err) => console.log(err));
});

router.post('/upload', fileUploader.single('imageUrl'), (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded'));
  }
  res.json({ fileUrl: req.file.path });
});

router.put('/user', (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken._id;
    const imageUrl = req.body.image;

    User.findByIdAndUpdate(userId, { image: imageUrl })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => console.log(err));
    // res.json(user);
  } catch (error) {
    // If there's an error, it means the token is invalid or expired
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // res.json('All good in here');
});

module.exports = router;
