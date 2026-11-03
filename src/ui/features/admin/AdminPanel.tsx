import React, { useState } from 'react';
import { Shield, Check, X, AlertTriangle, Users, TrendingUp, FileText, Ban, Trash2, RotateCw } from 'lucide-react';
import type {
  Shelter,
  AdminRole,
  AdminAuditLog,
  ContentModerationItem,
  User,
  ShelterStatus,
} from '../../../domain/types';
import { formatINR } from '../../../domain/types';
import { ADMIN_ROLE_CAPABILITIES } from '../../../config/roles';

interface AdminPanelProps {
  currentUser: User;
  shelters: Shelter[];
  pendingModeration: ContentModerationItem[];
  auditLogs: AdminAuditLog[];
  onUpdateShelterStatus: (shelterId: string, status: ShelterStatus, reason?: string) => Promise<void>;
  onReviewModerationItem: (itemId: string, status: 'approved' | 'rejected', reason?: string) => Promise<void>;
  onSwitchAdminRole: (role: AdminRole) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  shelters,
  pendingModeration,
  auditLogs,
  onUpdateShelterStatus,
  onReviewModerationItem,
  onSwitchAdminRole,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'shelters' | 'moderation' | 'audit'>('analytics');
  const currentRole = currentUser.adminRole || 'Super Admin';
  const capabilities = ADMIN_ROLE_CAPABILITIES[currentRole];

  // Analytics aggregations
  const totalRaisedPaise = shelters.reduce((acc, s) => acc + s.mealsFundedTotal * 5000, 48500000);
  const totalMealsFunded = shelters.reduce((acc, s) => acc + s.mealsFundedTotal, 0);
  const activeSheltersCount = shelters.filter(s => s.status === 'active').length;
  const repeatDonorsCount = 684;
  const membershipCount = 215;

  const topCities = [
    { city: 'Bengaluru', count: '42%' },
    { city: 'Mumbai', count: '28%' },
    { city: 'Delhi-NCR', count: '18%' },
    { city: 'Pune', count: '12%' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Admin Top Header & Role Switcher */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-8 shadow-paw-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={18} className="text-[#B0285F]" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#7E1B43] font-heading">
                Pawfect Administrative Control Center
              </h1>
            </div>
            <p className="text-xs text-[#8A6B79]">
              Signed in as: <strong className="text-[#3A2530]">{currentUser.name}</strong> • Role: <strong className="text-[#B0285F]">{currentRole}</strong>
            </p>
          </div>

          {/* Role switcher for testing capabilities */}
          <div className="flex items-center gap-2 bg-[#FFF8F6] p-1.5 rounded-2xl border border-[#F4A8C3]">
            <span className="text-[11px] font-bold text-[#7E1B43] ml-2">Switch Admin Role:</span>
            {(['Super Admin', 'Verification', 'Support', 'Finance'] as AdminRole[]).map(r => (
              <button
                key={r}
                onClick={() => onSwitchAdminRole(r)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  currentRole === r
                    ? 'bg-[#B0285F] text-[#FFF8F6] shadow-xs'
                    : 'text-[#8A6B79] hover:bg-[#FDEBF0]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#F4A8C3]/40 pb-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
              : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
          }`}
        >
          <TrendingUp size={14} />
          <span>Analytics & Metrics</span>
        </button>

        <button
          onClick={() => setActiveTab('shelters')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'shelters'
              ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
              : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
          }`}
        >
          <Shield size={14} />
          <span>Shelter Verification ({shelters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'moderation'
              ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
              : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
          }`}
        >
          <AlertTriangle size={14} />
          <span>Content Moderation Queue ({pendingModeration.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
              : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
          }`}
        >
          <FileText size={14} />
          <span>Security Audit Logs</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-5 rounded-3xl shadow-paw-sm">
              <span className="text-xs text-[#8A6B79] block">Total Raised Across India</span>
              <span className="text-2xl font-extrabold text-[#7E1B43] font-heading mt-1 block">
                {formatINR(totalRaisedPaise)}
              </span>
              <span className="text-[11px] text-[#3F7A59] font-semibold">100% Disbursed to Pantries</span>
            </div>

            <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-5 rounded-3xl shadow-paw-sm">
              <span className="text-xs text-[#8A6B79] block">Shelter Meals Delivered</span>
              <span className="text-2xl font-extrabold text-[#7E1B43] font-heading mt-1 block">
                {totalMealsFunded.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-[#8A6B79]">With Photo Proof Logged</span>
            </div>

            <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-5 rounded-3xl shadow-paw-sm">
              <span className="text-xs text-[#8A6B79] block">Active Verified Shelters</span>
              <span className="text-2xl font-extrabold text-[#7E1B43] font-heading mt-1 block">
                {activeSheltersCount} Sanctuaries
              </span>
              <span className="text-[11px] text-[#8A6B79]">Across 4 Metros</span>
            </div>

            <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-5 rounded-3xl shadow-paw-sm">
              <span className="text-xs text-[#8A6B79] block">Giving Memberships</span>
              <span className="text-2xl font-extrabold text-[#7E1B43] font-heading mt-1 block">
                {membershipCount} Members
              </span>
              <span className="text-[11px] text-[#3F7A59] font-semibold">{repeatDonorsCount} Repeat Donors</span>
            </div>
          </div>

          {/* Top Cities Distribution */}
          <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 p-6 rounded-3xl shadow-paw-sm space-y-4">
            <h2 className="text-sm font-bold text-[#7E1B43] uppercase tracking-wider">
              Top Giving Cities in India
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {topCities.map(tc => (
                <div key={tc.city} className="p-4 bg-[#FDEBF0]/50 rounded-2xl border border-[#F4A8C3]/40">
                  <span className="text-xs font-bold text-[#3A2530] block">{tc.city}</span>
                  <span className="text-lg font-extrabold text-[#7E1B43] font-heading block mt-1">
                    {tc.count}
                  </span>
                  <span className="text-[11px] text-[#8A6B79]">Volume Share</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SHELTER APPROVAL / SUSPENSION */}
      {activeTab === 'shelters' && (
        <div className="space-y-4">
          <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl overflow-hidden shadow-paw-sm">
            <div className="p-4 sm:p-5 border-b border-[#F4A8C3]/30 flex justify-between items-center text-xs text-[#8A6B79] font-bold">
              <span>SHELTER NAME & CITY</span>
              <span>STATUS & ACTIONS</span>
            </div>

            <div className="divide-y divide-[#F4A8C3]/20">
              {shelters.map(shelter => (
                <div key={shelter.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#3A2530] font-heading">{shelter.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          shelter.status === 'active'
                            ? 'bg-[#EAF5EF] text-[#3F7A59]'
                            : shelter.status === 'pending'
                            ? 'bg-[#FEF5EA] text-[#B86B1E]'
                            : shelter.status === 'suspended'
                            ? 'bg-[#FDF0F2] text-[#A82944]'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {shelter.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#8A6B79] mt-0.5">
                      {shelter.city} • {shelter.dogCount} dogs • Meals Funded: {shelter.mealsFundedTotal}
                    </p>
                  </div>

                  {/* Actions based on capabilities */}
                  <div className="flex items-center gap-2">
                    {shelter.status === 'pending' && capabilities.canApproveShelters && (
                      <button
                        onClick={() => onUpdateShelterStatus(shelter.id, 'active', 'Admin approved legal documents')}
                        className="px-3 py-1.5 bg-[#3F7A59] text-[#FFF8F6] rounded-xl text-xs font-bold hover:bg-[#2C573F]"
                      >
                        Approve
                      </button>
                    )}

                    {shelter.status === 'active' && capabilities.canSuspendShelters && (
                      <button
                        onClick={() => onUpdateShelterStatus(shelter.id, 'suspended', 'Audit review flag')}
                        className="px-3 py-1.5 bg-[#FEF5EA] border border-[#F6DFBE] text-[#B86B1E] rounded-xl text-xs font-bold hover:bg-[#F6DFBE]"
                      >
                        Suspend
                      </button>
                    )}

                    {shelter.status === 'suspended' && capabilities.canApproveShelters && (
                      <button
                        onClick={() => onUpdateShelterStatus(shelter.id, 'active', 'Resolved compliance inquiry')}
                        className="px-3 py-1.5 bg-[#EAF5EF] border border-[#C1E3CE] text-[#3F7A59] rounded-xl text-xs font-bold"
                      >
                        Re-instate
                      </button>
                    )}

                    {/* Soft Delete */}
                    {shelter.status !== 'removed' && capabilities.canSuspendShelters && (
                      <button
                        onClick={() => onUpdateShelterStatus(shelter.id, 'removed', 'Soft delete by admin')}
                        className="p-1.5 text-[#8A6B79] hover:text-[#A82944] rounded-lg hover:bg-[#FDF0F2]"
                        title="Soft delete shelter (mark removed)"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="space-y-4">
          <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm space-y-4">
            <h2 className="text-base font-bold text-[#7E1B43] font-heading">
              Pending Content Moderation Queue
            </h2>
            <p className="text-xs text-[#8A6B79]">
              Reviews dog names, dedication messages, and service comments before public listing.
            </p>

            {pendingModeration.length === 0 ? (
              <div className="text-center py-8 bg-[#FDEBF0]/40 rounded-2xl text-xs text-[#3F7A59] font-bold">
                ✓ Queue clear! All names and dedications reviewed.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingModeration.map(item => (
                  <div
                    key={item.id}
                    className="p-4 bg-[#FDEBF0]/50 border border-[#F4A8C3]/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#FFF8F6] text-[#7E1B43] rounded-md">
                        {item.type.replace('_', ' ')}
                      </span>
                      <p className="text-xs font-bold text-[#3A2530] mt-1.5">"{item.content}"</p>
                      <span className="text-[11px] text-[#8A6B79]">
                        Submitted by: {item.submittedBy} • {new Date(item.submittedAt).toLocaleTimeString('en-IN')}
                      </span>
                      {item.rejectionReason && (
                        <p className="text-[11px] text-[#B86B1E] mt-1 font-semibold">
                          ⚠️ Rule Flag: {item.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => onReviewModerationItem(item.id, 'approved')}
                        className="px-3.5 py-1.5 bg-[#3F7A59] text-[#FFF8F6] rounded-xl text-xs font-bold hover:bg-[#2C573F]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReviewModerationItem(item.id, 'rejected', 'Inappropriate phrasing')}
                        className="px-3.5 py-1.5 bg-[#A82944] text-[#FFF8F6] rounded-xl text-xs font-bold hover:bg-[#851E33]"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm space-y-4">
            <h2 className="text-base font-bold text-[#7E1B43] font-heading flex items-center gap-2">
              <Shield size={18} className="text-[#3F7A59]" />
              <span>Immutable Administrative Audit Trail</span>
            </h2>
            <p className="text-xs text-[#8A6B79]">
              Every administrative login, shelter status change, and moderation verdict is logged with cryptographic timestamps.
            </p>

            <div className="divide-y divide-[#F4A8C3]/30 max-h-[500px] overflow-y-auto">
              {auditLogs.map(log => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#7E1B43] font-mono">{log.action}</span>
                      <span className="px-1.5 py-0.2 bg-[#FDEBF0] text-[#7E1B43] rounded text-[10px] font-bold">
                        {log.adminRole}
                      </span>
                    </div>
                    <p className="text-[#3A2530] mt-0.5">{log.details}</p>
                    <span className="text-[11px] text-[#8A6B79]">Admin: {log.adminEmail}</span>
                  </div>
                  <span className="text-[11px] text-[#8A6B79] font-mono whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
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
