const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    authorName: { type: String, required: true },
    authorRole: { type: String, default: '' },
    avatar: { type: String, default: '' },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Experience', experienceSchema);