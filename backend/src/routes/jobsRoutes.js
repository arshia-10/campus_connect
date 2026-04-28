const express = require('express');
const {
  createJob,
  listJobs,
  listMyCompanyJobs,
  getJobById,
  updateJob,
  deleteJob,
  createJobPublic,
} = require('../controllers/jobsController');
const { requireCompanyAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listJobs);
router.get('/company/mine', requireCompanyAuth, listMyCompanyJobs);
router.get('/:jobId', getJobById);
router.post('/', requireCompanyAuth, createJob);
router.post('/add', createJobPublic);
router.patch('/:jobId', requireCompanyAuth, updateJob);
router.delete('/:jobId', requireCompanyAuth, deleteJob);

module.exports = router;
