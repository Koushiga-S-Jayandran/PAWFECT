import React, { useState, useMemo } from 'react';
import { Search, MapPin, Heart, Shield, Sparkles, Filter, AlertCircle } from 'lucide-react';
import type { Shelter, AnimalType, UrgencyLevel, Gift } from '../../../domain/types';
import { Badge } from '../../components/Badge';
import { BowCat } from '../../mascots/BowCat';

interface ShelterBrowserProps {
  shelters: Shelter[];
  onSelectShelter: (shelter: Shelter) => void;
  onQuickGift: (shelter: Shelter) => void;
}

export const ShelterBrowser: React.FC<ShelterBrowserProps> = ({
  shelters,
  onSelectShelter,
  onQuickGift,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedAnimal, setSelectedAnimal] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');

  const cities = ['all', 'Bengaluru', 'Mumbai', 'Delhi-NCR', 'Pune'];
  const animalTypes: (AnimalType | 'all')[] = [
    'all',
    'Dogs',
    'Cats',
    'Indie Dogs',
    'Large Animals',
    'Senior & Special Needs',
  ];

  const filteredShelters = useMemo(() => {
    return shelters.filter(s => {
      // Must not be removed or suspended
      if (s.status !== 'active') return false;

      // City filter
      if (selectedCity !== 'all' && s.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // Animal filter
      if (selectedAnimal !== 'all' && !s.animalTypes.includes(selectedAnimal as AnimalType)) {
        return false;
      }

      // Urgency filter
      if (selectedUrgency !== 'all' && s.urgencyLevel !== selectedUrgency) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesCity = s.city.toLowerCase().includes(q);
        const matchesStory = s.story.toLowerCase().includes(q);
        const matchesAnimal = s.animalTypes.some(a => a.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesStory && !matchesAnimal) return false;
      }

      return true;
    });
  }, [shelters, selectedCity, selectedAnimal, selectedUrgency, searchQuery]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-10 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-4">
            <Sparkles size={14} />
            <span>Direct Giving Marketplace for Indian Animal Shelters</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#7E1B43] font-heading tracking-tight leading-tight">
            Send a warm bowl to a shelter dog today.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#8A6B79] leading-relaxed">
            Browse verified shelters across India. Every rupee is photographed in action with bowls refilled and proof uploaded within 48 hours.
          </p>
        </div>

        {/* Mascot Illustration in Corner */}
        <div className="hidden md:block absolute -right-4 -bottom-6 opacity-95">
          <BowCat size={180} mood="happy" animate />
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-[#FFF8F6] p-4 sm:p-6 rounded-3xl border border-[#F4A8C3]/50 shadow-paw-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A6B79]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by shelter name, area, or city (Bengaluru, Mumbai, Delhi, Pune)..."
            className="w-full pl-11 pr-4 py-3 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-sm text-[#3A2530] placeholder-[#8A6B79] focus:outline-none focus:border-[#B0285F]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#8A6B79] hover:text-[#B0285F]"
            >
              Clear
            </button>
          )}
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#7E1B43] flex items-center gap-1 mr-1">
            <MapPin size={13} />
            <span>City:</span>
          </span>
          {cities.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                selectedCity === c
                  ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                  : 'bg-[#FDEBF0]/70 text-[#3A2530] hover:bg-[#FDEBF0]'
              }`}
            >
              {c === 'all' ? 'All Cities' : c}
            </button>
          ))}
        </div>

        {/* Animal and Urgency Dropdowns / Toggles */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F4A8C3]/30">
          <div className="flex items-center gap-2">
            <label htmlFor="animal-filter" className="text-xs font-bold text-[#8A6B79]">
              Residents:
            </label>
            <select
              id="animal-filter"
              value={selectedAnimal}
              onChange={e => setSelectedAnimal(e.target.value)}
              className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-xl px-2.5 py-1 text-xs text-[#3A2530] focus:outline-none"
            >
              {animalTypes.map(a => (
                <option key={a} value={a}>
                  {a === 'all' ? 'All Animals' : a}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="urgency-filter" className="text-xs font-bold text-[#8A6B79]">
              Urgency:
            </label>
            <select
              id="urgency-filter"
              value={selectedUrgency}
              onChange={e => setSelectedUrgency(e.target.value)}
              className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-xl px-2.5 py-1 text-xs text-[#3A2530] focus:outline-none"
            >
              <option value="all">Any Status</option>
              <option value="critical">Critical SOS Only</option>
              <option value="urgent">Urgent Need</option>
              <option value="normal">Normal Operations</option>
            </select>
          </div>

          <span className="ml-auto text-xs font-medium text-[#8A6B79]">
            Showing <strong className="text-[#7E1B43]">{filteredShelters.length}</strong> verified shelters
          </span>
        </div>
      </section>

      {/* Shelter Grid */}
      {filteredShelters.length === 0 ? (
        <div className="text-center py-16 bg-[#FDEBF0]/50 rounded-3xl border border-[#F4A8C3]/50 p-6">
          <BowCat size={96} mood="sleeping" className="mx-auto mb-3" />
          <h2 className="text-lg font-bold text-[#7E1B43] font-heading">
            No shelters matched your filter criteria
          </h2>
          <p className="text-xs text-[#8A6B79] mt-1 max-w-sm mx-auto">
            Try resetting your city or animal filter to see verified shelters in other regions.
          </p>
          <button
            onClick={() => {
              setSelectedCity('all');
              setSelectedAnimal('all');
              setSelectedUrgency('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-[#B0285F] text-[#FFF8F6] rounded-full text-xs font-semibold hover:bg-[#7E1B43]"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelters.map(shelter => (
            <article
              key={shelter.id}
              className="group bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl overflow-hidden shadow-paw-sm hover:shadow-paw-md transition-all duration-200 flex flex-col"
            >
              {/* Cover Image with Badges */}
              <div className="relative h-44 w-full overflow-hidden bg-[#FDEBF0]">
                <img
                  src={shelter.coverUrl}
                  alt={shelter.name}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge variant="verified" />
                  {shelter.urgencyLevel === 'critical' && (
                    <Badge variant="critical">SOS Critical</Badge>
                  )}
                  {shelter.urgencyLevel === 'urgent' && (
                    <Badge variant="urgent">Urgent</Badge>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 bg-[#3A2530]/85 backdrop-blur-xs text-[#FFF8F6] px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1">
                  <MapPin size={11} className="text-[#F4A8C3]" />
                  <span>{shelter.city}</span>
                </div>
              </div>

              {/* Body Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={shelter.avatarUrl}
                      alt={`${shelter.name} Avatar`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#F4A8C3] shadow-xs shrink-0"
                    />
                    <div>
                      <h2 className="text-base font-bold text-[#3A2530] font-heading group-hover:text-[#B0285F] transition-colors leading-snug">
                        {shelter.name}
                      </h2>
                      <span className="text-[11px] text-[#8A6B79]">
                        {shelter.dogCount} Dogs • {shelter.catCount} Cats
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#8A6B79] line-clamp-2 leading-relaxed mb-3">
                    {shelter.story}
                  </p>

                  {/* Animal Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {shelter.animalTypes.map(t => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-[#FDEBF0] text-[#7E1B43] rounded-md text-[10px] font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Stats & Actions */}
                <div className="pt-3 border-t border-[#F4A8C3]/30">
                  <div className="flex items-center justify-between text-xs text-[#8A6B79] mb-3">
                    <span>
                      Daily needs: <strong className="text-[#7E1B43]">{shelter.mealsNeededDaily} meals</strong>
                    </span>
                    <span className="text-[#3F7A59] font-semibold">
                      {shelter.proofHistory.length} proofs logged
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onSelectShelter(shelter)}
                      className="px-3 py-2 text-xs font-semibold text-[#7E1B43] bg-[#FDEBF0] hover:bg-[#F4A8C3]/50 rounded-xl transition-colors text-center"
                    >
                      View Proofs & Story
                    </button>
                    <button
                      onClick={() => onQuickGift(shelter)}
                      className="px-3 py-2 text-xs font-bold text-[#FFF8F6] bg-[#B0285F] hover:bg-[#7E1B43] rounded-xl transition-colors text-center shadow-xs flex items-center justify-center gap-1"
                    >
                      <Heart size={12} fill="currentColor" />
                      <span>Gift a Meal</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
