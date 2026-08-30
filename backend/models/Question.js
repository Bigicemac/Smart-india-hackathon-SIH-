const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    company: { type: String, default: '' },
    topic: { type: String, default: '' },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
    desc: { type: String, default: '' },
    solution: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);