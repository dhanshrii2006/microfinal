import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';

const SALT_ROUNDS = 10;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  });
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!['student', 'teacher'].includes(role)) {
      // Public registration only allows student or teacher.
      // Admin accounts are created via seed or a separate admin panel.
      return res.status(400).json({ error: 'Role must be student or teacher' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check duplicate email
    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name.trim(), email.toLowerCase(), hash, role]
    );

    const user = rows[0];
    const token = signToken(user.id);

    res.cookie('token', token, COOKIE_OPTIONS);
    return res.status(201).json({ user });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { rows } = await query(
      'SELECT id, name, email, password, role, avatar_url FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (!rows.length) {
      // Generic message to avoid email enumeration
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id);
    res.cookie('token', token, COOKIE_OPTIONS);

    const { password: _pw, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = (_req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTIONS, maxAge: 0 });
  return res.json({ message: 'Logged out' });
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// Protected — requires requireAuth middleware before this handler
export const me = (req, res) => {
  return res.json({ user: req.user });
};
