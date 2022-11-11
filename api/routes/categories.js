import express from 'express';
const router = express.Router();
import Category from '../models/Category.js';

// const router = require('express').Router();
// const Category = require('../models/Category');

//Create a new category
router.post('/', async (req, res) => {
  const newCategory = new Category(req.body);

  try {
    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET CATEGORIES
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// module.exports = router;
export default router;
