/**
 * acadify/server/src/db/migrate.js
 *
 * Run once:  npm run db:migrate
 * Creates all tables in order, safe to re-run (IF NOT EXISTS).
 */

import dotenv from 'dotenv';
dotenv.config();

import pool from './pool.js';

const sql = `
-- ─────────────────────────────────────────
-- 1. USERS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(120)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    TEXT          NOT NULL,          -- bcrypt hash
  role        VARCHAR(20)   NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 2. COURSES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        VARCHAR(200)  NOT NULL,
  description  TEXT,
  invite_code  VARCHAR(10)   NOT NULL UNIQUE,  -- 6-char teacher-generated code
  teacher_id   UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN       NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 3. ENROLLMENTS  (student ↔ course)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID  NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  course_id   UUID  NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, course_id)
);

-- ─────────────────────────────────────────
-- 4. MODULES  (ordered sections inside a course)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS modules (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID          NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       VARCHAR(200)  NOT NULL,
  position    INTEGER       NOT NULL DEFAULT 0,  -- ordering
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 5. VIDEOS  (YouTube / Vimeo embed per module)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID          NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title       VARCHAR(200)  NOT NULL,
  embed_url   TEXT          NOT NULL,  -- full YouTube/Vimeo embed URL
  duration    INTEGER,                 -- seconds (optional, for display)
  position    INTEGER       NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 6. VIDEO WATCH HISTORY
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS video_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID  NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  video_id     UUID  NOT NULL REFERENCES videos(id)  ON DELETE CASCADE,
  watched_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed    BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (student_id, video_id)
);

-- ─────────────────────────────────────────
-- 7. QUIZZES
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id   UUID          NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title       VARCHAR(200)  NOT NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 8. QUIZ QUESTIONS  (MCQ)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id         UUID  NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  body            TEXT  NOT NULL,
  options         JSONB NOT NULL,   -- ["opt A","opt B","opt C","opt D"]
  correct_index   INTEGER NOT NULL, -- 0-based index into options
  position        INTEGER NOT NULL DEFAULT 0
);

-- ─────────────────────────────────────────
-- 9. QUIZ ATTEMPTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID  NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  quiz_id     UUID  NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  answers     JSONB NOT NULL,  -- [{question_id, chosen_index}]
  score       INTEGER NOT NULL,
  total       INTEGER NOT NULL,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- 10. DISCUSSION POSTS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID  NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  author_id   UUID  NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  parent_id   UUID  REFERENCES posts(id) ON DELETE CASCADE,  -- NULL = top-level
  body        TEXT  NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- Helpful indexes
-- ─────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_enrollments_student   ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course    ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_course        ON modules(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_module         ON videos(module_id);
CREATE INDEX IF NOT EXISTS idx_posts_course          ON posts(course_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON quiz_attempts(student_id);
`;

async function migrate() {
  console.log('🗄  Running migrations...');
  try {
    await pool.query(sql);
    console.log('✅  All tables created (or already exist).');
  } catch (err) {
    console.error('❌  Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
