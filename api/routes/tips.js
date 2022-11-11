import express from 'express';
const router = express.Router();
import Tip from '../models/Tip.js';

//POST TIP
router.post('/', async (req, res) => {
  const newTip = new Tip({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    slug: req.body.title.toLowerCase().split(' ').join('-').replace(/\?/g, ''),
    banner: req.body.banner,
    categories: req.body.categories.toLowerCase(),
    readingTime: req.body.readingTime,
    author: req.body.author,
  });
  try {
    const savedTip = await newTip.save();
    res.status(201).json(savedTip);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE TIP
router.put('/:id', async (req, res) => {
  try {
    const tipToBeUpdated = await Tip.findById(req.params.id);
    try {
      if (tipToBeUpdated.author === req.body.author) {
        try {
          const updatedTip = await Tip.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: req.body,
            },
            { new: true },
          );
          res.status(200).json(updatedTip);
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(401).json('You can update only your post!');
      }
    } catch (err) {}
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE TIP
router.delete('/:id', async (req, res) => {
  try {
    const tipToBeDeleted = await Tip.findById(req.params.id);
    if (tipToBeDeleted.author === req.body.author) {
      await tipToBeDeleted.delete();
      res.status(200).json('Post has been deleted!');
    } else {
      res.status(401).json('You can delete only your post!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TIP BY ID
router.get('/:id', async (req, res) => {
  try {
    const tipById = await Tip.findById(req.params.id);
    res.status(200).json(tipById);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET TIP BY SLUG
router.get('/tip/:slug', async (req, res) => {
  try {
    const tipBySlug = await Tip.findOne({ slug: req.params.slug });
    const postTip = await Tip.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { visits: 1 } },
      { new: true },
    );
    res.status(200).json(postTip);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL TIPS
router.get('/', async (req, res) => {
  const author = req.query.user;
  const catName = req.query.cat;
  try {
    let tips;
    if (author) {
      tips = await Tip.find({ author }).sort({ createdAt: -1 });
    } else if (catName) {
      tips = await Tip.find({
        categories: {
          $in: [catName],
        },
      }).sort({ createdAt: -1 });
    } else {
      tips = await Tip.find().sort({ createdAt: -1 });
    }
    res.status(200).json(tips);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
