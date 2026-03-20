import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // allow cookies cross-origin in dev
}));

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀  Acadify API running on http://localhost:${PORT}`);
});
