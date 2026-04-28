const mongoose = require('mongoose');
const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');

async function toggleSavedJob(req, res) {
  try {
    const { job_id } = req.body;

    if (!job_id || !mongoose.Types.ObjectId.isValid(job_id)) {
      return res.status(400).json({ ok: false, error: 'Valid job_id is required.' });
    }

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ ok: false, error: 'Job not found.' });
    }

    const existing = await SavedJob.findOne({ student_id: req.auth.userId, job_id });

    if (existing) {
      await existing.deleteOne();
      return res.json({ ok: true, saved: false, job_id });
    }

    const savedJob = await SavedJob.create({
      student_id: req.auth.userId,
      job_id,
    });

    return res.status(201).json({ ok: true, saved: true, savedJob });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to toggle saved job.',
      details: error.message,
    });
  }
}

async function listMySavedJobs(req, res) {
  try {
    const savedJobs = await SavedJob.find({ student_id: req.auth.userId })
      .sort({ createdAt: -1 })
      .populate('job_id')
      .populate('student_id', 'name email rollNo branch cgpa');

    return res.json({ ok: true, savedJobs });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to fetch saved jobs.',
      details: error.message,
    });
  }
}

module.exports = {
  toggleSavedJob,
  listMySavedJobs,
};