import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Heart, Utensils, ShieldPlus, Award, Moon } from 'lucide-react';
import type { Gift, Shelter } from '../../../domain/types';
import { formatINR } from '../../../domain/types';
import { GIFTS_CATALOG } from '../../../config/gifts';

interface GiftCatalogViewProps {
  shelters: Shelter[];
  onSelectGiftForCheckout: (gift: Gift, shelter?: Shelter) => void;
}

export const GiftCatalogView: React.FC<GiftCatalogViewProps> = ({
  shelters,
  onSelectGiftForCheckout,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedShelterId, setSelectedShelterId] = useState<string>('any');

  const categories = [
    { id: 'all', label: 'All 20 Gifts', icon: ShoppingBag },
    { id: 'meal', label: 'Warm Meals', icon: Utensils },
    { id: 'medical', label: 'Vaccines & Medical', icon: ShieldPlus },
    { id: 'sponsorship', label: 'Dog Sponsorship', icon: Award },
    { id: 'comfort', label: 'Beds & Comfort', icon: Moon },
  ];

  const filteredGifts = GIFTS_CATALOG.filter(g => {
    if (activeCategory !== 'all' && g.category !== activeCategory) return false;
    return true;
  });

  const targetShelter = shelters.find(s => s.id === selectedShelterId);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#FDEBF0] to-[#FFF8F6] border border-[#F4A8C3]/50 rounded-3xl p-6 sm:p-8 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Sparkles size={14} />
            <span>Doorstep Food-Delivery Style Giving</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Gifts that Fill Bowls & Save Lives
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            Select an item below. We procure the exact supplies for verified shelters, verify the bowls distributed, and share timestamped photo proof within 48 hours.
          </p>
        </div>
      </section>

      {/* Filter and Shelter Destination Selector */}
      <div className="bg-[#FFF8F6] p-4 sm:p-5 rounded-3xl border border-[#F4A8C3]/50 shadow-paw-sm flex flex-wrap items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                    : 'bg-[#FDEBF0]/70 text-[#3A2530] hover:bg-[#FDEBF0]'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Shelter Destination Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-[#7E1B43]">Deliver to:</span>
          <select
            value={selectedShelterId}
            onChange={e => setSelectedShelterId(e.target.value)}
            className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-xl px-3 py-1.5 text-xs text-[#3A2530] font-medium focus:outline-none focus:border-[#B0285F]"
          >
            <option value="any">Any Most Urgent Shelter</option>
            {shelters.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Gifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map(gift => (
          <article
            key={gift.id}
            className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-5 shadow-paw-sm hover:shadow-paw-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Tag & Price Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 bg-[#FDEBF0] text-[#7E1B43] rounded-full text-[11px] font-bold">
                  {gift.urgencyTag || gift.unitLabel}
                </span>
                <span className="text-lg font-extrabold text-[#7E1B43] font-heading">
                  {formatINR(gift.amountInPaise)}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#3A2530] font-heading mb-1.5 leading-snug">
                {gift.title}
              </h2>
              <p className="text-xs text-[#8A6B79] leading-relaxed mb-4">
                {gift.description}
              </p>
            </div>

            {/* Impact details & Action */}
            <div className="pt-3 border-t border-[#F4A8C3]/40 space-y-3">
              <div className="bg-[#FDEBF0]/50 p-2.5 rounded-xl text-[11px] text-[#7E1B43] flex items-center gap-2">
                <Heart size={13} className="text-[#B0285F] shrink-0" />
                <span>Impact: {gift.impactDescription}</span>
              </div>

              <button
                onClick={() => onSelectGiftForCheckout(gift, targetShelter)}
                className="w-full py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-2xl hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center justify-center gap-1.5"
              >
                <Heart size={14} fill="currentColor" />
                <span>Gift & Dedicate ({formatINR(gift.amountInPaise)})</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
