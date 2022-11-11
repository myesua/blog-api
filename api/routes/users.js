import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import Post from '../models/Post.js';
import Tip from '../models/Tip.js';
import bcrypt from 'bcrypt';

// const User = require('../models/User');
// const Post = require('../models/Post');
// const Tip = require('../models/Tip');
// const bcrypt = require('bcrypt');

//UPDATE
router.put('/:id', async (req, res) => {
  if (req.body._id === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      try {
        const user = await User.findById({ _id: req.params.id });
        const validated = await bcrypt.compare(
          req.body.oldPassword,
          user.password,
        );
        if (!user) {
          return res
            .status(400)
            .json(
              'You are not allowed to update this account. Please try again.',
            );
        } else if (!validated) {
          return res
            .status(400)
            .json(
              'You are not allowed to update this account. Please try again.',
            );
        }
        try {
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                password: req.body.password,
              },
            },
            { new: true },
          );
          const { password, ...data } = updatedUser._doc;
          res.status(200).json(data);
        } catch (err) {
          res.status(500).json(err);
        }
      } catch (err) {
        res.status(500).json(err);
      }
    }
    try {
      const user = await User.findById(req.params.id);
      let oldFirstname = user.firstname;
      let oldLastname = user.lastname;

      let author = oldFirstname + ' ' + oldLastname;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            bannerImage: req.body.bannerImage,
          },
        },
        { new: true },
      );
      let updatedAuthor = updatedUser.firstname + ' ' + updatedUser.lastname;
      await Post.updateMany(
        { author: author },
        { $set: { author: updatedAuthor } },
      );
      await Tip.updateMany(
        { author: author },
        { $set: { author: updatedAuthor } },
      );
      // const { password, ...data } = updatedUser._doc;
      // res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json('You can update only your account!');
  }
});

//DELETE
router.delete('/:id', async (req, res) => {
  if (req.body._id === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json('User has been deleted ');
    } catch (err) {
      res.status(404).json('User not found!');
    }
  } else {
    res.status(401).json('You can delete only your account!');
  }
});

//GET USER
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...data } = user._doc;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

// module.exports = router;
export default router;
