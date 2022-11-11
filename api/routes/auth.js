import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import bcrypt from 'bcrypt';

import { check, validationResult } from 'express-validator';

let validate = [
  // Check Email Address
  check('email', 'Email address must be in the right format')
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  // Check Password
  check('password')
    .isLength({ min: 8 })
    .withMessage('Password Must Be at Least 8 Characters')
    .matches('[0-9]')
    .withMessage('Password Must Contain a Number')
    .matches('[A-Z]')
    .withMessage('Password Must Contain an Uppercase Letter')
    .matches('[!@#$%^&*]')
    .withMessage('Password Must Contain at least one special character')
    .trim()
    .escape(),
];

//REGISTER USER
router.post('/register', validate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedKey = await bcrypt.hash(req.body.password, salt);
      const newUser = new User({
        email: req.body.email,
        password: hashedKey,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
      });
      const user = await newUser.save();
      res.status(200).json('Account created successfully');
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//LOGIN
router.post('/login', validate, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json(
            'Wrong credentials! Try again or use "Forgot Password" to reset the password.',
          );
      }

      const validated = await bcrypt.compare(req.body.password, user.password);
      if (!validated) {
        return res
          .status(400)
          .json(
            'Wrong credentials! Try again or use "Forgot Password" to reset the password.',
          );
      }

      const { password, ...data } = user._doc;
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

export default router;
