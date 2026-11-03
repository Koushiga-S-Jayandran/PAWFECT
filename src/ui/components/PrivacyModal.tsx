import React, { useState } from 'react';
import { Trash2, Shield, Check, X, AlertTriangle } from 'lucide-react';
import { BRAND_COPY } from '../../config/copy';

interface PrivacyModalProps {
  onClose: () => void;
  onDeleteMyData: () => Promise<void>;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose, onDeleteMyData }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteMyData();
      setDeleted(true);
      setTimeout(() => {
        onClose();
      }, 2500);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-paw-lg space-y-4">
        <div className="flex items-center justify-between border-b border-[#F4A8C3]/30 pb-3">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-[#3F7A59]" />
            <h2 id="privacy-modal-title" className="text-base font-bold text-[#7E1B43] font-heading">
              Privacy & Data Control
            </h2>
          </div>
          <button onClick={onClose} className="text-[#8A6B79] hover:text-[#3A2530]" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-[#8A6B79] leading-relaxed">
          {BRAND_COPY.gdprConsent}
        </p>

        {deleted ? (
          <div className="p-4 bg-[#EAF5EF] border border-[#C1E3CE] rounded-2xl text-xs text-[#3F7A59] font-bold text-center">
            ✓ Your personal family records and milestone dates have been permanently erased from our repositories.
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-[#FDF0F2] border border-[#F6C2CB] rounded-2xl flex items-start gap-2.5 text-xs text-[#A82944]">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>
                Erasing your data removes all saved family members, upcoming reminder notifications, and past dedication records.
              </span>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs text-[#3A2530]">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="rounded text-[#B0285F] focus:ring-[#B0285F]"
              />
              <span>I confirm that I wish to erase my saved family records.</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79]"
              >
                Keep My Data
              </button>
              <button
                type="button"
                disabled={!confirmed || isDeleting}
                onClick={handleDelete}
                className="px-5 py-2 bg-[#A82944] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#851E33] transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>{isDeleting ? 'Erasing...' : 'Delete My Data'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
