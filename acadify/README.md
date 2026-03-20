# Acadify — Backend Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+ running locally
- npm 9+

---

## 1. Create the database

Open psql and run:

```sql
CREATE DATABASE acadify;
```

---

## 2. Install dependencies

From the project root:

```bash
npm install          # installs root devDependencies (concurrently)
cd server && npm install
```

---

## 3. Configure environment

```bash
cd server
cp .env.example .env
```

Open `.env` and set:

| Variable | What to put |
|---|---|
| `DATABASE_URL` | `postgresql://YOUR_PG_USER:YOUR_PG_PASSWORD@localhost:5432/acadify` |
| `JWT_SECRET` | Any long random string, e.g. output of `openssl rand -base64 48` |
| `COOKIE_SECRET` | Another long random string |

---

## 4. Run migrations

```bash
cd server
npm run db:migrate
```

This creates all 10 tables (users, courses, enrollments, modules, videos, video_progress, quizzes, questions, quiz_attempts, posts).

---

## 5. Seed demo users (optional)

```bash
npm run db:seed
```

Creates three accounts, all with password `password123`:

| Email | Role |
|---|---|
| admin@acadify.dev | admin |
| teacher@acadify.dev | teacher |
| student@acadify.dev | student |

---

## 6. Start the dev server

```bash
npm run dev
```

API is live at **http://localhost:5000**

---

## API endpoints (Phase 1)

### Auth

| Method | Path | Body | Auth required |
|---|---|---|---|
| POST | `/api/auth/register` | `{name, email, password, role}` | No |
| POST | `/api/auth/login` | `{email, password}` | No |
| POST | `/api/auth/logout` | — | No |
| GET | `/api/auth/me` | — | Yes (cookie) |
| GET | `/api/health` | — | No |

### Register example
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@test.com","password":"password123","role":"student"}'
```

### Login example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -c cookies.txt \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}'
```

### Get current user
```bash
curl http://localhost:5000/api/auth/me \
  -b cookies.txt
```

---

## Project structure

```
acadify/
├── package.json          # root monorepo
├── server/
│   ├── package.json
│   ├── .env.example
│   ├── nodemon.json
│   └── src/
│       ├── index.js                        # Express entry point
│       ├── db/
│       │   ├── pool.js                     # pg connection pool
│       │   ├── migrate.js                  # run once: create tables
│       │   └── seed.js                     # demo users
│       ├── middleware/
│       │   └── auth.js                     # requireAuth, requireRole
│       ├── controllers/
│       │   └── auth.controller.js          # register, login, logout, me
│       └── routes/
│           └── auth.routes.js
└── client/               # React frontend (Phase 2)
```

---

## What's coming in Phase 2 (Frontend)

- React + Vite + Tailwind CSS
- Login / Register pages
- Role-based routing (student / teacher / admin dashboard shells)
- Auth context with `/api/auth/me` on load

---

## Database schema overview

```
users ──< enrollments >── courses ──< modules ──< videos
                                              └──< quizzes ──< questions
users ──< quiz_attempts
users ──< posts >── posts  (self-ref for replies)
users ──< video_progress
```
