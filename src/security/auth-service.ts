/**
 * Admin and User Authentication Service Contract
 * Complies with strict security rules:
 * - No password, token, or secret is hardcoded in any client code or mock file.
 * - Admin password is provided solely through ADMIN_PASSWORD_HASH in .env.local.
 * - In this frontend contract, admin credentials call the verifyAdminCredentials contract.
 * - Generic error message: "Those details didn't work".
 * - Rate limiting and progressive lockout enforced.
 */

import { adminLoginRateLimiter } from './rate-limiter';
import type { AdminRole, User } from '../domain/types';

export interface AdminAuthContract {
  verifyAdminCredentials(
    email: string,
    passwordAttempt: string,
    totpCode?: string
  ): Promise<{ success: boolean; user?: User; error?: string }>;
}

export class MockAdminAuthService implements AdminAuthContract {
  constructor(
    private readonly auditLogCallback?: (action: string, email: string, details: string) => Promise<void>
  ) {}

  async verifyAdminCredentials(
    email: string,
    passwordAttempt: string,
    totpCode?: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const rateCheck = adminLoginRateLimiter.checkLimit(email);
    if (!rateCheck.allowed) {
      if (this.auditLogCallback) {
        await this.auditLogCallback(
          'ADMIN_LOGIN_RATE_LIMITED',
          email,
          `Account temporarily locked for ${rateCheck.waitSeconds}s`
        );
      }
      return {
        success: false,
        error: `Too many unsuccessful attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
      };
    }

    // In a real production deployment, this invokes:
    // POST /api/admin/auth/verify (httpOnly cookie session)
    // Server verifies against process.env.ADMIN_PASSWORD_HASH using Argon2id/scrypt.
    // In our mock environment, we verify that:
    // 1) The email belongs to an authorized admin staff domain (e.g. @pawfect.org or admin role)
    // 2) The password meets complexity standards (min 8 chars)
    // 3) If TOTP code is provided, it is valid 6-digit
    const isKnownAdminDomain = email.toLowerCase().endsWith('@pawfect.org') || email.toLowerCase().includes('admin');
    const isValidLength = passwordAttempt && passwordAttempt.length >= 8;
    const isTotpValid = !totpCode || /^\d{6}$/.test(totpCode.trim());

    if (!isKnownAdminDomain || !isValidLength || !isTotpValid) {
      const lockStatus = adminLoginRateLimiter.recordFailure(email);
      if (this.auditLogCallback) {
        await this.auditLogCallback(
          'ADMIN_LOGIN_FAILED',
          email,
          lockStatus.locked
            ? `Failed attempt triggered lockout for ${lockStatus.waitSeconds}s`
            : 'Invalid credentials attempt'
        );
      }
      // Strict generic error message required by security spec:
      return {
        success: false,
        error: "Those details didn't work",
      };
    }

    // Determine role based on email or default to Super Admin
    let adminRole: AdminRole = 'Super Admin';
    if (email.includes('verify') || email.includes('shelter')) adminRole = 'Verification';
    else if (email.includes('support')) adminRole = 'Support';
    else if (email.includes('finance')) adminRole = 'Finance';

    adminLoginRateLimiter.recordSuccess(email);

    if (this.auditLogCallback) {
      await this.auditLogCallback(
        'ADMIN_LOGIN_SUCCESS',
        email,
        `Successful administrative authentication as ${adminRole}`
      );
    }

    const adminUser: User = {
      id: `usr_admin_${Date.now()}`,
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      phone: '+91 98765 00000',
      role: 'admin',
      adminRole,
      optedOutFromLeaderboard: true,
      streakDays: 45,
      totalMealsFunded: 240,
      createdAt: '2024-01-01T00:00:00Z',
    };

    return { success: true, user: adminUser };
  }
}
