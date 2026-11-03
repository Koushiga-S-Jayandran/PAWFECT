import React, { useState } from 'react';
import { Award, Check, Sparkles, Shield, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import type { Membership, User, BillingCycle } from '../../../domain/types';
import { formatINR } from '../../../domain/types';
import { MEMBERSHIP_PLANS, calculatePlanPrice } from '../../../config/plans.example';
import { Badge } from '../../components/Badge';
import { BowCat } from '../../mascots/BowCat';

interface MembershipViewProps {
  currentUser: User;
  activeMembership: Membership | null;
  onSubscribe: (planId: string, cycle: BillingCycle) => Promise<void>;
  onCancelAtPeriodEnd: () => Promise<void>;
  onReactivate: () => Promise<void>;
}

export const MembershipView: React.FC<MembershipViewProps> = ({
  currentUser,
  activeMembership,
  onSubscribe,
  onCancelAtPeriodEnd,
  onReactivate,
}) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('plan_champion_annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const currentPlan = MEMBERSHIP_PLANS.find(p => p.id === activeMembership?.planId);

  const handleSubscribePlan = async (planId: string) => {
    setIsProcessing(true);
    try {
      await onSubscribe(planId, billingCycle);
      setStatusMessage('Membership activated successfully! Welcome to the Pawfect Circle.');
      setTimeout(() => setStatusMessage(''), 4500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await onCancelAtPeriodEnd();
      setStatusMessage('Auto-renew disabled. Membership will remain active until the end of your billing cycle.');
      setTimeout(() => setStatusMessage(''), 4500);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReactivate = async () => {
    setIsProcessing(true);
    try {
      await onReactivate();
      setStatusMessage('Membership reactivated with continuous benefits.');
      setTimeout(() => setStatusMessage(''), 4500);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-10 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Award size={14} />
            <span>Sustained Shelter Care Circle</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Pawfect Giving Membership
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            Become a monthly or annual guardian to fund steady shelter pantries, unlock bespoke certificate stationery themes, and receive early access to urgent community batches.
          </p>

          <div className="mt-4 p-3 bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-2xl flex items-center gap-2 text-xs text-[#7E1B43]">
            <Badge variant="example" />
            <span className="font-semibold">
              Example Pricing: Pricing and benefits are configurable examples designed to adapt to shelter operational models.
            </span>
          </div>
        </div>
      </section>

      {statusMessage && (
        <div className="p-4 bg-[#EAF5EF] border border-[#C1E3CE] text-[#3F7A59] rounded-2xl text-xs font-bold flex items-center gap-2">
          <Check size={16} />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Active Membership Status Card if user has an active/pending membership */}
      {activeMembership && (
        <div className="bg-[#FFF8F6] border-2 border-[#B0285F] p-6 rounded-3xl shadow-paw-md space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#FDEBF0] text-[#7E1B43] font-bold rounded-full text-xs">
                  Active Member
                </span>
                <span className="text-xs text-[#3F7A59] font-semibold">
                  Status: {activeMembership.status.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#3A2530] font-heading mt-1">
                {currentPlan?.name || 'Pawfect Supporter'} Plan
              </h2>
              <p className="text-xs text-[#8A6B79] mt-0.5">
                Billing Cycle: <strong className="capitalize">{activeMembership.billingCycle}</strong> (
                {formatINR(activeMembership.pricePaidInPaise)} <Badge variant="example" />)
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#8A6B79] block">
                {activeMembership.cancelAtPeriodEnd ? 'Expires on:' : 'Renews on:'}
              </span>
              <span className="text-sm font-bold text-[#7E1B43]">
                {new Date(activeMembership.currentPeriodEnd).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="p-4 bg-[#FDEBF0]/50 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-[#7E1B43] block">Active Member Perks:</span>
            <p className="text-[#8A6B79]">
              ✓ Automated WhatsApp/SMS reminders before family milestones • All 8 watercolor certificate themes unlocked • Early 24-hr batch access • Quarterly verified photo impact report.
            </p>
          </div>

          {/* Action to Cancel or Reactivate */}
          <div className="pt-2 flex justify-end gap-3">
            {activeMembership.cancelAtPeriodEnd ? (
              <button
                onClick={handleReactivate}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#B0285F] text-[#FFF8F6] rounded-full text-xs font-bold hover:bg-[#7E1B43] transition-colors"
              >
                Reactivate Auto-Renewal
              </button>
            ) : (
              <button
                onClick={handleCancel}
                disabled={isProcessing}
                className="px-4 py-2 bg-[#FFF8F6] border border-[#F4A8C3] text-[#8A6B79] hover:text-[#A82944] hover:bg-[#FDF0F2] rounded-full text-xs font-semibold transition-colors"
              >
                Cancel Renewal at Period End
              </button>
            )}
          </div>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center">
        <div className="bg-[#FFF8F6] border border-[#F4A8C3] p-1.5 rounded-full inline-flex items-center gap-1 shadow-paw-sm">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                : 'text-[#3A2530] hover:text-[#7E1B43]'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                : 'text-[#3A2530] hover:text-[#7E1B43]'
            }`}
          >
            <span>Annual (Yearly)</span>
            <span className="px-1.5 py-0.2 bg-[#E27AA1] text-white text-[10px] rounded-full">
              Save ~17% <Badge variant="example" className="ml-1" />
            </span>
          </button>
        </div>
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMBERSHIP_PLANS.map(plan => {
          const price = calculatePlanPrice(plan, billingCycle);
          const isSelected = selectedPlanId === plan.id;
          const isUserPlan = activeMembership?.planId === plan.id && activeMembership.status === 'ACTIVE';

          return (
            <div
              key={plan.id}
              className={`bg-[#FFF8F6] rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-200 relative ${
                plan.isPopular
                  ? 'border-2 border-[#B0285F] shadow-paw-md scale-102 bg-[#FFF8F6]'
                  : 'border-[#F4A8C3]/60 shadow-paw-sm'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#B0285F] text-[#FFF8F6] text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-xs">
                  Most Loved by Donors
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-[#7E1B43] font-heading">{plan.name}</h3>
                  <Badge variant="member">{plan.badgeTitle}</Badge>
                </div>
                <p className="text-xs text-[#8A6B79] mb-4 min-h-[32px]">{plan.tagline}</p>

                {/* Price Display with Visible Example Tag */}
                <div className="mb-6 p-4 bg-[#FDEBF0]/60 rounded-2xl border border-[#F4A8C3]/40">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#7E1B43] font-heading">
                      {formatINR(price)}
                    </span>
                    <span className="text-xs text-[#8A6B79]">
                      / {billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="example" />
                    <span className="text-[10px] text-[#8A6B79]">Pricing is placeholder</span>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 mb-6">
                  <span className="text-[11px] font-bold text-[#7E1B43] uppercase tracking-wider block">
                    Included Benefits:
                  </span>
                  {plan.benefits.map(benefit => (
                    <div key={benefit.id} className="flex items-start gap-2.5 text-xs">
                      <div className="p-0.5 bg-[#EAF5EF] text-[#3F7A59] rounded-full shrink-0 mt-0.5">
                        <Check size={11} />
                      </div>
                      <div>
                        <strong className="text-[#3A2530] block">{benefit.title}</strong>
                        <span className="text-[#8A6B79] text-[11px] leading-tight block">
                          {benefit.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#F4A8C3]/40">
                {isUserPlan ? (
                  <div className="w-full py-2.5 text-center bg-[#EAF5EF] text-[#3F7A59] rounded-2xl text-xs font-bold">
                    ✓ Your Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribePlan(plan.id)}
                    disabled={isProcessing}
                    className={`w-full py-2.5 rounded-2xl text-xs font-bold transition-colors shadow-paw-sm flex items-center justify-center gap-1.5 ${
                      plan.isPopular
                        ? 'bg-[#B0285F] text-[#FFF8F6] hover:bg-[#7E1B43]'
                        : 'bg-[#FDEBF0] text-[#7E1B43] hover:bg-[#F4A8C3]/50'
                    }`}
                  >
                    <Sparkles size={14} />
                    <span>Join as {plan.name}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
