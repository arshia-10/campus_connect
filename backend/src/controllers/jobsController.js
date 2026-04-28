const mongoose = require('mongoose');
const Job = require('../models/Job');

async function createJob(req, res) {
  try {
    const { role, package: jobPackage, location, eligibility_cgpa, eligible_branch, skills_required, deadline } = req.body;

    if (!role || !jobPackage || !location || !deadline) {
      return res.status(400).json({
        ok: false,
        error: 'role, package, location, and deadline are required.',
      });
    }

    const job = await Job.create({
      company_id: req.auth.companyId,
      role,
      package: jobPackage,
      location,
      eligibility_cgpa: eligibility_cgpa ?? 0,
      eligible_branch: Array.isArray(eligible_branch) ? eligible_branch : [],
      skills_required: Array.isArray(skills_required) ? skills_required : [],
      deadline,
    });

    return res.status(201).json({ ok: true, job });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to create job.',
      details: error.message,
    });
  }
}

async function listJobs(req, res) {
  try {
    const query = {};

    if (req.query.companyOnly === 'true' && req.auth?.companyId) {
      query.company_id = req.auth.companyId;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .populate('company_id', 'company_name email');

    return res.json({ ok: true, jobs });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to fetch jobs.',
      details: error.message,
    });
  }
}

async function listMyCompanyJobs(req, res) {
  try {
    const jobs = await Job.find({ company_id: req.auth.companyId })
      .sort({ createdAt: -1 })
      .populate('company_id', 'company_name email');

    return res.json({ ok: true, jobs });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to fetch company jobs.',
      details: error.message,
    });
  }
}

async function getJobById(req, res) {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ ok: false, error: 'Invalid job id.' });
    }

    const job = await Job.findById(jobId).populate('company_id', 'company_name email');
    if (!job) {
      return res.status(404).json({ ok: false, error: 'Job not found.' });
    }

    return res.json({ ok: true, job });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to fetch job.',
      details: error.message,
    });
  }
}

async function updateJob(req, res) {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ ok: false, error: 'Invalid job id.' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ ok: false, error: 'Job not found.' });
    }

    if (job.company_id.toString() !== req.auth.companyId) {
      return res.status(403).json({ ok: false, error: 'You can update only your own jobs.' });
    }

    const allowedUpdates = ['role', 'package', 'location', 'eligibility_cgpa', 'eligible_branch', 'skills_required', 'deadline'];
    for (const key of allowedUpdates) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        job[key] = req.body[key];
      }
    }

    await job.save();
    return res.json({ ok: true, job });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to update job.',
      details: error.message,
    });
  }
}

async function deleteJob(req, res) {
  try {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ ok: false, error: 'Invalid job id.' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ ok: false, error: 'Job not found.' });
    }

    if (job.company_id.toString() !== req.auth.companyId) {
      return res.status(403).json({ ok: false, error: 'You can delete only your own jobs.' });
    }

    await job.deleteOne();
    return res.json({ ok: true, message: 'Job deleted.' });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to delete job.',
      details: error.message,
    });
  }
}

// Public endpoint to add jobs (no auth required)
async function createJobPublic(req, res) {
  try {
    const { title, company, salary, location, type, exp, skills, status, description, color, initial } = req.body;

    if (!title || !company) {
      return res.status(400).json({ ok: false, error: 'Title and company are required.' });
    }

    const job = await Job.create({
      title: title || '',
      company: company || '',
      salary: salary || 'Competitive',
      salaryMin: 0,
      location: location || 'Remote',
      type: type || 'Full-time',
      posted: new Date().toISOString(),
      applicants: 0,
      exp: exp || '0-2 yrs',
      skills: Array.isArray(skills) ? skills : [],
      status: status || 'open',
      description: description || '',
      color: color || '#3b6fd4',
      initial: initial || (company ? company.charAt(0) : 'J'),
      postedBy: 'user',
    });

    return res.status(201).json({ ok: true, job });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to create job.',
      details: error.message,
    });
  }
}

module.exports = {
  createJob,
  listJobs,
  listMyCompanyJobs,
  getJobById,
  updateJob,
  deleteJob,
  createJobPublic,
};
