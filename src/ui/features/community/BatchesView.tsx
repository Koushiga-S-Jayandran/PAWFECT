import React, { useState } from 'react';
import { Heart, Users, Clock, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Batch } from '../../../domain/types';
import { formatINR } from '../../../domain/types';

interface BatchesViewProps {
  batches: Batch[];
  onContribute: (batchId: string, amountPaise: number) => Promise<void>;
}

export const BatchesView: React.FC<BatchesViewProps> = ({ batches, onContribute }) => {
  const [contributingBatchId, setContributingBatchId] = useState<string | null>(null);
  const [customAmountRupees, setCustomAmountRupees] = useState<number>(500);
  const [successMsg, setSuccessMsg] = useState<string>('');

  const handleExecuteContribution = async (batchId: string) => {
    if (customAmountRupees <= 0) return;
    await onContribute(batchId, customAmountRupees * 100);
    setSuccessMsg(`Thank you! Successfully contributed ₹${customAmountRupees} to ${batchId}`);
    setContributingBatchId(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-10 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Sparkles size={14} />
            <span>Collective Community Power</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Emergency Community Batches
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            When sudden monsoons flood kennels or virus outbreaks strike, individual bowls are not enough. We pool micro-donations into bulk wholesale procurement drives.
          </p>
        </div>
      </section>

      {successMsg && (
        <div className="p-4 bg-[#EAF5EF] border border-[#C1E3CE] text-[#3F7A59] rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map(batch => {
          const percent = Math.min(100, Math.round((batch.raisedPaise / batch.targetPaise) * 100));
          const isFunded = batch.status === 'funded' || percent >= 100;

          return (
            <article
              key={batch.id}
              className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm hover:shadow-paw-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-[#FDEBF0] text-[#7E1B43] rounded-full text-xs font-extrabold font-heading">
                    {batch.code}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isFunded
                        ? 'bg-[#EAF5EF] text-[#3F7A59]'
                        : 'bg-[#FEF5EA] text-[#B86B1E]'
                    }`}
                  >
                    {batch.urgencyTag || `${percent}% Funded`}
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#3A2530] font-heading mb-1.5 leading-snug">
                  {batch.name}
                </h2>
                <p className="text-xs text-[#8A6B79] mb-4 leading-relaxed">
                  {batch.description}
                </p>

                <div className="text-xs text-[#7E1B43] font-semibold mb-4">
                  Sanctuary: <strong className="text-[#3A2530]">{batch.shelterName}</strong> ({batch.city})
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#7E1B43]">{formatINR(batch.raisedPaise)}</span>
                    <span className="text-[#8A6B79]">Goal: {formatINR(batch.targetPaise)}</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#FDEBF0] rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isFunded ? 'bg-[#3F7A59]' : 'bg-[#B0285F]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#8A6B79] pt-1">
                  <span className="flex items-center gap-1">
                    <Users size={13} className="text-[#B0285F]" />
                    <span>{batch.contributorCount} donors</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    <span>Closes 15 Nov</span>
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-[#F4A8C3]/30">
                {isFunded ? (
                  <div className="p-2.5 text-center bg-[#EAF5EF] text-[#3F7A59] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>Fully Funded! Supplies Dispatched</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setContributingBatchId(batch.id)}
                    className="w-full py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-2xl hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center justify-center gap-1.5"
                  >
                    <Heart size={14} fill="currentColor" />
                    <span>Contribute to {batch.code}</span>
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal: Quick Contribution */}
      {contributingBatchId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs">
          <div className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 w-full max-w-sm shadow-paw-lg space-y-4">
            <h3 className="text-base font-bold text-[#7E1B43] font-heading">
              Support Emergency Batch
            </h3>
            <p className="text-xs text-[#8A6B79]">
              Choose an amount to pool into this wholesale shelter rescue purchase.
            </p>

            <div className="flex gap-2">
              {[250, 500, 1000, 2500].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCustomAmountRupees(amt)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                    customAmountRupees === amt
                      ? 'bg-[#B0285F] text-[#FFF8F6] border-[#B0285F]'
                      : 'bg-[#FDEBF0] text-[#7E1B43] border-[#F4A8C3]'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">
                Or Custom Amount (₹):
              </label>
              <input
                type="number"
                min={50}
                value={customAmountRupees}
                onChange={e => setCustomAmountRupees(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-xl text-xs font-bold text-[#7E1B43] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setContributingBatchId(null)}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleExecuteContribution(contributingBatchId)}
                className="px-5 py-2 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43]"
              >
                Contribute ₹{customAmountRupees}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
