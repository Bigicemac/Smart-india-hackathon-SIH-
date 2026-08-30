const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  try {
    const { fullName, rollNo, branch, batch, email, password } = req.body;

    if (!fullName || !rollNo || !password) {
      return res.status(400).json({ error: 'fullName, rollNo, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ rollNo: rollNo.toUpperCase() });
    if (existing) {
      return res
        .status(409)
        .json({ error: `An account with Roll No. ${rollNo} already exists. Please log in.` });
    }

    const firstName = fullName.trim().split(' ')[0];
    const score = Math.floor(68 + Math.random() * 22);
    const resolvedEmail = (email || `${firstName.toLowerCase()}.${rollNo.toLowerCase()}@nitk.edu.in`).toLowerCase();

    const user = await User.create({
      name: firstName,
      fullName,
      email: resolvedEmail,
      rollNo,
      password,
      branch,
      batch,
      readinessScore: score,
      predictedTier: score > 85 ? 'Elite Tier' : 'Very High',
      percentile: score > 85 ? 'Top 10%' : 'Top 25%',
      targetCompany: 'amazon',
      proficiencies: {
        dsa: score,
        sys: Math.max(50, score - 10),
        dbms: score + 5,
        os: score - 5,
        cn: score - 8,
      },
      recommendations: [
        { name: 'Amazon', role: 'SDE Intern', match: `${score + 4}%`, type: 'high', logo: 'A', color: '#ff9900', id: 'amazon' },
        { name: 'Google', role: 'SWE Intern', match: `${score - 2}%`, type: 'high', logo: 'G', color: '#4285F4', id: 'google' },
        { name: 'Microsoft', role: 'SDE Intern', match: `${score}%`, type: 'high', logo: 'M', color: '#00a4ef', id: 'microsoft' },
        { name: 'Adobe', role: 'Research Intern', match: `${score - 6}%`, type: 'medium', logo: 'A', color: '#FA0F00', id: 'adobe' },
      ],
    });

    const token = signToken(user);
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Email or Roll No. already in use' });
    }
    res.status(500).json({ error: 'Registration failed', detail: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'identifier and password are required' });
    }

    const id = identifier.trim().toLowerCase();
    const user = await User.findOne({
      $or: [{ email: id }, { rollNo: id.toUpperCase() }, { name: new RegExp(`^${id}$`, 'i') }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Wrong credentials. Candidate account not found.' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: 'Wrong password. Please try again.' });
    }

    const token = signToken(user);
    res.json({ token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', detail: err.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user: user.toPublicJSON() });
});

module.exports = router;