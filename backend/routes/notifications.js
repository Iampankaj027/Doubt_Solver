const express = require('express');
const router  = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',         protect, getNotifications);
router.patch('/:id',    protect, markRead);
router.patch('/',       protect, markAllRead);
router.delete('/:id',   protect, deleteNotification);

module.exports = router;