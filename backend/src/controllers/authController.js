const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Application = require('../models/Application');
const SavedJob = require('../models/SavedJob');

function toPublicUser(userDoc) {
  return {
    id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
    branch: userDoc.branch,
    cgpa: userDoc.cgpa,
    rollNo: userDoc.rollNo,
    phone: userDoc.phone,
    resume: userDoc.resume || null,
    savedJobs: userDoc.savedJobs || [],
    createdAt: userDoc.createdAt,
  };
}

async function getSavedJobIds(userId) {
  const savedJobs = await SavedJob.find({ student_id: userId }).select('job_id').lean();
  return savedJobs.map((savedJob) => savedJob.job_id.toString());
}

async function getAppliedJobs(userId) {
  const apps = await Application.find({ student_id: userId }).select('job_id status applied_date').lean();
  return apps.map((app) => ({
    jobId: app.job_id.toString(),
    status: app.status,
    appliedAt: app.applied_date || app.createdAt,
  }));
}

function createToken(userDoc) {
  return jwt.sign(
    {
      userId: userDoc._id.toString(),
      email: userDoc.email,
      role: userDoc.role,
      accountType: 'student',
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register(req, res) {
  try {
    const { name, email, password, role, branch, cgpa, rollNo, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        error: 'Password must be at least 6 characters.',
      });
    }

    const existing = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: 'This email is already registered.',
      });
    }

    const newUser = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'student',
      branch: branch || '',
      cgpa: cgpa || '',
      rollNo: rollNo || '',
      phone: phone || '',
    });

    return res.status(201).json({
      ok: true,
      message: 'Registration successful.',
      user: toPublicUser(newUser),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to register user.',
      details: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Email and password are required.',
      });
    }

    const user = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid email or password.',
      });
    }

    const token = createToken(user);

    // include user's applications so frontend can restore applied state
    try {
      const [appliedJobs, savedJobs] = await Promise.all([
        getAppliedJobs(user._id),
        getSavedJobIds(user._id),
      ]);
      const publicUser = toPublicUser(user);
      publicUser.appliedJobs = appliedJobs;
      publicUser.savedJobs = savedJobs;

      return res.json({ ok: true, token, user: publicUser });
    } catch (e) {
      return res.json({ ok: true, token, user: toPublicUser(user) });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to login user.',
      details: error.message,
    });
  }
}

async function verifyToken(req, res) {
  try {
    const user = await Student.findById(req.auth.userId);

    if (!user) {
      return res.status(401).json({
        ok: false,
        error: 'User not found for this token.',
      });
    }

    try {
      const [appliedJobs, savedJobs] = await Promise.all([
        getAppliedJobs(user._id),
        getSavedJobIds(user._id),
      ]);
      const publicUser = toPublicUser(user);
      publicUser.appliedJobs = appliedJobs;
      publicUser.savedJobs = savedJobs;
      return res.json({ ok: true, user: publicUser });
    } catch (e) {
      return res.json({ ok: true, user: toPublicUser(user) });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to verify token.',
      details: error.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, branch, cgpa, rollNo, phone, resume } = req.body;
    const user = await Student.findById(req.auth.userId);

    if (!user) {
      return res.status(404).json({ ok: false, error: 'User not found.' });
    }

    if (typeof name === 'string') user.name = name.trim();
    if (typeof branch === 'string') user.branch = branch.trim();
    if (cgpa !== undefined) user.cgpa = cgpa === '' ? 0 : Number(cgpa);
    if (typeof rollNo === 'string') user.rollNo = rollNo.trim();
    if (typeof phone === 'string') user.phone = phone.trim();
    if (resume !== undefined) user.resume = resume;

    await user.save();

    const [appliedJobs, savedJobs] = await Promise.all([
      getAppliedJobs(user._id),
      getSavedJobIds(user._id),
    ]);

    const publicUser = toPublicUser(user);
    publicUser.appliedJobs = appliedJobs;
    publicUser.savedJobs = savedJobs;

    return res.json({ ok: true, user: publicUser });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to update profile.',
      details: error.message,
    });
  }
}

module.exports = {
  register,
  login,
  verifyToken,
  updateProfile,
};
