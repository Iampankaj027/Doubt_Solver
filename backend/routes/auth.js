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

const {
  getProfile,
  updateProfile,
  uploadAvatar
} = require('../controllers/profileController');

const upload = require('../middleware/upload');

// Auth routes
router.post('/signup',          signup);
router.post('/login',           login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password',  resetPassword);
router.get('/me',               protect, getMe);

// Profile routes
router.get('/profile/:id',  getProfile);
router.put('/profile',      protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
