const express = require('express');
const {
  registerCompany,
  loginCompany,
  verifyCompanyToken,
} = require('../controllers/companyAuthController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerCompany);
router.post('/login', loginCompany);
router.get('/verify', requireAuth, verifyCompanyToken);

module.exports = router;
