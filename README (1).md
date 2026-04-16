<div align="center">

# KNOT
### Academic Doubt-Solving Platform

**A Stack Overflow-style Q&A platform built for college students**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?style=flat&logo=node.js)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql&logoColor=white)](https://mysql.com)
[![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=flat&logo=socket.io)](https://socket.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat)](LICENSE)

[Live Demo](#) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**KNOT** is a full-stack academic doubt-solving platform where college students can post questions, answer doubts, collaborate through discussions, and earn reputation — all in real time.

Built as a learning project covering full-stack development, database design, real-time communication, and cloud deployment.

> "Where every *question* finds its **answer.**"

---

## ✨ Features

### 🔐 Authentication
- Email & password signup/login with JWT
- Password encryption using bcrypt
- Forgot password with reset token
- Remember me (localStorage vs sessionStorage)
- Google OAuth & Phone OTP *(coming soon)*

### ❓ Questions
- Post questions with title, body, and tags
- Predefined academic tags (DSA, DBMS, OS, CN, OOP, Web Dev, AI/ML, etc.)
- Custom tags support (up to 5 per question)
- Filter by tag, sort by newest/votes/unanswered
- Full-text search across questions
- View count tracking
- Mark question as solved

### 💬 Answers & Discussions
- Post detailed answers
- Accept best answer (question owner only)
- Nested comment threads
- Real-time answer notifications

### ⬆️ Voting System
- Upvote / downvote questions and answers
- Toggle votes (click again to remove)
- Cannot vote on own content
- Vote affects author reputation score

### 👤 User Profiles
- Public profile with stats
- Questions asked & answers given
- Reputation score tracking
- Edit profile (name, branch, year)

### 🔔 Real-Time Notifications
- WebSocket-based with Socket.io
- Instant notifications for new answers
- Upvote notifications
- Unread badge count on bell icon
- Mark all as read
- Browser push notifications (if permitted)

### 🔖 Bookmarks
- Save questions for later
- Dedicated bookmarks feed

### 🏷️ Trending Tags
- Weekly trending tags bar on home feed
- Tag-based filtering

### 🛡️ Admin Panel
- Dashboard with platform stats
- User management (promote/demote/delete)
- Question moderation
- Admin-only routes

### 📱 Responsive Design
- Mobile-friendly layout
- Reddit-inspired clean UI
- KNOT orange brand identity

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 (Vite) | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Socket.io Client | Real-time WebSocket |
| IBM Plex Sans | Typography |
| CSS Modules | Component styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 22 | Runtime |
| Express.js | Web framework |
| Socket.io | WebSocket server |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| mysql2 | MySQL driver |
| dotenv | Environment config |
| nodemon | Dev auto-restart |

### Database
| Technology | Purpose |
|---|---|
| MySQL 8 | Primary database |
| phpMyAdmin | DB management (dev) |

### Deployment
| Service | Purpose |
|---|---|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Railway | MySQL database |

---

## 📁 Project Structure

```
college-doubt-solver/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MySQL connection pool
│   ├── controllers/
│   │   ├── authController.js        # Signup, login, forgot password
│   │   ├── questionController.js    # CRUD for questions
│   │   ├── answerController.js      # CRUD for answers
│   │   ├── voteController.js        # Upvote/downvote logic
│   │   ├── notificationController.js # Notification CRUD
│   │   ├── bookmarkController.js    # Bookmark toggle & fetch
│   │   ├── profileController.js     # User profile
│   │   └── adminController.js       # Admin dashboard & actions
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT verification
│   │   └── adminMiddleware.js       # Admin role check
│   ├── routes/
│   │   ├── auth.js                  # Auth + profile routes
│   │   ├── questions.js             # Question routes
│   │   ├── answers.js               # Answer routes
│   │   ├── votes.js                 # Vote routes
│   │   ├── notifications.js         # Notification routes
│   │   ├── bookmarks.js             # Bookmark routes
│   │   └── admin.js                 # Admin routes
│   ├── .env                         # Environment variables
│   ├── server.js                    # Entry point + Socket.io setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js             # Axios instance + interceptors
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Global auth state
│   │   │   └── SocketContext.jsx    # Socket.io + notifications state
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── QuestionCard.jsx     # Question list item
│   │   │   ├── VoteButtons.jsx      # Up/down vote buttons
│   │   │   ├── NotificationBell.jsx # Bell + dropdown
│   │   │   └── ProtectedRoute.jsx   # Auth guard
│   │   ├── pages/
│   │   │   ├── Auth.jsx             # Login & signup page
│   │   │   ├── Home.jsx             # Question feed
│   │   │   ├── AskQuestion.jsx      # Post question form
│   │   │   ├── QuestionDetail.jsx   # Question + answers
│   │   │   ├── Profile.jsx          # User profile
│   │   │   └── Admin.jsx            # Admin panel
│   │   ├── styles/
│   │   │   ├── Navbar.css
│   │   │   ├── Home.css
│   │   │   ├── QuestionCard.css
│   │   │   ├── QuestionDetail.css
│   │   │   ├── AskQuestion.css
│   │   │   ├── VoteButtons.css
│   │   │   ├── NotificationBell.css
│   │   │   ├── Profile.css
│   │   │   └── Admin.css
│   │   ├── App.jsx                  # Routes setup
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Global styles
│   ├── .env.development             # Dev environment
│   ├── .env.production              # Prod environment
│   └── package.json
│
├── database/
│   └── schema.sql                   # Full MySQL schema
│
└── README.md
```

---

## 🗄️ Database Schema

KNOT uses **10 tables** in MySQL:

```
users            → Stores all user accounts and reputation
questions        → All posted questions
answers          → Answers to questions
tags             → Predefined and custom tags
question_tags    → Many-to-many: questions ↔ tags
votes            → Upvotes/downvotes on questions and answers
comments         → Nested comments on answers
bookmarks        → Saved questions per user
notifications    → Real-time notification records
otp_codes        → Phone OTP verification (future use)
```

Full schema available in `database/schema.sql`.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MySQL 8+ (via XAMPP/WAMP or Railway)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/college-doubt-solver.git
cd college-doubt-solver
```

### 2. Setup the Database

Open phpMyAdmin (or any MySQL client) and run:

```bash
# Create database and all tables
mysql -u root -p < database/schema.sql
```

Or manually open phpMyAdmin → SQL tab → paste contents of `database/schema.sql` → Go.

### 3. Setup the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=college_doubt_solver
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend runs at → `http://localhost:5000`

### 4. Setup the Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.development`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at → `http://localhost:5173`

### 5. Make Yourself an Admin (Optional)

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

Then visit `http://localhost:5173/admin`

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | *(leave blank for XAMPP)* |
| `DB_NAME` | Database name | `college_doubt_solver` |
| `JWT_SECRET` | JWT signing secret | `any_random_string` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |

### Frontend (`frontend/.env.development`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Socket.io server URL | `http://localhost:5000` |

---

## 📡 API Reference

### Auth Routes
```
POST   /api/auth/signup              Register new user
POST   /api/auth/login               Login user
POST   /api/auth/forgot-password     Send reset token
POST   /api/auth/reset-password      Reset password
GET    /api/auth/me                  Get current user (protected)
GET    /api/auth/profile/:id         Get user profile
PUT    /api/auth/profile             Update profile (protected)
```

### Question Routes
```
GET    /api/questions                Get all questions (search, filter, sort, paginate)
GET    /api/questions/tags           Get all tags
GET    /api/questions/trending-tags  Get trending tags (this week)
GET    /api/questions/:id            Get single question
POST   /api/questions                Create question (protected)
DELETE /api/questions/:id            Delete question (protected)
```

### Answer Routes
```
GET    /api/answers/:questionId      Get answers for a question
POST   /api/answers/:questionId      Post answer (protected)
PATCH  /api/answers/:id/accept       Accept answer (protected)
DELETE /api/answers/:id              Delete answer (protected)
```

### Vote Routes
```
POST   /api/votes                    Vote on question or answer (protected)
                                     Body: { target_type, target_id, vote_type }
```

### Notification Routes
```
GET    /api/notifications            Get user notifications (protected)
PATCH  /api/notifications            Mark all as read (protected)
PATCH  /api/notifications/:id        Mark one as read (protected)
DELETE /api/notifications/:id        Delete notification (protected)
```

### Bookmark Routes
```
GET    /api/bookmarks                Get user bookmarks (protected)
POST   /api/bookmarks/:questionId    Toggle bookmark (protected)
```

### Admin Routes *(admin only)*
```
GET    /api/admin/dashboard          Platform stats + recent activity
GET    /api/admin/users              All users list
DELETE /api/admin/users/:id          Delete user
PATCH  /api/admin/users/:id/admin    Toggle admin role
DELETE /api/admin/questions/:id      Delete question
```

---

## ☁️ Deployment

### Frontend → Vercel

```bash
# Build command
npm run build

# Output directory
dist

# Environment variables
VITE_API_URL=https://your-backend.onrender.com/api
VITE_SOCKET_URL=https://your-backend.onrender.com
```

### Backend → Render

```bash
# Root directory
backend

# Build command
npm install

# Start command
npm start

# Environment variables (same as .env but with production DB values)
```

### Database → Railway

1. Provision MySQL on Railway
2. Run `database/schema.sql` in the Railway query console
3. Copy connection credentials to Render environment variables

---

## 📱 Screenshots

> *(Add screenshots of your app here)*

| Page | Screenshot |
|---|---|
| Login / Signup | *coming soon* |
| Home Feed | *coming soon* |
| Question Detail | *coming soon* |
| Ask Question | *coming soon* |
| User Profile | *coming soon* |
| Admin Panel | *coming soon* |

---

## 🗺️ Roadmap

- [x] Email/password authentication with JWT
- [x] Question posting with tags
- [x] Answer system with accept answer
- [x] Upvote/downvote with reputation
- [x] Real-time notifications via Socket.io
- [x] User profiles with stats
- [x] Bookmarks
- [x] Trending tags
- [x] Admin panel
- [x] Working search bar
- [x] Mobile responsiveness
- [ ] Google OAuth login
- [ ] Phone OTP authentication
- [ ] Rich text editor (Quill.js)
- [ ] Image/file attachments on questions
- [ ] Dark mode toggle
- [ ] Email notifications
- [ ] Comment threads on answers
- [ ] Question edit history
- [ ] Export questions as PDF

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

**Pankaj**
- B.Tech Information Technology — Semester 4
- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- Inspired by [Stack Overflow](https://stackoverflow.com) and [Reddit](https://reddit.com)
- Built with guidance and AI assistance from [Claude](https://claude.ai) by Anthropic
- IBM Plex fonts by IBM
- Icons via inline SVG

---

<div align="center">
  <strong>Built with ❤️ for students, by a student</strong>
  <br />
  <sub>KNOT — Where every question finds its answer</sub>
</div>
