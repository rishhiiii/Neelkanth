#!/usr/bin/env node

/**
 * Seed the initial developer admin account.
 *
 * Usage:
 *   node src/scripts/seedAdmin.js
 *
 * Reads credentials from environment variables (via .env):
 *   SEED_ADMIN_EMAIL    (default: admin@neelkanth.com)
 *   SEED_ADMIN_PASSWORD (default: ChangeMe123!)
 *   SEED_ADMIN_NAME     (default: Developer Admin)
 *
 * Skips gracefully if the admin already exists.
 */

import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Admin } from '../models/index.js';
import env from '../config/env.js';

const BCRYPT_ROUNDS = 12;

const email = process.env.SEED_ADMIN_EMAIL || 'admin@neelkanth.com';
const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
const name = process.env.SEED_ADMIN_NAME || 'Developer Admin';

async function seed() {
  await mongoose.connect(env.mongoUri);
  console.log('Connected to MongoDB');

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const admin = await Admin.create({
    name,
    email,
    passwordHash,
    role: 'developer',
    isEmailVerified: true,
    isActive: true,
  });

  console.log(`Developer admin created:`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Role:  ${admin.role}`);
  console.log(`  ID:    ${admin._id}`);
  console.log(`\n⚠  Change the default password immediately in production!`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
