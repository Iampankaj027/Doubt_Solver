const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const db     = require('../config/db');

// ─── Helper: Generate JWT ───────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ─── Helper: Success Response ───────────────
const sendTokenResponse = (res, statusCode, user) => {
  const token = generateToken(user.id);
  const { password_hash, ...userData } = user;

  res.status(statusCode).json({
    success: true,
    token,
    user: userData
  });
};

// ════════════════════════════════════════════
// @route   POST /api/auth/signup
// @access  Public
// ════════════════════════════════════════════
const signup = async (req, res) => {
  try {
    const { name, email, password, branch, year } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required.'
      });
    }

    // 2. Check if email already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    // 3. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.'
      });
    }

    // 4. Hash password
    const salt          = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 5. Insert user into DB
    const [result] = await db.query(
      `INSERT INTO users (name, email, password_hash, branch, year, auth_provider)
       VALUES (?, ?, ?, ?, ?, 'local')`,
      [name, email, password_hash, branch || null, year || null]
    );

    // 6. Fetch the created user
    const [rows] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );

    sendTokenResponse(res, 201, rows[0]);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Signup failed.',
      error:   err.message
    });
  }
};

// ════════════════════════════════════════════
// @route   POST /api/auth/login
// @access  Public
// ════════════════════════════════════════════
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.'
      });
    }

    // 2. Find user by email
    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const user = rows[0];

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    sendTokenResponse(res, 200, user);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Login failed.',
      error:   err.message
    });
  }
};

// ════════════════════════════════════════════
// @route   POST /api/auth/forgot-password
// @access  Public
// ════════════════════════════════════════════
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.'
      });
    }

    // 1. Check if user exists
    const [rows] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No account found with that email.'
      });
    }

    // 2. Generate reset token
    const resetToken   = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

    // 3. Save token to DB
    await db.query(
      'UPDATE users SET reset_token = ?, reset_expires = ? WHERE email = ?',
      [resetToken, resetExpires, email]
    );

    // 4. In production you'd email this link — for now we return it
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    res.status(200).json({
      success:    true,
      message:    'Password reset token generated.',
      resetLink,           // ← remove this in production, send via email
      resetToken           // ← remove this in production
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Forgot password failed.',
      error:   err.message
    });
  }
};

// ════════════════════════════════════════════
// @route   POST /api/auth/reset-password
// @access  Public
// ════════════════════════════════════════════
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required.'
      });
    }

    // 1. Find user with valid token
    const [rows] = await db.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()',
      [token]
    );
    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reset token is invalid or has expired.'
      });
    }

    // 2. Hash new password
    const salt          = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    // 3. Update password and clear token
    await db.query(
      'UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [password_hash, rows[0].id]
    );

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login.'
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Reset password failed.',
      error:   err.message
    });
  }
};

// ════════════════════════════════════════════
// @route   GET /api/auth/me
// @access  Protected
// ════════════════════════════════════════════
const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user:    req.user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Could not fetch user.',
      error:   err.message
    });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getMe
};