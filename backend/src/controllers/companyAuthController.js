const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

function toPublicCompany(companyDoc) {
  return {
    id: companyDoc._id.toString(),
    company_name: companyDoc.company_name,
    email: companyDoc.email,
    description: companyDoc.description,
    role: companyDoc.role,
    createdAt: companyDoc.createdAt,
  };
}

function createToken(companyDoc) {
  return jwt.sign(
    {
      companyId: companyDoc._id.toString(),
      email: companyDoc.email,
      role: companyDoc.role,
      accountType: 'company',
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function registerCompany(req, res) {
  try {
    const { company_name, email, password, description } = req.body;

    if (!company_name || !email || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Company name, email, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        ok: false,
        error: 'Password must be at least 6 characters.',
      });
    }

    const existing = await Company.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        ok: false,
        error: 'This company email is already registered.',
      });
    }

    const company = await Company.create({
      company_name: company_name.trim(),
      email: email.toLowerCase().trim(),
      password,
      description: description || '',
    });

    return res.status(201).json({
      ok: true,
      message: 'Company registration successful. Please log in.',
      company: toPublicCompany(company),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to register company.',
      details: error.message,
    });
  }
}

async function loginCompany(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        error: 'Email and password are required.',
      });
    }

    const company = await Company.findOne({ email: email.toLowerCase().trim() });
    if (!company) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid email or password.',
      });
    }

    const token = createToken(company);

    return res.json({
      ok: true,
      token,
      company: toPublicCompany(company),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to login company.',
      details: error.message,
    });
  }
}

async function verifyCompanyToken(req, res) {
  try {
    if (req.auth.accountType !== 'company' || !req.auth.companyId) {
      return res.status(401).json({
        ok: false,
        error: 'Invalid company token.',
      });
    }

    const company = await Company.findById(req.auth.companyId);

    if (!company) {
      return res.status(401).json({
        ok: false,
        error: 'Company not found for this token.',
      });
    }

    return res.json({
      ok: true,
      company: toPublicCompany(company),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: 'Unable to verify company token.',
      details: error.message,
    });
  }
}

module.exports = {
  registerCompany,
  loginCompany,
  verifyCompanyToken,
};
