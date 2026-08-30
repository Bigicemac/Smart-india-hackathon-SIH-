const express = require('express');
const Experience = require('../models/Experience');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ createdAt: -1 }).limit(100);
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load experiences', detail: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { company, role, title, body, authorName, authorRole, avatar } = req.body;
    if (!company || !role || !title || !body) {
      return res.status(400).json({ error: 'company, role, title, and body are required' });
    }

    const experience = await Experience.create({
      company,
      role,
      title,
      body,
      authorName: authorName || 'Anonymous',
      authorRole: authorRole || '',
      avatar: avatar || '',
      author: req.user.id,
    });

    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish experience', detail: err.message });
  }
});

router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json(experience);
  } catch (err) {
    res.status(400).json({ error: 'Failed to like experience', detail: err.message });
  }
});

module.exports = router;