const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');

router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.find();
    res.json(blogPosts);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const blogPost = new BlogPost({ title, content, author });
    await blogPost.save();
    res.status(201).json({ message: 'Blog post created successfully' });
  } catch (err) {
    console.error('Error creating blog post:', err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
