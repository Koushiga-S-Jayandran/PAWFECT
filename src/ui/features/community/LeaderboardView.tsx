import React, { useState, useEffect } from 'react';
import { Award, Flame, Utensils, MapPin, EyeOff, Shield } from 'lucide-react';
import type { LeaderboardEntry, User } from '../../../domain/types';
import type { CommunityRepository } from '../../../domain/interfaces';

interface LeaderboardViewProps {
  communityRepo: CommunityRepository;
  currentUser: User;
  onToggleOptOut: () => Promise<void>;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  communityRepo,
  currentUser,
  onToggleOptOut,
}) => {
  const [metric, setMetric] = useState<'meals' | 'streak' | 'city'>('meals');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    communityRepo.getLeaderboard(metric).then(data => {
      if (isMounted) {
        setEntries(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [communityRepo, metric]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-10 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Award size={14} />
            <span>Community Honor Roll</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Compassion Rankings
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            Celebrating donors and families feeding street and shelter animals across Indian cities. You can toggle anonymous display anytime.
          </p>
        </div>
      </section>

      {/* Metrics Switcher & Opt-Out bar */}
      <div className="bg-[#FFF8F6] p-4 sm:p-5 rounded-3xl border border-[#F4A8C3]/50 shadow-paw-sm flex flex-wrap items-center justify-between gap-4">
        {/* Metric Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setMetric('meals')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              metric === 'meals'
                ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
            }`}
          >
            <Utensils size={14} />
            <span>Meals Given</span>
          </button>

          <button
            onClick={() => setMetric('streak')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              metric === 'streak'
                ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
            }`}
          >
            <Flame size={14} />
            <span>Active Streak</span>
          </button>

          <button
            onClick={() => setMetric('city')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
              metric === 'city'
                ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
            }`}
          >
            <MapPin size={14} />
            <span>By City</span>
          </button>
        </div>

        {/* User's Privacy Status Button */}
        <button
          onClick={onToggleOptOut}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F6] border border-[#E27AA1] rounded-full text-xs text-[#7E1B43] font-semibold hover:bg-[#FDEBF0]"
        >
          <EyeOff size={13} className="text-[#B0285F]" />
          <span>
            {currentUser.optedOutFromLeaderboard
              ? 'Status: Anonymous'
              : 'Status: Public Name Shown'}
          </span>
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl overflow-hidden shadow-paw-sm">
        <div className="p-4 sm:p-6 border-b border-[#F4A8C3]/30 flex items-center justify-between text-xs text-[#8A6B79] font-bold">
          <span>RANK & DONOR</span>
          <div className="flex gap-6 sm:gap-12">
            <span>CITY</span>
            <span>MEALS FUNDED</span>
            <span>STREAK</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-xs text-[#8A6B79]">
            Loading verified community rankings...
          </div>
        ) : (
          <div className="divide-y divide-[#F4A8C3]/20">
            {entries.map(entry => {
              const isCurrentUser = entry.userId === currentUser.id;
              const isTopThree = entry.rank <= 3;

              return (
                <div
                  key={`${entry.userId}-${entry.rank}`}
                  className={`p-4 sm:p-5 flex items-center justify-between transition-colors ${
                    isCurrentUser ? 'bg-[#FDEBF0]/70 font-semibold' : 'hover:bg-[#FDEBF0]/30'
                  }`}
                >
                  {/* Rank and Name */}
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        entry.rank === 1
                          ? 'bg-[#E6A23C] text-white shadow-xs'
                          : entry.rank === 2
                          ? 'bg-[#8A6B79] text-white'
                          : entry.rank === 3
                          ? 'bg-[#C2593F] text-white'
                          : 'bg-[#FDEBF0] text-[#7E1B43]'
                      }`}
                    >
                      {entry.rank}
                    </span>

                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#3A2530] flex items-center gap-1.5">
                        <span>
                          {entry.isAnonymous ? 'Anonymous Kind Soul' : entry.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] bg-[#B0285F] text-[#FFF8F6] px-1.5 py-0.2 rounded-full">
                            You
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 sm:gap-12 text-xs text-right">
                    <span className="text-[#8A6B79] w-20 text-center">{entry.city}</span>
                    <span className="font-extrabold text-[#7E1B43] w-24">
                      {entry.mealsGiven} bowls
                    </span>
                    <span className="font-bold text-[#B86B1E] w-14 flex items-center justify-end gap-1">
                      <Flame size={12} />
                      {entry.streakDays}d
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
