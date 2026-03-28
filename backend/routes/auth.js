const express = require('express');
const router  = express.Router();
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup',         signup);
router.post('/login',          login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);

// Protected route (needs JWT)
router.get('/me', protect, getMe);

module.exports = router;