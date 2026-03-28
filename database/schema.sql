-- =============================================
-- COLLEGE DOUBT SOLVER — FULL DATABASE SCHEMA
-- =============================================

CREATE DATABASE IF NOT EXISTS college_doubt_solver;
USE college_doubt_solver;

-- ─────────────────────────────────────────────
-- 1. USERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) UNIQUE,
  phone         VARCHAR(15) UNIQUE,
  password_hash VARCHAR(255),
  auth_provider ENUM('local', 'google', 'phone') DEFAULT 'local',
  google_id     VARCHAR(255) UNIQUE,
  branch        VARCHAR(100),
  year          TINYINT,
  avatar_url    VARCHAR(500),
  reputation    INT DEFAULT 0,
  role          ENUM('student', 'admin') DEFAULT 'student',
  is_verified   BOOLEAN DEFAULT FALSE,
  reset_token   VARCHAR(255),
  reset_expires DATETIME,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
-- 2. TAGS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE tags (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(50) NOT NULL UNIQUE,
  color       VARCHAR(7) DEFAULT '#6366f1',
  usage_count INT DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Predefined academic tags
INSERT INTO tags (name, color) VALUES
  ('DSA',         '#ef4444'),
  ('DBMS',        '#f97316'),
  ('OS',          '#eab308'),
  ('CN',          '#22c55e'),
  ('OOP',         '#3b82f6'),
  ('Web Dev',     '#8b5cf6'),
  ('AI/ML',       '#ec4899'),
  ('Mathematics', '#14b8a6'),
  ('Physics',     '#06b6d4'),
  ('General',     '#6b7280');

-- ─────────────────────────────────────────────
-- 3. QUESTIONS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE questions (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  title        VARCHAR(300) NOT NULL,
  body         TEXT NOT NULL,
  image_url    VARCHAR(500),
  view_count   INT DEFAULT 0,
  vote_score   INT DEFAULT 0,
  answer_count INT DEFAULT 0,
  is_solved    BOOLEAN DEFAULT FALSE,
  is_deleted   BOOLEAN DEFAULT FALSE,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 4. QUESTION_TAGS (junction table)
-- ─────────────────────────────────────────────
CREATE TABLE question_tags (
  question_id INT NOT NULL,
  tag_id      INT NOT NULL,
  PRIMARY KEY (question_id, tag_id),
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id)      REFERENCES tags(id)      ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 5. ANSWERS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE answers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  question_id INT NOT NULL,
  user_id     INT NOT NULL,
  body        TEXT NOT NULL,
  vote_score  INT DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  is_deleted  BOOLEAN DEFAULT FALSE,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 6. COMMENTS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  answer_id  INT NOT NULL,
  parent_id  INT DEFAULT NULL,
  body       TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)   REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (answer_id) REFERENCES answers(id)  ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 7. VOTES TABLE
-- ─────────────────────────────────────────────
CREATE TABLE votes (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  target_type ENUM('question', 'answer') NOT NULL,
  target_id   INT NOT NULL,
  vote_type   ENUM('up', 'down') NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_vote (user_id, target_type, target_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 8. BOOKMARKS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE bookmarks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  question_id INT NOT NULL,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_bookmark (user_id, question_id),
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 9. NOTIFICATIONS TABLE
-- ─────────────────────────────────────────────
CREATE TABLE notifications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  type       ENUM('answer','upvote','comment','reply','system') NOT NULL,
  message    VARCHAR(500) NOT NULL,
  link       VARCHAR(500),
  is_read    BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ─────────────────────────────────────────────
-- 10. OTP TABLE
-- ─────────────────────────────────────────────
CREATE TABLE otp_codes (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  phone      VARCHAR(15) NOT NULL,
  code       VARCHAR(6)  NOT NULL,
  expires_at DATETIME    NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);