const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const db  = require('./config/db');
const app = express();

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status:   'OK',
      message:  'Server is running & DB is connected ✅',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status:  'ERROR',
      message: 'DB connection failed ❌',
      error:   err.message
    });
  }
});

// ── Routes (added milestone by milestone) ───
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answers', require('./routes/answers'));
// app.use('/api/votes',     require('./routes/votes'));

// ── Start Server ────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});