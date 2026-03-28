const jwt  = require('jsonwebtoken');
const db   = require('../config/db');

const protect = async (req, res, next) => {
  try {
    // 1. Check for token in headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.'
      });
    }

    // 2. Extract token
    const token = authHeader.split(' ')[1];

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from DB
    const [rows] = await db.query(
      'SELECT id, name, email, role, reputation, branch, year, avatar_url FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    // 5. Attach user to request
    req.user = rows[0];
    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error:   err.message
    });
  }
};

module.exports = { protect };