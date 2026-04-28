const express = require('express');
const { register, login, verifyToken, updateProfile } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', requireAuth, verifyToken);
router.put('/profile', requireAuth, updateProfile);

module.exports = router;
