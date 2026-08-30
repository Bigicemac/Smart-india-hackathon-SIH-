const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({ name: String, pass: String }, { _id: false });

const benchmarkSchema = new mongoose.Schema(
  { dsa: Number, sys: Number, dbms: Number, os: Number, cn: Number },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    role: { type: String, default: '' },
    logo: { type: String, default: '' },
    logoColor: { type: String, default: '#ffffff' },
    tier: { type: String, default: '' },
    ctc: { type: String, default: '' },
    cutoff: { type: String, default: '' },
    benchmark: { type: benchmarkSchema, default: () => ({}) },
    rounds: { type: [roundSchema], default: [] },
    topics: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Company', companySchema);