const db = require('../config/db');

// ════════════════════════════════════════
// GET /api/answers/:questionId
// ════════════════════════════════════════
const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;
    const [answers] = await db.query(`
      SELECT
        a.id, a.body, a.vote_score, a.is_accepted,
        a.created_at, a.updated_at,
        u.id   AS user_id,
        u.name AS user_name,
        u.avatar_url,
        u.reputation
      FROM answers a
      JOIN users u ON a.user_id = u.id
      WHERE a.question_id = ? AND a.is_deleted = 0
      ORDER BY a.is_accepted DESC, a.vote_score DESC, a.created_at ASC
    `, [questionId]);

    res.json({ success: true, answers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// POST /api/answers/:questionId
// ════════════════════════════════════════
const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { body } = req.body;
    const user_id = req.user.id;

    if (!body || body.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Answer must be at least 10 characters'
      });
    }

    // Check question exists
    const [qRows] = await db.query(
      'SELECT id, user_id FROM questions WHERE id = ? AND is_deleted = 0',
      [questionId]
    );
    if (qRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Insert answer
    const [result] = await db.query(
      'INSERT INTO answers (question_id, user_id, body) VALUES (?, ?, ?)',
      [questionId, user_id, body.trim()]
    );

    // Update answer count on question
    await db.query(
      'UPDATE questions SET answer_count = answer_count + 1 WHERE id = ?',
      [questionId]
    );

    // Add reputation to answerer
    await db.query(
      'UPDATE users SET reputation = reputation + 2 WHERE id = ?',
      [user_id]
    );
    // ── Send real-time notification to question owner ──
    if (qRows[0].user_id !== user_id) {
      // Save to DB
      await db.query(
        `INSERT INTO notifications (user_id, type, message, link)
     VALUES (?, 'answer', ?, ?)`,
        [
          qRows[0].user_id,
          `${req.user.name} answered your question`,
          `/question/${questionId}`
        ]
      );
      // Send real-time via socket
      const sendNotification = req.app.get('sendNotification');
      sendNotification(qRows[0].user_id, {
        type: 'answer',
        message: `${req.user.name} answered your question`,
        link: `/question/${questionId}`
      });
    }
    res.status(201).json({
      success: true,
      answerId: result.insertId,
      message: 'Answer posted!'
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// PATCH /api/answers/:id/accept
// ════════════════════════════════════════
const acceptAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get answer + question
    const [aRows] = await db.query(
      'SELECT a.*, q.user_id AS q_user_id FROM answers a JOIN questions q ON a.question_id = q.id WHERE a.id = ?',
      [id]
    );
    if (aRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Answer not found' });
    }

    // Only question owner can accept
    if (aRows[0].q_user_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Only question owner can accept' });
    }

    // Unaccept all other answers for this question
    await db.query(
      'UPDATE answers SET is_accepted = 0 WHERE question_id = ?',
      [aRows[0].question_id]
    );

    // Accept this answer
    await db.query(
      'UPDATE answers SET is_accepted = 1 WHERE id = ?',
      [id]
    );

    // Mark question as solved
    await db.query(
      'UPDATE questions SET is_solved = 1 WHERE id = ?',
      [aRows[0].question_id]
    );

    // Give reputation to answer author
    await db.query(
      'UPDATE users SET reputation = reputation + 15 WHERE id = ?',
      [aRows[0].user_id]
    );

    res.json({ success: true, message: 'Answer accepted!' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// DELETE /api/answers/:id
// ════════════════════════════════════════
const deleteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [rows] = await db.query('SELECT * FROM answers WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    if (rows[0].user_id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await db.query('UPDATE answers SET is_deleted = 1 WHERE id = ?', [id]);

    // Decrease answer count
    await db.query(
      'UPDATE questions SET answer_count = answer_count - 1 WHERE id = ?',
      [rows[0].question_id]
    );

    res.json({ success: true, message: 'Answer deleted' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAnswers, createAnswer, acceptAnswer, deleteAnswer };