const express = require('express');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map((u) => u.toPublicJSON()));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load users', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toPublicJSON());
  } catch (err) {
    res.status(400).json({ error: 'Invalid user id', detail: err.message });
  }
});

router.patch('/me', requireAuth, async (req, res) => {
  try {
    const allowed = ['proficiencies', 'targetCompany', 'readinessScore', 'predictedTier', 'percentile', 'avatar'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updates }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.toPublicJSON());
  } catch (err) {
    res.status(400).json({ error: 'Update failed', detail: err.message });
  }
});

module.exports = router;