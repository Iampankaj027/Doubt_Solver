const express  = require('express');
const cors     = require('cors');
const http     = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const db  = require('./config/db');
const app = express();

// ── Create HTTP server + Socket.io ──────
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// ── Make io accessible in controllers ───
app.set('io', io);

// ── Middleware ──────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({
      status:    'OK',
      message:   'Server is running & DB is connected ✅',
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

// ── Routes ──────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/answers',   require('./routes/answers'));
app.use('/api/votes',     require('./routes/votes'));
app.use('/api/notifications', require('./routes/notifications'));


// ── Socket.io ───────────────────────────
// Store online users: userId → socketId
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id);

  // User joins with their userId
  socket.on('join', (userId) => {
    if (userId) {
      onlineUsers.set(String(userId), socket.id);
      console.log(`👤 User ${userId} joined`);
    }
  });

  socket.on('disconnect', () => {
    // Remove user from online map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`👤 User ${userId} left`);
        break;
      }
    }
  });
});

// Helper to send notification to a specific user
app.set('sendNotification', (userId, notification) => {
  const socketId = onlineUsers.get(String(userId));
  if (socketId) {
    io.to(socketId).emit('notification', notification);
  }
});

// ── Start Server ────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready`);
});