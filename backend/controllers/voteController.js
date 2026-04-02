const db = require('../config/db');

// ════════════════════════════════════════
// POST /api/votes
// Body: { target_type: 'question'|'answer', target_id, vote_type: 'up'|'down' }
// ════════════════════════════════════════
const vote = async (req, res) => {
  try {
    const { target_type, target_id, vote_type } = req.body;
    const user_id = req.user.id;

    // Validate inputs
    if (!['question', 'answer'].includes(target_type)) {
      return res.status(400).json({ success: false, message: 'Invalid target type' });
    }
    if (!['up', 'down'].includes(vote_type)) {
      return res.status(400).json({ success: false, message: 'Invalid vote type' });
    }

    // Check if user already voted
    const [existing] = await db.query(
      'SELECT * FROM votes WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [user_id, target_type, target_id]
    );

    const table = target_type === 'question' ? 'questions' : 'answers';

    // Get target owner
    const [targetRows] = await db.query(
      `SELECT user_id FROM ${table} WHERE id = ?`,
      [target_id]
    );
    if (targetRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Target not found' });
    }
    const target_owner_id = targetRows[0].user_id;

    // Can't vote on own content
    if (target_owner_id === user_id) {
      return res.status(400).json({ success: false, message: "You can't vote on your own content" });
    }

    let action = '';
    let scoreDelta = 0;
    let repDelta = 0;

    if (existing.length > 0) {
      const existingVote = existing[0];

      if (existingVote.vote_type === vote_type) {
        // ── Same vote → REMOVE (toggle off) ──
        await db.query('DELETE FROM votes WHERE id = ?', [existingVote.id]);
        scoreDelta = vote_type === 'up' ? -1 : 1;
        repDelta = vote_type === 'up' ? -10 : 2;
        action = 'removed';
      } else {
        // ── Different vote → SWITCH ──
        await db.query(
          'UPDATE votes SET vote_type = ? WHERE id = ?',
          [vote_type, existingVote.id]
        );
        scoreDelta = vote_type === 'up' ? 2 : -2;
        repDelta = vote_type === 'up' ? 20 : -20;
        action = 'switched';
      }
    } else {
      // ── New vote ──
      await db.query(
        'INSERT INTO votes (user_id, target_type, target_id, vote_type) VALUES (?, ?, ?, ?)',
        [user_id, target_type, target_id, vote_type]
      );
      scoreDelta = vote_type === 'up' ? 1 : -1;
      repDelta = vote_type === 'up' ? 10 : -2;
      action = 'added';
    }

    // Update vote score on target
    await db.query(
      `UPDATE ${table} SET vote_score = vote_score + ? WHERE id = ?`,
      [scoreDelta, target_id]
    );

    // Update reputation of target owner
    await db.query(
      'UPDATE users SET reputation = reputation + ? WHERE id = ?',
      [repDelta, target_owner_id]
    );
    // ── Send real-time notification to content owner ──
    if (vote_type === 'up' && action !== 'removed') {
      const msg = target_type === 'question'
        ? `Someone upvoted your question`
        : `Someone upvoted your answer`;
      const link = target_type === 'question'
        ? `/question/${target_id}`
        : `/question/${target_id}`;

      await db.query(
        `INSERT INTO notifications (user_id, type, message, link)
     VALUES (?, 'upvote', ?, ?)`,
        [target_owner_id, msg, link]
      );

      const sendNotification = req.app.get('sendNotification');
      sendNotification(target_owner_id, {
        type: 'upvote',
        message: msg,
        link
      });
    }

    // Get new score
    const [updated] = await db.query(
      `SELECT vote_score FROM ${table} WHERE id = ?`,
      [target_id]
    );

    res.json({
      success: true,
      action,
      vote_type,
      new_score: updated[0].vote_score
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { vote };