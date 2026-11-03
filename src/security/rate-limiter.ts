/**
 * Rate Limiter and Progressive Lockout Manager
 * Protects administrative authentication and sensitive actions.
 */

interface AttemptRecord {
  count: number;
  lockedUntil: number | null;
  lastAttemptAt: number;
}

export class ProgressiveRateLimiter {
  private attempts: Map<string, AttemptRecord> = new Map();

  constructor(
    private readonly maxAttemptsBeforeLockout: number = 3,
    private readonly baseLockoutSeconds: number = 60
  ) {}

  checkLimit(key: string): { allowed: boolean; waitSeconds?: number } {
    const record = this.attempts.get(key);
    if (!record) return { allowed: true };

    const now = Date.now();
    if (record.lockedUntil && now < record.lockedUntil) {
      const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
      return { allowed: false, waitSeconds };
    }

    // Lockout has expired, reset counter if past 15 minutes of inactivity
    if (now - record.lastAttemptAt > 15 * 60 * 1000) {
      this.attempts.delete(key);
      return { allowed: true };
    }

    return { allowed: true };
  }

  recordFailure(key: string): { locked: boolean; waitSeconds: number } {
    const now = Date.now();
    const current = this.attempts.get(key) || {
      count: 0,
      lockedUntil: null,
      lastAttemptAt: now,
    };

    current.count += 1;
    current.lastAttemptAt = now;

    if (current.count >= this.maxAttemptsBeforeLockout) {
      const multiplier = Math.pow(2, Math.min(current.count - this.maxAttemptsBeforeLockout, 4));
      const lockoutDurationMs = this.baseLockoutSeconds * 1000 * multiplier;
      current.lockedUntil = now + lockoutDurationMs;
      this.attempts.set(key, current);
      return { locked: true, waitSeconds: Math.ceil(lockoutDurationMs / 1000) };
    }

    this.attempts.set(key, current);
    return { locked: false, waitSeconds: 0 };
  }

  recordSuccess(key: string): void {
    this.attempts.delete(key);
  }
}

export const adminLoginRateLimiter = new ProgressiveRateLimiter(3, 60);
