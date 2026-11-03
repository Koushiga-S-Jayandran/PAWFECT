import React, { useState } from 'react';
import { X, MapPin, CheckCircle2, Shield, Heart, FileText, Phone, Mail, Clock } from 'lucide-react';
import type { Shelter } from '../../../domain/types';
import { Badge } from '../../components/Badge';
import { BowCat } from '../../mascots/BowCat';

interface ShelterProfileModalProps {
  shelter: Shelter;
  onClose: () => void;
  onSelectGift: (shelter: Shelter) => void;
}

export const ShelterProfileModal: React.FC<ShelterProfileModalProps> = ({
  shelter,
  onClose,
  onSelectGift,
}) => {
  const [activeTab, setActiveTab] = useState<'proofs' | 'about' | 'docs'>('proofs');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shelter-modal-title"
    >
      <div className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-paw-lg">
        {/* Header Cover Banner */}
        <div className="relative h-48 sm:h-56 w-full bg-[#FDEBF0]">
          <img
            src={shelter.coverUrl}
            alt={shelter.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#FFF8F6]/90 backdrop-blur-xs hover:bg-[#FFF8F6] text-[#3A2530] rounded-full transition-colors shadow-paw-sm"
            aria-label="Close shelter profile"
          >
            <X size={18} />
          </button>

          <div className="absolute -bottom-6 left-6 flex items-end gap-3">
            <img
              src={shelter.avatarUrl}
              alt={shelter.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-[#FFF8F6] shadow-paw-md"
            />
          </div>
        </div>

        {/* Shelter Meta Header */}
        <div className="px-6 pt-8 pb-4 border-b border-[#F4A8C3]/40">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 id="shelter-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#7E1B43] font-heading">
                  {shelter.name}
                </h1>
                <Badge variant="verified" />
              </div>
              <p className="text-xs text-[#8A6B79] flex items-center gap-1.5 mt-1">
                <MapPin size={13} className="text-[#B0285F]" />
                <span>{shelter.address}, {shelter.city}, {shelter.state}</span>
              </p>
            </div>

            <button
              onClick={() => onSelectGift(shelter)}
              className="px-5 py-2.5 bg-[#B0285F] text-[#FFF8F6] font-bold text-xs rounded-full hover:bg-[#7E1B43] shadow-paw-sm flex items-center gap-1.5"
            >
              <Heart size={14} fill="currentColor" />
              <span>Gift a Meal or Aid</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 my-4 p-3 bg-[#FDEBF0]/70 rounded-2xl text-center">
            <div>
              <span className="block text-base font-bold text-[#7E1B43] font-heading">
                {shelter.dogCount} Dogs • {shelter.catCount} Cats
              </span>
              <span className="text-[11px] text-[#8A6B79]">Shelter Residents</span>
            </div>
            <div>
              <span className="block text-base font-bold text-[#7E1B43] font-heading">
                {shelter.mealsNeededDaily}
              </span>
              <span className="text-[11px] text-[#8A6B79]">Daily Meals Needed</span>
            </div>
            <div>
              <span className="block text-base font-bold text-[#3F7A59] font-heading">
                {shelter.mealsFundedTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-[#8A6B79]">Bowls Funded via Pawfect</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[#F4A8C3]/40 -mb-4">
            <button
              onClick={() => setActiveTab('proofs')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'proofs'
                  ? 'border-[#B0285F] text-[#B0285F]'
                  : 'border-transparent text-[#8A6B79] hover:text-[#3A2530]'
              }`}
            >
              Photo Proof History ({shelter.proofHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'about'
                  ? 'border-[#B0285F] text-[#B0285F]'
                  : 'border-transparent text-[#8A6B79] hover:text-[#3A2530]'
              }`}
            >
              Story & Facility
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'docs'
                  ? 'border-[#B0285F] text-[#B0285F]'
                  : 'border-transparent text-[#8A6B79] hover:text-[#3A2530]'
              }`}
            >
              Verified Documents & Bank
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'proofs' && (
            <div className="space-y-6">
              <div className="bg-[#EAF5EF] border border-[#C1E3CE] rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-[#3F7A59]">
                <Clock size={16} className="shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">48-Hour Proof Accountability Standard</strong>
                  <span>Every gift to {shelter.name} must be confirmed with timestamped bowl feeding photographs within 48 hours of dispatch.</span>
                </div>
              </div>

              {shelter.proofHistory.length === 0 ? (
                <div className="text-center py-8 bg-[#FDEBF0]/40 rounded-2xl p-6">
                  <BowCat size={72} mood="sleeping" className="mx-auto mb-2" />
                  <p className="text-xs text-[#8A6B79]">New shelter onboarded. Upcoming proof updates will be displayed here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {shelter.proofHistory.map(proof => (
                    <div
                      key={proof.id}
                      className="bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-2xl overflow-hidden shadow-paw-sm"
                    >
                      <img
                        src={proof.photoUrl}
                        alt={proof.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3.5">
                        <div className="flex items-center justify-between text-[11px] text-[#8A6B79] mb-1">
                          <span className="text-[#3F7A59] font-bold">
                            ✓ {proof.mealCountFunded} meals served
                          </span>
                          <span>{new Date(proof.timestamp).toLocaleDateString('en-IN')}</span>
                        </div>
                        <h4 className="text-xs font-bold text-[#3A2530] mb-1">{proof.title}</h4>
                        <p className="text-xs text-[#8A6B79] leading-relaxed">{proof.description}</p>
                        {proof.dogNames && proof.dogNames.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {proof.dogNames.map(name => (
                              <span key={name} className="px-1.5 py-0.2 bg-[#FDEBF0] text-[#7E1B43] rounded text-[10px]">
                                🐾 {name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4 text-xs sm:text-sm text-[#3A2530] leading-relaxed">
              <h3 className="text-sm font-bold text-[#7E1B43]">About the Sanctuary</h3>
              <p>{shelter.story}</p>
              <div className="p-4 bg-[#FDEBF0]/50 rounded-2xl space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <Phone size={14} className="text-[#B0285F]" />
                  <span>Contact Phone: <strong className="text-[#3A2530]">{shelter.contactPhone}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={14} className="text-[#B0285F]" />
                  <span>Official Email: <strong className="text-[#3A2530]">{shelter.contactEmail}</strong></span>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-[#7E1B43]">Verified Trust & 80G Documents</h3>
              <div className="space-y-2">
                {shelter.documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-2xl text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={16} className="text-[#B0285F]" />
                      <div>
                        <span className="font-bold text-[#3A2530] block">{doc.name}</span>
                        <span className="text-[#8A6B79] text-[10px]">
                          {(doc.sizeBytes / (1024 * 1024)).toFixed(1)} MB • Verified by Pawfect Audit Team
                        </span>
                      </div>
                    </div>
                    <span className="text-[#3F7A59] font-bold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Verified
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-2xl text-xs space-y-1">
                <span className="block font-bold text-[#7E1B43]">Shelter Bank Account (Masked for Security):</span>
                <span className="font-mono text-sm text-[#3A2530]">{shelter.bankDetailsMasked}</span>
                <p className="text-[11px] text-[#8A6B79] pt-1">
                  Pawfect transfers 100% of donor-gifted food and medical funds directly to this registered account.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
