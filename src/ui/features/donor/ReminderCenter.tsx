import React, { useState } from 'react';
import { Bell, BellOff, Calendar, Plus, Trash2, Edit2, RotateCw, Heart, Sparkles, Check, X } from 'lucide-react';
import type { FamilyMember, SpecialDate, Gift, Shelter } from '../../../domain/types';
import { DateService } from '../../../services/date-utils';
import { GIFTS_CATALOG } from '../../../config/gifts';
import { BowCat } from '../../mascots/BowCat';

interface ReminderCenterProps {
  familyMembers: FamilyMember[];
  shelters: Shelter[];
  onAddMember: (member: Omit<FamilyMember, 'id' | 'userId'>) => Promise<void>;
  onDeleteMember: (memberId: string) => Promise<void>;
  onAddSpecialDate: (memberId: string, date: Omit<SpecialDate, 'id'>) => Promise<void>;
  onToggleMuteDate: (memberId: string, dateId: string) => Promise<void>;
  onDeleteDate: (memberId: string, dateId: string) => Promise<void>;
  onOneTapReorder: (gift: Gift, shelter: Shelter, honoreeName: string, occasion: string) => void;
}

export const ReminderCenter: React.FC<ReminderCenterProps> = ({
  familyMembers,
  shelters,
  onAddMember,
  onDeleteMember,
  onAddSpecialDate,
  onToggleMuteDate,
  onDeleteDate,
  onOneTapReorder,
}) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRel, setNewMemberRel] = useState('');

  const [activeDateModalMemberId, setActiveDateModalMemberId] = useState<string | null>(null);
  const [newDateTitle, setNewDateTitle] = useState('');
  const [newDateMonth, setNewDateMonth] = useState(11);
  const [newDateDay, setNewDateDay] = useState(14);
  const [newDateType, setNewDateType] = useState<SpecialDate['type']>('birthday');

  // Compute all upcoming dates across family members, sorted by days remaining
  const upcomingDates = familyMembers.flatMap(m =>
    m.specialDates.map(d => {
      const occurrence = DateService.getNextAnnualOccurrence(d.month, d.day);
      const lastGift = GIFTS_CATALOG.find(g => g.id === d.lastGiftId) || GIFTS_CATALOG[0];
      return {
        member: m,
        specialDate: d,
        occurrence,
        lastGift,
      };
    })
  ).sort((a, b) => a.occurrence.daysRemaining - b.occurrence.daysRemaining);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    await onAddMember({
      name: newMemberName.trim(),
      relationship: newMemberRel.trim() || 'Loved One',
      specialDates: [],
    });
    setNewMemberName('');
    setNewMemberRel('');
    setShowAddMemberModal(false);
  };

  const handleCreateDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDateModalMemberId || !newDateTitle.trim()) return;
    await onAddSpecialDate(activeDateModalMemberId, {
      title: newDateTitle.trim(),
      month: Number(newDateMonth),
      day: Number(newDateDay),
      type: newDateType,
      isMuted: false,
      lastGiftId: 'gift_feed_20_dogs',
    });
    setNewDateTitle('');
    setActiveDateModalMemberId(null);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-8 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Bell size={14} />
            <span>Family Calendar & Giving Reminders</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Never Miss a Day That Matters
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            Save birthdays, anniversaries, and sacred memorials. We remind you 7 days & 1 day before so you can send a bowl of hot food to shelter pups in their name.
          </p>
        </div>
      </section>

      {/* Upcoming Reminders Ribbon */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#7E1B43] font-heading flex items-center gap-2">
            <Calendar size={18} />
            <span>Upcoming Milestones</span>
          </h2>
          <span className="text-xs text-[#8A6B79]">
            Handled with IST timezone & leap-day awareness
          </span>
        </div>

        {upcomingDates.length === 0 ? (
          <div className="text-center py-10 bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-3xl p-6 shadow-paw-sm">
            <BowCat size={72} mood="happy" className="mx-auto mb-2" />
            <h3 className="text-sm font-bold text-[#3A2530]">No special dates saved yet</h3>
            <p className="text-xs text-[#8A6B79] mt-1 max-w-sm mx-auto">
              Add your grandmother's birthday, your dog's adoption anniversary, or a quiet memorial day below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingDates.map(({ member, specialDate, occurrence, lastGift }) => {
              const isUrgent = occurrence.isUpcomingWithin7Days;
              return (
                <div
                  key={specialDate.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    specialDate.isMuted
                      ? 'bg-[#FFF8F6]/60 border-[#F4A8C3]/30 opacity-75'
                      : isUrgent
                      ? 'bg-[#FFF8F6] border-[#B0285F] shadow-paw-md ring-2 ring-[#F4A8C3]/50'
                      : 'bg-[#FFF8F6] border-[#F4A8C3]/60 shadow-paw-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        specialDate.type === 'memorial'
                          ? 'bg-[#F9F6FC] text-[#6B5280] border border-[#E0D7ED]'
                          : 'bg-[#FDEBF0] text-[#7E1B43]'
                      }`}
                    >
                      {specialDate.type.toUpperCase()}
                    </span>

                    <button
                      onClick={() => onToggleMuteDate(member.id, specialDate.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        specialDate.isMuted
                          ? 'text-[#8A6B79] hover:text-[#3A2530] bg-[#FDEBF0]'
                          : 'text-[#B0285F] hover:bg-[#FDEBF0]'
                      }`}
                      title={specialDate.isMuted ? 'Unmute alerts' : 'Mute reminders for this date'}
                    >
                      {specialDate.isMuted ? <BellOff size={14} /> : <Bell size={14} />}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[#3A2530] font-heading">{specialDate.title}</h3>
                  <p className="text-xs text-[#8A6B79]">
                    For <strong className="text-[#7E1B43]">{member.name}</strong> ({member.relationship})
                  </p>

                  <div className="my-3 p-2.5 bg-[#FDEBF0]/50 rounded-2xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#7E1B43]">
                      📅 {occurrence.formattedDisplay}
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                        isUrgent ? 'bg-[#B0285F] text-[#FFF8F6]' : 'bg-[#FFF8F6] text-[#8A6B79]'
                      }`}
                    >
                      {DateService.formatRelativeDays(occurrence.daysRemaining)}
                    </span>
                  </div>

                  {/* One-Tap Reorder Button */}
                  <div className="pt-2 border-t border-[#F4A8C3]/30">
                    <button
                      onClick={() =>
                        onOneTapReorder(lastGift, shelters[0], member.name, specialDate.title)
                      }
                      className="w-full py-2 bg-[#B0285F] text-[#FFF8F6] rounded-xl text-xs font-bold hover:bg-[#7E1B43] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <RotateCw size={13} />
                      <span>One-Tap Reorder "{lastGift.title}"</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Family Directory Management */}
      <div className="bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-3xl p-6 sm:p-8 shadow-paw-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#7E1B43] font-heading">
              Family Members & Furry Companions
            </h2>
            <p className="text-xs text-[#8A6B79]">
              Add people and pets so you can attach their names and occasions to dedication plaques.
            </p>
          </div>

          <button
            onClick={() => setShowAddMemberModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B0285F] text-[#FFF8F6] rounded-full text-xs font-bold hover:bg-[#7E1B43] shadow-paw-sm"
          >
            <Plus size={14} />
            <span>Add Family Member</span>
          </button>
        </div>

        <div className="space-y-4">
          {familyMembers.map(member => (
            <div
              key={member.id}
              className="p-4 sm:p-5 bg-[#FDEBF0]/40 border border-[#F4A8C3]/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#3A2530] font-heading">{member.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-[#FFF8F6] text-[#8A6B79] rounded-full border border-[#F4A8C3]/50">
                    {member.relationship}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {member.specialDates.map(d => (
                    <span
                      key={d.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-xl text-xs text-[#7E1B43]"
                    >
                      <span>{d.title} ({d.day}/{d.month})</span>
                      <button
                        onClick={() => onDeleteDate(member.id, d.id)}
                        className="text-[#8A6B79] hover:text-[#A82944] ml-1"
                        title="Remove date"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveDateModalMemberId(member.id)}
                  className="px-3 py-1.5 bg-[#FFF8F6] border border-[#E27AA1] text-[#7E1B43] hover:bg-[#FDEBF0] rounded-xl text-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={13} />
                  <span>Add Date</span>
                </button>
                <button
                  onClick={() => onDeleteMember(member.id)}
                  className="p-1.5 text-[#8A6B79] hover:text-[#A82944] rounded-lg hover:bg-[#FDF0F2]"
                  title="Delete member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateMember}
            className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 w-full max-w-md shadow-paw-lg space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#7E1B43] font-heading">
                Add Family Member or Pet
              </h3>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="text-[#8A6B79] hover:text-[#3A2530]"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">Name:</label>
              <input
                type="text"
                required
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                placeholder="e.g. Dadi, Bruno, Ankit"
                className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">Relationship:</label>
              <input
                type="text"
                value={newMemberRel}
                onChange={e => setNewMemberRel(e.target.value)}
                placeholder="e.g. Grandparent, Rescue Pup, Sibling"
                className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43]"
              >
                Save Member
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Special Date */}
      {activeDateModalMemberId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateDate}
            className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 w-full max-w-md shadow-paw-lg space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#7E1B43] font-heading">
                Add Special Date
              </h3>
              <button
                type="button"
                onClick={() => setActiveDateModalMemberId(null)}
                className="text-[#8A6B79] hover:text-[#3A2530]"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">Occasion Title:</label>
              <input
                type="text"
                required
                value={newDateTitle}
                onChange={e => setNewDateTitle(e.target.value)}
                placeholder="e.g. 80th Birthday, Memorial Day, Adoption Day"
                className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">Month:</label>
                <select
                  value={newDateMonth}
                  onChange={e => setNewDateMonth(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none"
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map((m, idx) => (
                    <option key={m} value={idx + 1}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">Day (1-31):</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  required
                  value={newDateDay}
                  onChange={e => setNewDateDay(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">Type:</label>
              <select
                value={newDateType}
                onChange={e => setNewDateType(e.target.value as SpecialDate['type'])}
                className="w-full px-3 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none"
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="memorial">Memorial (Rainbow Bridge)</option>
                <option value="adoption">Adoption Day</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveDateModalMemberId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43]"
              >
                Add Special Date
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
