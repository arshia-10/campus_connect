const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      ok: false,
      error: 'Authorization token is required.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = decoded;
    return next();
  } catch {
    return res.status(401).json({
      ok: false,
      error: 'Invalid or expired token.',
    });
  }
}

function requireStudentAuth(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.auth.accountType !== 'student' || !req.auth.userId) {
      return res.status(403).json({
        ok: false,
        error: 'Student access required.',
      });
    }
    return next();
  });
}

function requireCompanyAuth(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.auth.accountType !== 'company' || !req.auth.companyId) {
      return res.status(403).json({
        ok: false,
        error: 'Company access required.',
      });
    }
    return next();
  });
}

module.exports = {
  requireAuth,
  requireStudentAuth,
  requireCompanyAuth,
};
