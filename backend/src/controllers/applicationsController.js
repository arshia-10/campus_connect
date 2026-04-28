const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');

async function applyToJob(req, res) {
  try {
    const { job_id } = req.body;

    if (!job_id || !mongoose.Types.ObjectId.isValid(job_id)) {
      return res.status(400).json({ ok: false, error: 'Valid job_id is required.' });
    }

    const job = await Job.findById(job_id);
    if (!job) {
      return res.status(404).json({ ok: false, error: 'Job not found.' });
    }

    const existing = await Application.findOne({
      student_id: req.auth.userId,
      job_id,
    });

    if (existing) {
      return res.status(409).json({ ok: false, error: 'You already applied to this job.' });
    }

    const application = await Application.create({
      student_id: req.auth.userId,
      job_id,
    });

    // increment applicants count on the job (best-effort)
    try {
      await Job.findByIdAndUpdate(job_id, { $inc: { applicants: 1 } });
    } catch (e) {
      // non-fatal, continue
      console.error('Failed to increment job applicants:', e.message);
    }

    return res.status(201).json({ ok: true, application });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to submit application.',
      details: error.message,
    });
  }
}

async function listMyApplications(req, res) {
  try {
    const applications = await Application.find({ student_id: req.auth.userId })
      .sort({ createdAt: -1 })
      .populate('job_id')
      .populate('student_id', 'name email rollNo branch cgpa');

    return res.json({ ok: true, applications });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to fetch applications.',
      details: error.message,
    });
  }
}

async function listCompanyApplications(req, res) {
  try {
    const companyJobs = await Job.find({ company_id: req.auth.companyId }).select('_id');
    const jobIds = companyJobs.map((job) => job._id);

    const applications = await Application.find({ job_id: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .populate('job_id')
      .populate('student_id', 'name email rollNo branch cgpa');

    return res.json({ ok: true, applications });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to fetch company applications.',
      details: error.message,
    });
  }
}

async function updateApplicationStatus(req, res) {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ ok: false, error: 'Invalid application id.' });
    }

    const allowed = ['Applied', 'Shortlisted', 'Selected', 'Rejected'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, error: 'Invalid status value.' });
    }

    const application = await Application.findById(applicationId).populate('job_id');
    if (!application) {
      return res.status(404).json({ ok: false, error: 'Application not found.' });
    }

    if (!application.job_id || application.job_id.company_id.toString() !== req.auth.companyId) {
      return res.status(403).json({ ok: false, error: 'You can update only your company applications.' });
    }

    application.status = status;
    await application.save();

    return res.json({ ok: true, application });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to update application status.',
      details: error.message,
    });
  }
}

module.exports = {
  applyToJob,
  listMyApplications,
  listCompanyApplications,
  updateApplicationStatus,
};
