const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const proficienciesSchema = new mongoose.Schema(
  {
    dsa: { type: Number, default: 50 },
    sys: { type: Number, default: 50 },
    dbms: { type: Number, default: 50 },
    os: { type: Number, default: 50 },
    cn: { type: Number, default: 50 },
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    match: String,
    type: String,
    logo: String,
    color: String,
    id: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    rollNo: { type: String, required: true, unique: true, uppercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    branch: { type: String, default: 'Computer Science (CSE)' },
    batch: { type: String, default: '2026 Batch' },
    avatar: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
    readinessScore: { type: Number, default: 65 },
    predictedTier: { type: String, default: 'Very High' },
    percentile: { type: String, default: 'Top 30%' },
    targetCompany: { type: String, default: 'amazon' },
    proficiencies: { type: proficienciesSchema, default: () => ({}) },
    recommendations: { type: [recommendationSchema], default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);