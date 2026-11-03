import React from 'react';
import { Shield, Home, Users, Check, X } from 'lucide-react';
import type { User, AdminRole } from '../../domain/types';

interface RoleSwitcherModalProps {
  currentUser: User;
  onClose: () => void;
  onSelectRole: (role: User['role'], adminRole?: AdminRole, shelterId?: string) => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  currentUser,
  onClose,
  onSelectRole,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-switcher-title"
    >
      <div className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-paw-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#F4A8C3]/30 pb-3">
          <h2 id="role-switcher-title" className="text-base font-bold text-[#7E1B43] font-heading">
            Switch Persona / View
          </h2>
          <button onClick={onClose} className="text-[#8A6B79] hover:text-[#3A2530]" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-[#8A6B79]">
          Toggle between platform perspectives to test end-to-end user journeys:
        </p>

        <div className="space-y-3">
          {/* Donor Persona */}
          <button
            onClick={() => {
              onSelectRole('donor');
              onClose();
            }}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
              currentUser.role === 'donor'
                ? 'border-[#B0285F] bg-[#FDEBF0]'
                : 'border-[#F4A8C3]/60 bg-[#FFF8F6] hover:bg-[#FDEBF0]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} className="text-[#B0285F]" />
              <div>
                <strong className="text-xs font-bold text-[#3A2530] block">Donor Experience</strong>
                <span className="text-[11px] text-[#8A6B79]">
                  Browse shelters, checkout meals, save family dates, view certificates
                </span>
              </div>
            </div>
            {currentUser.role === 'donor' && <Check size={16} className="text-[#B0285F]" />}
          </button>

          {/* Shelter Rep Persona */}
          <button
            onClick={() => {
              onSelectRole('shelter_rep', undefined, 'sh_bengaluru_chhaya');
              onClose();
            }}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
              currentUser.role === 'shelter_rep'
                ? 'border-[#B0285F] bg-[#FDEBF0]'
                : 'border-[#F4A8C3]/60 bg-[#FFF8F6] hover:bg-[#FDEBF0]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Home size={20} className="text-[#3F7A59]" />
              <div>
                <strong className="text-xs font-bold text-[#3A2530] block">Shelter Portal (Chhaya Sanctuary)</strong>
                <span className="text-[11px] text-[#8A6B79]">
                  Upload 48h photo proof, manage dogs, and view pantry allotments
                </span>
              </div>
            </div>
            {currentUser.role === 'shelter_rep' && <Check size={16} className="text-[#3F7A59]" />}
          </button>

          {/* Admin Persona */}
          <button
            onClick={() => {
              onSelectRole('admin', 'Super Admin');
              onClose();
            }}
            className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
              currentUser.role === 'admin'
                ? 'border-[#B0285F] bg-[#FDEBF0]'
                : 'border-[#F4A8C3]/60 bg-[#FFF8F6] hover:bg-[#FDEBF0]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-[#7E1B43]" />
              <div>
                <strong className="text-xs font-bold text-[#3A2530] block">Admin Control Center</strong>
                <span className="text-[11px] text-[#8A6B79]">
                  Shelter verification, moderation queue, analytics, audit log
                </span>
              </div>
            </div>
            {currentUser.role === 'admin' && <Check size={16} className="text-[#7E1B43]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
