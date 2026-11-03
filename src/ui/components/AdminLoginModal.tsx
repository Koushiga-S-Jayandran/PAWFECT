import React, { useState } from 'react';
import { Lock, Shield, AlertCircle, X, KeyRound } from 'lucide-react';
import type { AdminAuthContract } from '../../security/auth-service';
import type { User } from '../../domain/types';

interface AdminLoginModalProps {
  authService: AdminAuthContract;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  authService,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@pawfect.org');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Calls server-contract auth service
      const result = await authService.verifyAdminCredentials(
        email.trim(),
        password,
        totpCode ? totpCode.trim() : undefined
      );

      if (!result.success || !result.user) {
        // Enforce generic security error
        setErrorMessage(result.error || "Those details didn't work");
        // Clear password immediately from component memory
        setPassword('');
        return;
      }

      // Password discarded immediately
      setPassword('');
      onLoginSuccess(result.user);
      onClose();
    } catch {
      setErrorMessage("Those details didn't work");
      setPassword('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-login-heading"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-paw-lg space-y-4"
      >
        <div className="flex items-center justify-between border-b border-[#F4A8C3]/40 pb-3">
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-[#B0285F]" />
            <h2 id="admin-login-heading" className="text-base font-bold text-[#7E1B43] font-heading">
              Pawfect Staff & Admin Access
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#8A6B79] hover:text-[#3A2530]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-[#8A6B79]">
          Access restricted to verified verification officers, shelter liaisons, and finance auditors.
        </p>

        {errorMessage && (
          <div className="p-3 bg-[#FDF0F2] border border-[#F6C2CB] text-[#A82944] text-xs rounded-xl flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#3A2530] mb-1">Staff Work Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@pawfect.org"
            className="w-full px-3.5 py-2.5 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3A2530] mb-1">
            Admin Password:
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full px-3.5 py-2.5 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
          />
          <span className="text-[10px] text-[#8A6B79] mt-0.5 block">
            Minimum 8 characters. Verified via ADMIN_PASSWORD_HASH server contract.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#3A2530] mb-1">
            TOTP 2FA Token (Optional 6 digits):
          </label>
          <input
            type="text"
            maxLength={6}
            value={totpCode}
            onChange={e => setTotpCode(e.target.value)}
            placeholder="e.g. 123456"
            className="w-full px-3.5 py-2.5 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
          />
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#8A6B79]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] transition-colors shadow-paw-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Authenticate'}
          </button>
        </div>
      </form>
    </div>
  );
};
