import React, { useState } from 'react';
import { Upload, Clock, CheckCircle2, AlertCircle, FileText, Plus, Shield, Dog, Utensils } from 'lucide-react';
import type { Shelter, ShelterProof, SponsoredDog, Gift } from '../../../domain/types';
import { validateFileUpload } from '../../../security/sanitizer';
import { BowCat } from '../../mascots/BowCat';

interface ShelterDashboardProps {
  shelter: Shelter;
  dogs: SponsoredDog[];
  gifts: Gift[];
  onUploadProof: (shelterId: string, proof: Omit<ShelterProof, 'id' | 'timestamp'>) => Promise<void>;
  onRegisterShelterDocs?: (shelterId: string, docName: string) => Promise<void>;
  onAddDog?: (dog: Omit<SponsoredDog, 'id'>) => Promise<void>;
}

export const ShelterDashboard: React.FC<ShelterDashboardProps> = ({
  shelter,
  dogs,
  gifts,
  onUploadProof,
  onRegisterShelterDocs,
  onAddDog,
}) => {
  const [activeTab, setActiveTab] = useState<'proof' | 'dogs' | 'docs'>('proof');

  // Proof form state
  const [proofTitle, setProofTitle] = useState('');
  const [proofMeals, setProofMeals] = useState(25);
  const [proofDescription, setProofDescription] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofFileError, setProofFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [proofSuccessMsg, setProofSuccessMsg] = useState('');

  // Shelter Document registration state
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docError, setDocError] = useState('');
  const [docSuccessMsg, setDocSuccessMsg] = useState('');

  const handleProofFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProofFileError('');
    // Use security validator for magic bytes, size < 5MB, and allowed MIME types
    const validation = await validateFileUpload(file, ['image/jpeg', 'image/png'], 5 * 1024 * 1024);
    if (!validation.valid) {
      setProofFileError(validation.error || 'Invalid image file.');
      setProofFile(null);
      return;
    }

    setProofFile(file);
  };

  const handleDocFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocError('');
    const validation = await validateFileUpload(
      file,
      ['image/jpeg', 'image/png', 'application/pdf'],
      5 * 1024 * 1024
    );
    if (!validation.valid) {
      setDocError(validation.error || 'Invalid document file.');
      setDocFile(null);
      return;
    }
    setDocFile(file);
  };

  const handleUploadProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle.trim() || !proofDescription.trim()) return;

    setIsUploading(true);
    try {
      // In browser mock, generate object URL or sample proof url
      const samplePhotoUrl = proofFile
        ? URL.createObjectURL(proofFile)
        : 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&auto=format&fit=crop&q=80';

      await onUploadProof(shelter.id, {
        shelterId: shelter.id,
        title: proofTitle.trim(),
        description: proofDescription.trim(),
        mealCountFunded: Number(proofMeals),
        photoUrl: samplePhotoUrl,
      });

      setProofSuccessMsg('Photo proof successfully uploaded and published to donor tracking timelines!');
      setProofTitle('');
      setProofDescription('');
      setProofFile(null);
      setTimeout(() => setProofSuccessMsg(''), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) return;

    if (onRegisterShelterDocs) {
      await onRegisterShelterDocs(shelter.id, docFile.name);
    }
    setDocSuccessMsg(`Document "${docFile.name}" submitted for verification.`);
    setDocFile(null);
    setTimeout(() => setDocSuccessMsg(''), 5000);
  };

  const shelterDogs = dogs.filter(d => d.shelterId === shelter.id);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Shelter Header */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-8 shadow-paw-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={shelter.avatarUrl}
              alt={shelter.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#B0285F] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#7E1B43] font-heading">
                  {shelter.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 bg-[#EAF5EF] text-[#3F7A59] font-bold rounded-full">
                  Portal Active
                </span>
              </div>
              <p className="text-xs text-[#8A6B79]">
                {shelter.address}, {shelter.city} • Masked Payouts: {shelter.bankDetailsMasked}
              </p>
            </div>
          </div>

          <div className="bg-[#FFF8F6] border border-[#F4A8C3] px-4 py-2.5 rounded-2xl text-right">
            <span className="text-xs text-[#8A6B79] block">Total Meals Funded</span>
            <span className="text-lg font-extrabold text-[#7E1B43] font-heading">
              {shelter.mealsFundedTotal} bowls
            </span>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#F4A8C3]/40 pb-2">
        <button
          onClick={() => setActiveTab('proof')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'proof'
              ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
              : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
          }`}
        >
          <Clock size={14} />
          <span>Proof Upload & 48h Deadline</span>
        </button>

        <button
          onClick={() => setActiveTab('dogs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'dogs'
              ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
              : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
          }`}
        >
          <Dog size={14} />
          <span>Dogs & Residents ({shelterDogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'docs'
              ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
              : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
          }`}
        >
          <FileText size={14} />
          <span>80G Trust Registration Docs</span>
        </button>
      </div>

      {/* TAB 1: PROOF UPLOAD */}
      {activeTab === 'proof' && (
        <div className="space-y-6">
          {/* 48-Hour Deadline Alert Banner */}
          <div className="p-4 bg-[#FEF5EA] border border-[#F6DFBE] rounded-3xl flex items-center justify-between text-xs text-[#B86B1E]">
            <div className="flex items-center gap-3">
              <Clock size={20} className="shrink-0" />
              <div>
                <strong className="block text-sm font-bold">48-Hour Proof Window Enforced</strong>
                <span>
                  Please upload clear photographs of dogs eating from lunch bowls. Donors receive these proofs directly on their order-tracking timeline.
                </span>
              </div>
            </div>
            <span className="font-mono font-bold bg-[#FFF8F6] px-3 py-1.5 rounded-xl border border-[#F6DFBE]">
              Target: &lt; 48h
            </span>
          </div>

          {proofSuccessMsg && (
            <div className="p-4 bg-[#EAF5EF] border border-[#C1E3CE] text-[#3F7A59] rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{proofSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Form */}
            <form
              onSubmit={handleUploadProofSubmit}
              className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm space-y-4"
            >
              <h2 className="text-base font-bold text-[#7E1B43] font-heading flex items-center gap-1.5">
                <Upload size={16} />
                <span>Upload New Feeding Photo Proof</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">Proof Activity Title:</label>
                <input
                  type="text"
                  required
                  value={proofTitle}
                  onChange={e => setProofTitle(e.target.value)}
                  placeholder="e.g. Afternoon Porridge & Boiled Eggs in Ward 2"
                  className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">
                  Number of Meals Distributed:
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={proofMeals}
                  onChange={e => setProofMeals(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">Description & Notes:</label>
                <textarea
                  required
                  rows={3}
                  value={proofDescription}
                  onChange={e => setProofDescription(e.target.value)}
                  placeholder="Mention dog names who ate, ward condition, or gratitude to donor honoree..."
                  className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">
                  Photo / Video Proof (JPG/PNG, &lt; 5MB, Magic Bytes Validated):
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleProofFileChange}
                  className="w-full text-xs text-[#8A6B79] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FDEBF0] file:text-[#7E1B43] hover:file:bg-[#F4A8C3]/50 cursor-pointer"
                />
                {proofFileError && (
                  <p className="text-xs text-[#A82944] mt-1 font-medium">{proofFileError}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="w-full py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-2xl hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <CheckCircle2 size={14} />
                <span>{isUploading ? 'Validating & Uploading...' : 'Publish Proof to Donors'}</span>
              </button>
            </form>

            {/* Existing Proof Gallery */}
            <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm space-y-4">
              <h2 className="text-base font-bold text-[#7E1B43] font-heading">
                Recently Published Proofs ({shelter.proofHistory.length})
              </h2>

              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {shelter.proofHistory.map(p => (
                  <div
                    key={p.id}
                    className="p-3 bg-[#FDEBF0]/40 border border-[#F4A8C3]/50 rounded-2xl flex gap-3"
                  >
                    <img
                      src={p.photoUrl}
                      alt={p.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#8A6B79]">
                        <span className="text-[#3F7A59] font-bold">✓ {p.mealCountFunded} bowls</span>
                        <span>{new Date(p.timestamp).toLocaleDateString('en-IN')}</span>
                      </div>
                      <h3 className="text-xs font-bold text-[#3A2530] mt-0.5">{p.title}</h3>
                      <p className="text-xs text-[#8A6B79] line-clamp-2 mt-0.5">{p.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOGS MANAGEMENT */}
      {activeTab === 'dogs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#7E1B43] font-heading">
              Resident Dogs & Adoption Candidates
            </h2>
            <span className="text-xs text-[#8A6B79]">
              {shelterDogs.length} registered under {shelter.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shelterDogs.map(d => (
              <div
                key={d.id}
                className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-2xl p-4 shadow-paw-sm flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={d.photoUrl}
                    alt={d.name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-[#3A2530] font-heading">{d.name}</h3>
                    <span className="text-xs text-[#8A6B79]">{d.breed} • {d.ageYears} yrs</span>
                  </div>
                </div>

                <p className="text-xs text-[#8A6B79] line-clamp-2 my-2">{d.story}</p>

                <div className="pt-2 border-t border-[#F4A8C3]/30 flex items-center justify-between text-xs">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] text-white font-bold"
                    style={{ backgroundColor: d.collarColor }}
                  >
                    Collar Tag
                  </span>
                  <span className={d.isSponsored ? 'text-[#3F7A59] font-bold' : 'text-[#B86B1E]'}>
                    {d.isSponsored ? 'Sponsored' : 'Open'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DOCUMENTS & VERIFICATION */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          {docSuccessMsg && (
            <div className="p-4 bg-[#EAF5EF] border border-[#C1E3CE] text-[#3F7A59] rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{docSuccessMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form
              onSubmit={handleDocSubmit}
              className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm space-y-4"
            >
              <h2 className="text-base font-bold text-[#7E1B43] font-heading flex items-center gap-1.5">
                <FileText size={16} />
                <span>Upload Official Shelter Certification</span>
              </h2>
              <p className="text-xs text-[#8A6B79]">
                Provide 80G tax exemption, AWBI recognition, or Public Charity Trust deed for admin verification.
              </p>

              <div>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  onChange={handleDocFileChange}
                  className="w-full text-xs text-[#8A6B79] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FDEBF0] file:text-[#7E1B43] hover:file:bg-[#F4A8C3]/50 cursor-pointer"
                />
                {docError && <p className="text-xs text-[#A82944] mt-1 font-medium">{docError}</p>}
              </div>

              <button
                type="submit"
                disabled={!docFile}
                className="w-full py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-2xl hover:bg-[#7E1B43] disabled:opacity-50"
              >
                Submit Document for Review
              </button>
            </form>

            <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm space-y-3">
              <h2 className="text-base font-bold text-[#7E1B43] font-heading">
                Current Registered Documents
              </h2>
              {shelter.documents.map(doc => (
                <div
                  key={doc.id}
                  className="p-3 bg-[#FDEBF0]/40 border border-[#F4A8C3]/50 rounded-2xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-[#B0285F]" />
                    <span className="font-bold text-[#3A2530]">{doc.name}</span>
                  </div>
                  <span className="text-[#3F7A59] font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
