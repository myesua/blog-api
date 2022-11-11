import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';

//CREATE POST
router.post('/', async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    slug: req.body.title.toLowerCase().split(' ').join('-').replace(/\?/g, ''),
    banner: req.body.banner,
    categories: req.body.categories.toLowerCase(),
    readingTime: req.body.readingTime,
    author: req.body.author,
    avatar: req.body.avatar,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE POST
router.put('/:id', async (req, res) => {
  try {
    const postToBeUpdated = await Post.findById(req.params.id);
    try {
      if (postToBeUpdated.author === req.body.author) {
        try {
          const updatedPost = await Post.findOneAndUpdate(
            { _id: req.params.id },
            {
              $set: req.body,
            },
            { new: true },
          );
          res.status(200).json(updatedPost);
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

// GET POST BY ID
router.get('/:id', async (req, res) => {
  try {
    const postById = await Post.findById(req.params.id);
    res.status(200).json(postById);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET POST BY SLUG
router.get('/post/:slug', async (req, res) => {
  try {
    const postBySlug = await Post.findOne({ slug: req.params.slug });

    const postVisits = await Post.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { visits: 1 } },
      { new: true },
    );
    res.status(200).json(postVisits);
    // res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete('/:id', async (req, res) => {
  try {
    const postToBeDeleted = await Post.findById(req.params.id);
    if (postToBeDeleted.author === req.body.author) {
      await postToBeDeleted.delete();
      res.status(200).json('Post has been deleted!');
    } else {
      res.status(401).json('You can delete only your post!');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get('/', async (req, res) => {
  const author = req.query.user;
  const catName = req.query.cat;
  const search = req.query.search;
  try {
    let posts;
    if (author) {
      posts = await Post.find({ author }).sort({ createdAt: -1 });
    } else if (catName) {
      posts = await Post.find({
        categories: {
          $in: [catName],
        },
      }).sort({ createdAt: -1 });
    } else if (search) {
      // find documents based on our query and projection
      const agg = [
        {
          $search: {
            autocomplete: {
              path: 'title',
              query: search,
              tokenOrder: 'any',
              fuzzy: {
                maxEdits: 2,
                prefixLength: 1,
                maxExpansions: 256,
              },
            },
            highlight: {
              path: 'title',
            },
          },
        },
        {
          $limit: 3,
        },
        {
          $project: {
            _id: 0,
            title: 1,
            description: 1,
            visits: 1,
            createdAt: 1,
            readingTime: 1,
            slug: 1,
            highlights: {
              $meta: 'searchHighlights',
            },
          },
        },
      ];
      const result = await Post.aggregate(agg);
      return res.status(200).json(result);
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// module.exports = router;
export default router;
