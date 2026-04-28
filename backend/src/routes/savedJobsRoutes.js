const express = require('express');
const { toggleSavedJob, listMySavedJobs } = require('../controllers/savedJobsController');
const { requireStudentAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/toggle', requireStudentAuth, toggleSavedJob);
router.get('/mine', requireStudentAuth, listMySavedJobs);

module.exports = router;