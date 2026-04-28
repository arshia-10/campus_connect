const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

savedJobSchema.index({ student_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);