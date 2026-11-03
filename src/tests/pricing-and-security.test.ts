import test from 'node:test';
import assert from 'node:assert/strict';
import { formatINR, createMoney } from '../domain/types';
import { sanitizeText, sanitizeCleanDisplay } from '../security/sanitizer';
import { ProgressiveRateLimiter } from '../security/rate-limiter';

test('formatINR correctly formats integer paise into Indian currency', () => {
  assert.equal(formatINR(25000), '₹250');
  assert.equal(formatINR(95000), '₹950');
  assert.equal(formatINR(420000), '₹4,200');
  assert.equal(formatINR(25000000), '₹2,50,000');
});

test('createMoney rejects non-integers or negative values', () => {
  assert.throws(() => createMoney(-100));
  assert.throws(() => createMoney(12.5));
  const valid = createMoney(50000);
  assert.equal(valid.amountInPaise, 50000);
});

test('sanitizeText encodes harmful HTML characters', () => {
  const dirty = '<script>alert("xss")</script>';
  const clean = sanitizeText(dirty);
  assert.equal(clean.includes('<script>'), false);
  assert.equal(clean.includes('&lt;script&gt;'), true);
});

test('sanitizeCleanDisplay strips HTML tags safely', () => {
  const dirty = '<p>Happy Birthday <strong>Sheru</strong>!</p>';
  const clean = sanitizeCleanDisplay(dirty);
  assert.equal(clean, 'Happy Birthday Sheru!');
});

test('ProgressiveRateLimiter locks out after 3 failed attempts', () => {
  const limiter = new ProgressiveRateLimiter(3, 60);
  const email = 'test-admin@pawfect.org';

  assert.equal(limiter.checkLimit(email).allowed, true);

  limiter.recordFailure(email);
  limiter.recordFailure(email);
  assert.equal(limiter.checkLimit(email).allowed, true);

  const lock = limiter.recordFailure(email);
  assert.equal(lock.locked, true);
  assert.equal(limiter.checkLimit(email).allowed, false);

  limiter.recordSuccess(email);
  assert.equal(limiter.checkLimit(email).allowed, true);
});
