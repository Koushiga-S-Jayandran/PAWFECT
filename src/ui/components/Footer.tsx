import React, { useState, useEffect } from 'react';
import { Heart, Shield, Lock, Trash2, PawPrint } from 'lucide-react';
import { BRAND_COPY } from '../../config/copy';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onOpenPrivacyModal: () => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdminLogin,
  onOpenPrivacyModal,
  onNavigate,
}) => {
  const [companionsPaused, setCompanionsPaused] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('pawfect_pause_companions');
      setCompanionsPaused(stored === 'true');
    } catch {
      // no-op
    }
  }, []);

  const handleToggleCompanions = () => {
    const next = !companionsPaused;
    setCompanionsPaused(next);
    try {
      localStorage.setItem('pawfect_pause_companions', String(next));
      window.dispatchEvent(new Event('pawfect_toggle_companions'));
    } catch {
      // no-op
    }
  };

  return (
    <footer className="mt-20 border-t border-[#F4A8C3]/50 bg-[#FDEBF0]/60 text-[#3A2530] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/aistudio/pawfect-logo-brown-beige_f8c728e7.png"
                alt="Pawfect Logo"
                className="h-10 w-auto object-contain"
              />
              <div>
                <span className="text-xl font-bold text-[#7E1B43] font-heading block">
                  {BRAND_COPY.name}
                </span>
                <span className="text-xs text-[#8A6B79] block">
                  {BRAND_COPY.tagline}
                </span>
              </div>
            </div>
            <p className="text-sm text-[#8A6B79] max-w-md leading-relaxed">
              {BRAND_COPY.mission}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#7E1B43] font-semibold bg-[#FFF8F6] px-3.5 py-2 rounded-2xl border border-[#F4A8C3]/50 w-fit">
              <Shield size={14} className="text-[#3F7A59]" />
              <span>Strict 48-Hour Photo Proof Policy & Verified 80G Shelters</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E1B43] mb-3">
              Marketplace
            </h3>
            <ul className="space-y-2 text-sm text-[#8A6B79]">
              <li>
                <button onClick={() => onNavigate('shelters')} className="hover:text-[#B0285F] transition-colors">
                  Verified Shelters (Bengaluru, Mumbai, Delhi, Pune)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gifts')} className="hover:text-[#B0285F] transition-colors">
                  Gift Meals & Medical Aid
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('batches')} className="hover:text-[#B0285F] transition-colors">
                  Community Emergency Batches
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('name-a-dog')} className="hover:text-[#B0285F] transition-colors">
                  Name a Shelter Dog & Collar Pick
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('membership')} className="hover:text-[#B0285F] transition-colors">
                  Giving Membership (Guardian / Champion)
                </button>
              </li>
            </ul>
          </div>

          {/* Settings & Privacy */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E1B43] mb-3">
              Preferences & Trust
            </h3>
            <div className="space-y-3 text-sm">
              {/* Cursor Companions Toggle */}
              <div className="flex items-center justify-between bg-[#FFF8F6] p-2.5 rounded-2xl border border-[#F4A8C3]/60">
                <span className="text-xs text-[#3A2530] font-medium flex items-center gap-1.5">
                  <PawPrint size={13} className="text-[#B0285F]" />
                  <span>Mascot companions:</span>
                </span>
                <button
                  onClick={handleToggleCompanions}
                  className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                    companionsPaused
                      ? 'bg-[#8A6B79] text-[#FFF8F6]'
                      : 'bg-[#B0285F] text-[#FFF8F6]'
                  }`}
                >
                  {companionsPaused ? 'Paused' : 'Active'}
                </button>
              </div>

              {/* Data & Privacy */}
              <button
                onClick={onOpenPrivacyModal}
                className="w-full text-left flex items-center justify-between text-xs text-[#8A6B79] hover:text-[#B0285F] p-1"
              >
                <span className="flex items-center gap-1.5">
                  <Trash2 size={13} />
                  <span>Privacy & Delete My Data</span>
                </span>
                <span className="underline">Review</span>
              </button>

              {/* Admin Access discreet trigger */}
              <button
                onClick={onOpenAdminLogin}
                className="w-full text-left flex items-center gap-1.5 text-xs text-[#8A6B79] hover:text-[#7E1B43] p-1 opacity-80 hover:opacity-100"
              >
                <Lock size={12} />
                <span>Admin Staff Portal</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#F4A8C3]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A6B79]">
          <p>© {new Date().getFullYear()} Pawfect. All rights reserved. Made with love for Indian street and shelter rescues.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[#3F7A59]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7A59]" />
              Zero-Platform-Fee for Shelters
            </span>
            <span>All amounts in INR (₹)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
