const db = require('../config/db');

// ════════════════════════════════════════
// GET /api/questions — fetch all questions
// ════════════════════════════════════════
const getQuestions = async (req, res) => {
  try {
    const { search, tag, sort = 'newest', page = 1 } = req.query;
    const limit  = 10;
    const offset = (page - 1) * limit;

    let query = `
      SELECT
        q.id, q.title, q.body, q.vote_score,
        q.answer_count, q.view_count, q.is_solved,
        q.created_at,
        u.id   AS user_id,
        u.name AS user_name,
        u.avatar_url,
        u.reputation,
        GROUP_CONCAT(DISTINCT t.name ORDER BY t.name SEPARATOR ',') AS tags
      FROM questions q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN tags t ON qt.tag_id = t.id
      WHERE q.is_deleted = 0
    `;

    const params = [];

    if (search) {
      query += ` AND (q.title LIKE ? OR q.body LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (tag) {
      query += ` AND t.name = ?`;
      params.push(tag);
    }

    query += ` GROUP BY q.id`;

    if (sort === 'votes')     query += ` ORDER BY q.vote_score DESC`;
    else if (sort === 'unanswered') query += ` HAVING answer_count = 0 ORDER BY q.created_at DESC`;
    else                      query += ` ORDER BY q.created_at DESC`;

    query += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [questions] = await db.query(query, params);

    // Count total for pagination
    const [countResult] = await db.query(
      `SELECT COUNT(DISTINCT q.id) AS total
       FROM questions q
       LEFT JOIN question_tags qt ON q.id = qt.question_id
       LEFT JOIN tags t ON qt.tag_id = t.id
       WHERE q.is_deleted = 0
       ${search ? 'AND (q.title LIKE ? OR q.body LIKE ?)' : ''}
       ${tag    ? 'AND t.name = ?' : ''}`,
      search && tag ? [`%${search}%`, `%${search}%`, tag]
      : search      ? [`%${search}%`, `%${search}%`]
      : tag         ? [tag]
      : []
    );

    res.json({
      success:   true,
      questions: questions.map(q => ({
        ...q,
        tags: q.tags ? q.tags.split(',') : []
      })),
      total:     countResult[0].total,
      page:      Number(page),
      totalPages: Math.ceil(countResult[0].total / limit)
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// GET /api/questions/:id
// ════════════════════════════════════════
const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Increment view count
    await db.query('UPDATE questions SET view_count = view_count + 1 WHERE id = ?', [id]);

    const [rows] = await db.query(`
      SELECT
        q.*, u.name AS user_name, u.avatar_url, u.reputation,
        GROUP_CONCAT(DISTINCT t.name SEPARATOR ',') AS tags
      FROM questions q
      JOIN users u ON q.user_id = u.id
      LEFT JOIN question_tags qt ON q.id = qt.question_id
      LEFT JOIN tags t ON qt.tag_id = t.id
      WHERE q.id = ? AND q.is_deleted = 0
      GROUP BY q.id
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const question = { ...rows[0], tags: rows[0].tags ? rows[0].tags.split(',') : [] };
    res.json({ success: true, question });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// POST /api/questions — create question
// ════════════════════════════════════════
const createQuestion = async (req, res) => {
  try {
    const { title, body, tags = [] } = req.body;
    const user_id = req.user.id;

    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Title and body are required' });
    }

    // Insert question
    const [result] = await db.query(
      'INSERT INTO questions (user_id, title, body) VALUES (?, ?, ?)',
      [user_id, title, body]
    );

    const questionId = result.insertId;

    // Handle tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        // Get or create tag
        let [tagRows] = await db.query('SELECT id FROM tags WHERE name = ?', [tagName]);
        let tagId;
        if (tagRows.length === 0) {
          const [newTag] = await db.query('INSERT INTO tags (name) VALUES (?)', [tagName]);
          tagId = newTag.insertId;
        } else {
          tagId = tagRows[0].id;
        }
        // Link tag to question
        await db.query(
          'INSERT IGNORE INTO question_tags (question_id, tag_id) VALUES (?, ?)',
          [questionId, tagId]
        );
        // Update tag usage count
        await db.query('UPDATE tags SET usage_count = usage_count + 1 WHERE id = ?', [tagId]);
      }
    }

    res.status(201).json({ success: true, questionId, message: 'Question posted!' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// DELETE /api/questions/:id
// ════════════════════════════════════════
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const [rows] = await db.query('SELECT user_id FROM questions WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
    if (rows[0].user_id !== user_id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await db.query('UPDATE questions SET is_deleted = 1 WHERE id = ?', [id]);
    res.json({ success: true, message: 'Question deleted' });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ════════════════════════════════════════
// GET /api/questions/tags — all tags
// ════════════════════════════════════════
const getTags = async (req, res) => {
  try {
    const [tags] = await db.query(
      'SELECT * FROM tags ORDER BY usage_count DESC'
    );
    res.json({ success: true, tags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getQuestions, getQuestion, createQuestion, deleteQuestion, getTags };