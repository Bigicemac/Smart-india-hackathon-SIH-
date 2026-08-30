const express = require('express');
const Company = require('../models/Company');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load companies', detail: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findOne({ id: req.params.id.toLowerCase() });
    if (!company) return res.status(404).json({ error: 'Company not found' });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load company', detail: err.message });
  }
});

module.exports = router;