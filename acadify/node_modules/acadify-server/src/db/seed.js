/**
 * acadify/server/src/db/seed.js
 *
 * Run after migrate:  npm run db:seed
 * Creates demo users for local development.
 */

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import pool from './pool.js';

const SALT = 10;
const PASSWORD = 'password123'; // all demo accounts share this

async function seed() {
  console.log('🌱  Seeding demo users...');
  const hash = await bcrypt.hash(PASSWORD, SALT);

  try {
    await pool.query(`
      INSERT INTO users (name, email, password, role) VALUES
        ('Admin User',   'admin@acadify.dev',   $1, 'admin'),
        ('Jane Teacher', 'teacher@acadify.dev',  $1, 'teacher'),
        ('Sam Student',  'student@acadify.dev',  $1, 'student')
      ON CONFLICT (email) DO NOTHING;
    `, [hash]);

    console.log('✅  Seed complete.');
    console.log('');
    console.log('   admin@acadify.dev   / password123  (admin)');
    console.log('   teacher@acadify.dev / password123  (teacher)');
    console.log('   student@acadify.dev / password123  (student)');
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
