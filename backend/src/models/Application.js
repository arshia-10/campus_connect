const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    job_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    applied_date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ student_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
