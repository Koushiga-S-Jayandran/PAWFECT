import React, { useState } from 'react';
import { Tag, Sparkles, Heart, Check, AlertCircle } from 'lucide-react';
import type { SponsoredDog, User } from '../../../domain/types';
import { COLLAR_COLORS } from '../../../config/roles';
import { ModerationService } from '../../../services/moderation-service';
import { BowCat } from '../../mascots/BowCat';

interface NameADogViewProps {
  dogs: SponsoredDog[];
  currentUser: User;
  moderationService: ModerationService;
  onNameDog: (dogId: string, name: string, collarColor: string, donorName: string) => Promise<void>;
}

export const NameADogView: React.FC<NameADogViewProps> = ({
  dogs,
  currentUser,
  moderationService,
  onNameDog,
}) => {
  const [selectedDog, setSelectedDog] = useState<SponsoredDog | null>(null);
  const [proposedName, setProposedName] = useState('');
  const [selectedCollar, setSelectedCollar] = useState(COLLAR_COLORS[0].hex);
  const [moderationError, setModerationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleOpenNameModal = (dog: SponsoredDog) => {
    setSelectedDog(dog);
    setProposedName(dog.name);
    setSelectedCollar(dog.collarColor || COLLAR_COLORS[0].hex);
    setModerationError('');
  };

  const handleSubmitNaming = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDog || !proposedName.trim()) return;

    // Run moderation rules check
    const evalResult = moderationService.evaluateContent(proposedName);
    if (!evalResult.autoApproved) {
      setModerationError(
        evalResult.reason || 'This name contains terms that cannot be approved.'
      );
      return;
    }

    setIsSubmitting(true);
    setModerationError('');
    try {
      await onNameDog(selectedDog.id, proposedName.trim(), selectedCollar, currentUser.name);
      setSuccessMsg(`Congratulations! ${proposedName} is now sponsored with a fresh collar.`);
      setSelectedDog(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-10 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Tag size={14} />
            <span>Sponsorship & Identity</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Name a Shelter Pup & Pick Their Collar
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            Many rescued street pups arrive at shelters unnamed. Bestow an identity upon a rescue, pick their vibrant collar colour, and support their monthly boarding.
          </p>
        </div>
      </section>

      {successMsg && (
        <div className="p-4 bg-[#EAF5EF] border border-[#C1E3CE] text-[#3F7A59] rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Dogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dogs.map(dog => (
          <article
            key={dog.id}
            className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl overflow-hidden shadow-paw-sm hover:shadow-paw-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Photo & Collar Preview */}
              <div className="relative h-52 w-full overflow-hidden bg-[#FDEBF0]">
                <img
                  src={dog.photoUrl}
                  alt={dog.name}
                  className="w-full h-full object-cover"
                />

                {/* Collar Color Tag */}
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-[#FFF8F6] shadow-sm flex items-center gap-1.5 border border-white/40"
                  style={{ backgroundColor: dog.collarColor }}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Collar Tag</span>
                </div>

                {dog.isSponsored ? (
                  <div className="absolute bottom-3 right-3 bg-[#EAF5EF]/95 backdrop-blur-xs text-[#3F7A59] px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#C1E3CE]">
                    ✓ Sponsored by {dog.namedByDonorName || 'Guardian'}
                  </div>
                ) : (
                  <div className="absolute bottom-3 right-3 bg-[#FEF5EA]/95 backdrop-blur-xs text-[#B86B1E] px-2.5 py-1 rounded-full text-[11px] font-bold border border-[#F6DFBE]">
                    Needs Sponsor
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-lg font-bold text-[#3A2530] font-heading">{dog.name}</h2>
                  <span className="text-xs text-[#8A6B79]">
                    {dog.ageYears} yrs • {dog.breed}
                  </span>
                </div>

                <span className="text-xs text-[#7E1B43] font-semibold block mb-2">
                  Sanctuary: {dog.shelterName}
                </span>

                <p className="text-xs text-[#8A6B79] leading-relaxed mb-4">
                  {dog.story}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => handleOpenNameModal(dog)}
                className="w-full py-2.5 bg-[#B0285F] text-[#FFF8F6] rounded-2xl text-xs font-bold hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center justify-center gap-1.5"
              >
                <Tag size={13} />
                <span>{dog.isSponsored ? 'Update Name / Collar' : 'Name & Pick Collar'}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Naming Modal */}
      {selectedDog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs">
          <form
            onSubmit={handleSubmitNaming}
            className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 w-full max-w-md shadow-paw-lg space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-[#7E1B43] font-heading">
                  Name {selectedDog.name}
                </h3>
                <span className="text-xs text-[#8A6B79]">Shelter: {selectedDog.shelterName}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDog(null)}
                className="text-[#8A6B79] hover:text-[#3A2530]"
              >
                ✕
              </button>
            </div>

            {moderationError && (
              <div className="p-3 bg-[#FDF0F2] border border-[#F6C2CB] text-[#A82944] text-xs rounded-xl flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{moderationError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">
                Choose a Meaningful Dog Name:
              </label>
              <input
                type="text"
                required
                maxLength={30}
                value={proposedName}
                onChange={e => setProposedName(e.target.value)}
                placeholder="e.g. Moti, Badal, Gulab, Sheru, Rani"
                className="w-full px-3.5 py-2.5 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] font-semibold focus:outline-none focus:border-[#B0285F]"
              />
              <span className="text-[10px] text-[#8A6B79] mt-0.5 block">
                Names undergo respectful moderation check before public registration.
              </span>
            </div>

            {/* Collar Palette Picker */}
            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-2">
                Select Collar Colour:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {COLLAR_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCollar(c.hex)}
                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      selectedCollar === c.hex
                        ? 'border-[#7E1B43] ring-2 ring-[#B0285F]/30 bg-[#FDEBF0]'
                        : 'border-[#F4A8C3]/50 hover:bg-[#FDEBF0]/40'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[10px] font-medium text-[#3A2530] truncate w-full text-center">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div className="p-3 bg-[#FDEBF0]/60 rounded-2xl border border-[#F4A8C3]/50 flex items-center justify-between text-xs">
              <span className="text-[#8A6B79]">Collar Badge Preview:</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: selectedCollar }}
              >
                🐾 {proposedName || 'Name'}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDog(null)}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] disabled:opacity-50"
              >
                {isSubmitting ? 'Validating...' : 'Confirm Name & Collar'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
