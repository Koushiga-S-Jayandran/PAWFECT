/**
 * Utility script to generate a secure password hash for ADMIN_PASSWORD_HASH in .env.local
 * Usage: npx tsx scripts/hash-password.ts "your-secure-admin-password"
 */

import { scryptSync, randomBytes } from 'node:crypto';

function hashPassword(password: string): string {
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derivedKey}`;
}

const inputPassword = process.argv[2];

if (!inputPassword) {
  console.error('Error: Please provide a password as an argument.');
  console.log('Usage: npx tsx scripts/hash-password.ts "<password>"');
  process.exit(1);
}

try {
  const hash = hashPassword(inputPassword);
  console.log('\n--- Generated Password Hash ---');
  console.log(hash);
  console.log('\nAdd this line to your .env.local file:');
  console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(`Error: ${err.message}`);
  }
  process.exit(1);
}
