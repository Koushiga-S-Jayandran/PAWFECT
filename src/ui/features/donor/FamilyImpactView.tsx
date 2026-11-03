import React, { useState } from 'react';
import { Award, Flame, Heart, Utensils, Shield, Eye, EyeOff, Download, Sparkles } from 'lucide-react';
import type { Order, User, Shelter } from '../../../domain/types';
import { formatINR } from '../../../domain/types';
import { BowCat } from '../../mascots/BowCat';
import { CertificateView } from '../../components/CertificateView';
import { OrderTrackingTimeline } from './OrderTrackingTimeline';

interface FamilyImpactViewProps {
  currentUser: User;
  orders: Order[];
  shelters: Shelter[];
  onToggleLeaderboardOptOut: () => Promise<void>;
}

export const FamilyImpactView: React.FC<FamilyImpactViewProps> = ({
  currentUser,
  orders,
  shelters,
  onToggleLeaderboardOptOut,
}) => {
  const [selectedOrderForCert, setSelectedOrderForCert] = useState<Order | null>(null);
  const [selectedOrderForTimeline, setSelectedOrderForTimeline] = useState<Order | null>(
    orders[0] || null
  );

  const totalMeals = orders.reduce((acc, o) => {
    // 1 gift feed 20 dogs = 20 meals
    const count = o.giftTitle.match(/\d+/);
    return acc + (count ? parseInt(count[0], 10) * o.quantity : 10 * o.quantity);
  }, currentUser.totalMealsFunded);

  const uniqueShelterIds = new Set(orders.map(o => o.shelterId));
  const sheltersSupportedCount = Math.max(uniqueShelterIds.size, 2);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-10 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Sparkles size={14} />
            <span>Family Giving Portfolio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Your Family's Living Pawprint
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            Every bowl poured, every stray pup vaccinated, and every certificate dedicated in honor of your loved ones.
          </p>
        </div>
      </section>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-6 rounded-3xl shadow-paw-sm flex items-center gap-4">
          <div className="p-3.5 bg-[#FDEBF0] text-[#B0285F] rounded-2xl">
            <Utensils size={24} />
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#7E1B43] font-heading">
              {totalMeals}
            </span>
            <span className="text-xs text-[#8A6B79] font-medium">Bowls of Warm Food Funded</span>
          </div>
        </div>

        <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-6 rounded-3xl shadow-paw-sm flex items-center gap-4">
          <div className="p-3.5 bg-[#FEF5EA] text-[#B86B1E] rounded-2xl">
            <Flame size={24} />
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#B86B1E] font-heading">
              {currentUser.streakDays} Days
            </span>
            <span className="text-xs text-[#8A6B79] font-medium">Giving Habit Streak</span>
          </div>
        </div>

        <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-6 rounded-3xl shadow-paw-sm flex items-center gap-4">
          <div className="p-3.5 bg-[#EAF5EF] text-[#3F7A59] rounded-2xl">
            <Heart size={24} />
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold text-[#3F7A59] font-heading">
              {sheltersSupportedCount} Sanctuaries
            </span>
            <span className="text-xs text-[#8A6B79] font-medium">Shelters Fed & Sheltered</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Privacy Opt-Out Toggle */}
      <div className="bg-[#FFF8F6] border border-[#F4A8C3]/50 p-4 rounded-3xl shadow-paw-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#FDEBF0] text-[#7E1B43] rounded-xl">
            {currentUser.optedOutFromLeaderboard ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
          <div>
            <span className="text-xs font-bold text-[#3A2530] block">
              Public Leaderboard Display Status
            </span>
            <span className="text-[11px] text-[#8A6B79]">
              {currentUser.optedOutFromLeaderboard
                ? 'Your gifts are currently anonymous on public rankings.'
                : 'Displaying as "Ananya Deshmukh" on community meal rankings.'}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleLeaderboardOptOut}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-colors ${
            currentUser.optedOutFromLeaderboard
              ? 'bg-[#B0285F] text-[#FFF8F6]'
              : 'bg-[#FDEBF0] text-[#7E1B43] hover:bg-[#F4A8C3]/40'
          }`}
        >
          {currentUser.optedOutFromLeaderboard ? 'Make Profile Visible' : 'Opt-Out to Anonymous'}
        </button>
      </div>

      {/* Selected Order Real-time Timeline */}
      {selectedOrderForTimeline && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#7E1B43] font-heading">
              Order Real-Time Fulfillment Tracker
            </h2>
            <div className="flex gap-2">
              {orders.map(o => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrderForTimeline(o)}
                  className={`px-3 py-1 text-xs rounded-full font-bold transition-colors ${
                    selectedOrderForTimeline.id === o.id
                      ? 'bg-[#B0285F] text-[#FFF8F6]'
                      : 'bg-[#FDEBF0] text-[#7E1B43]'
                  }`}
                >
                  #{o.id}
                </button>
              ))}
            </div>
          </div>
          <OrderTrackingTimeline
            order={selectedOrderForTimeline}
            onOpenCertificate={o => setSelectedOrderForCert(o)}
          />
        </section>
      )}

      {/* Dedication Certificates Vault */}
      <section className="bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-3xl p-6 sm:p-8 shadow-paw-sm space-y-4">
        <h2 className="text-lg font-bold text-[#7E1B43] font-heading flex items-center gap-2">
          <Award size={20} className="text-[#B0285F]" />
          <span>Your Blessing Certificates Vault</span>
        </h2>
        <p className="text-xs text-[#8A6B79]">
          Click any certificate to switch themes, download as high-res PNG, or share the direct link with family.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {orders.map(ord => (
            <div
              key={ord.id}
              className="p-5 bg-[#FDEBF0]/50 border border-[#F4A8C3]/60 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#8A6B79] uppercase">
                    CERT #{ord.certificateId.toUpperCase()}
                  </span>
                  <span className="text-xs font-extrabold text-[#7E1B43]">
                    {formatINR(ord.amountInPaise)}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#3A2530] font-heading">
                  Dedicated to: {ord.dedication?.honoreeName || 'Animal Souls'}
                </h3>
                <p className="text-xs text-[#8A6B79] mt-0.5">
                  Occasion: {ord.dedication?.occasion || 'Warm Gift'} • {ord.shelterName}
                </p>
                {ord.dedication?.message && (
                  <p className="text-xs italic text-[#7E1B43] mt-2 line-clamp-2">
                    "{ord.dedication.message}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F4A8C3]/40 flex justify-between items-center">
                <span className="text-[11px] text-[#3F7A59] font-bold">
                  ✓ Verified Issued
                </span>
                <button
                  onClick={() => setSelectedOrderForCert(ord)}
                  className="px-3.5 py-1.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] shadow-xs"
                >
                  View & Download Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certificate Modal */}
      {selectedOrderForCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8">
            <button
              onClick={() => setSelectedOrderForCert(null)}
              className="absolute -top-3 -right-3 z-10 p-2 bg-[#FFF8F6] text-[#3A2530] rounded-full border border-[#F4A8C3] shadow-paw-sm hover:bg-[#FDEBF0]"
              aria-label="Close certificate"
            >
              ✕
            </button>
            <CertificateView order={selectedOrderForCert} onClose={() => setSelectedOrderForCert(null)} />
          </div>
        </div>
      )}
    </div>
  );
};
