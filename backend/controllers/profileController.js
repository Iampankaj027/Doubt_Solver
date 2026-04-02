const db = require('../config/db');

// ════════════════════════════════════════
// GET /api/auth/profile/:id
// ════════════════════════════════════════
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    // Get user info
    const [users] = await db.query(
      `SELECT id, name, email, branch, year, reputation,
              role, created_at, avatar_url
       FROM users WHERE id = ?`,
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get questions by user
    const [questions] = await db.query(
      `SELECT q.id, q.title, q.vote_score, q.answer_count,
              q.view_count, q.is_solved, q.created_at,
              GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tags
       FROM questions q
       LEFT JOIN question_tags qt ON q.id = qt.question_id
       LEFT JOIN tags t ON qt.tag_id = t.id
       WHERE q.user_id = ? AND q.is_deleted = 0
       GROUP BY q.id
       ORDER BY q.created_at DESC
       LIMIT 10`,
      [id]
    );

    // Get answers by user
    const [answers] = await db.query(
      `SELECT a.id, a.body, a.vote_score, a.is_accepted,
              a.created_at, q.id AS question_id, q.title AS question_title
       FROM answers a
       JOIN questions q ON a.question_id = q.id
       WHERE a.user_id = ? AND a.is_deleted = 0
       ORDER BY a.created_at DESC
       LIMIT 10`,
      [id]
    );

    // Get stats
    const [stats] = await db.query(
      `SELECT
        (SELECT COUNT(*) FROM questions WHERE user_id = ? AND is_deleted = 0) AS total_questions,
        (SELECT COUNT(*) FROM answers  WHERE user_id = ? AND is_deleted = 0) AS total_answers,
        (SELECT COUNT(*) FROM answers  WHERE user_id = ? AND is_accepted = 1) AS accepted_answers`,
      [id, id, id]
    );

    res.json({
      success: true,
      user:      users[0],
      questions: questions.map(q => ({
        ...q,
        tags: q.tags ? q.tags.split(',') : []
      })),
      answers,
      stats: stats[0]
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// PUT /api/auth/profile
// ════════════════════════════════════════
const updateProfile = async (req, res) => {
  try {
    const { name, branch, year } = req.body;
    const user_id = req.user.id;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }

    await db.query(
      'UPDATE users SET name = ?, branch = ?, year = ? WHERE id = ?',
      [name.trim(), branch || null, year || null, user_id]
    );

    const [rows] = await db.query(
      'SELECT id, name, email, branch, year, reputation, role, avatar_url FROM users WHERE id = ?',
      [user_id]
    );

    res.json({ success: true, user: rows[0], message: 'Profile updated!' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProfile, updateProfile };