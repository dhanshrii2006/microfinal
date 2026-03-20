import jwt from 'jsonwebtoken';
import { query } from '../db/pool.js';

/**
 * requireAuth
 * Attaches req.user if a valid JWT is present in the httpOnly cookie.
 * Returns 401 otherwise.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { rows } = await query(
      'SELECT id, name, email, role, avatar_url FROM users WHERE id = $1',
      [payload.userId]
    );

    if (!rows.length) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * requireRole(...roles)
 * Use after requireAuth. Restricts the route to specific roles.
 *
 * Example:
 *   router.get('/admin-only', requireAuth, requireRole('admin'), handler)
 *   router.get('/staff',      requireAuth, requireRole('admin', 'teacher'), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient role' });
  }
  next();
};
