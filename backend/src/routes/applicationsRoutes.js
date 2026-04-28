const express = require('express');
const {
  applyToJob,
  listMyApplications,
  listCompanyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationsController');
const { requireStudentAuth, requireCompanyAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', requireStudentAuth, applyToJob);
router.get('/mine', requireStudentAuth, listMyApplications);
router.get('/company', requireCompanyAuth, listCompanyApplications);
router.patch('/:applicationId/status', requireCompanyAuth, updateApplicationStatus);

module.exports = router;
