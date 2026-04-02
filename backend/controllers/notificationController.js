const db = require('../config/db');

// ════════════════════════════════════════
// GET /api/notifications
// ════════════════════════════════════════
const getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [notifications] = await db.query(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 20`,
      [user_id]
    );
    const [unread] = await db.query(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [user_id]
    );
    res.json({
      success: true,
      notifications,
      unreadCount: unread[0].count
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// PATCH /api/notifications/:id — mark one read
// ════════════════════════════════════════
const markRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// PATCH /api/notifications — mark ALL read
// ════════════════════════════════════════
const markAllRead = async (req, res) => {
  try {
    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ?',
      [req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// DELETE /api/notifications/:id
// ════════════════════════════════════════
const deleteNotification = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getNotifications, markRead, markAllRead, deleteNotification };