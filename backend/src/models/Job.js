const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    title: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    sector: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
    salary: {
      type: String,
      trim: true,
    },
    salaryMin: {
      type: Number,
      default: 0,
    },
    package: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    eligibility_cgpa: {
      type: Number,
      default: 0,
    },
    eligible_branch: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      trim: true,
    },
    posted: {
      type: String,
      trim: true,
    },
    applicants: {
      type: Number,
      default: 0,
    },
    exp: {
      type: String,
      trim: true,
    },
    skills_required: {
      type: [String],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      trim: true,
      default: 'open',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '#1a3a5c',
    },
    initial: {
      type: String,
      trim: true,
      default: '',
    },
    postedBy: {
      type: String,
      trim: true,
      default: 'admin',
    },
    deadline: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Job', jobSchema);
