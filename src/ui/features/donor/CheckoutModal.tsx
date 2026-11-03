import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Shield, Heart, Lock, Sparkles, CreditCard, Smartphone } from 'lucide-react';
import type { Gift, Shelter, User, FamilyMember, Order } from '../../../domain/types';
import { formatINR } from '../../../domain/types';
import { BRAND_COPY } from '../../../config/copy';
import { BowCat } from '../../mascots/BowCat';
import { sanitizeCleanDisplay } from '../../../security/sanitizer';

interface CheckoutModalProps {
  gift: Gift;
  shelter?: Shelter;
  shelters: Shelter[];
  currentUser: User;
  familyMembers: FamilyMember[];
  onClose: () => void;
  onProcessPayment: (data: {
    gift: Gift;
    shelter: Shelter;
    quantity: number;
    dedication?: {
      honoreeName: string;
      occasion: string;
      message: string;
      isMemorial: boolean;
    };
    paymentMethod: string;
    idempotencyKey: string;
  }) => Promise<Order>;
  onOrderCompleted: (order: Order) => void;
}

type CheckoutStep = 'gift' | 'dedication' | 'review' | 'pay' | 'done';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  gift,
  shelter: initialShelter,
  shelters,
  currentUser,
  familyMembers,
  onClose,
  onProcessPayment,
  onOrderCompleted,
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('gift');
  const [selectedShelterId, setSelectedShelterId] = useState<string>(
    initialShelter?.id || (shelters[0]?.id ?? '')
  );
  const [quantity, setQuantity] = useState<number>(1);

  // Dedication state
  const [honoreeName, setHonoreeName] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('Birthday Blessing');
  const [message, setMessage] = useState<string>('');
  const [isMemorial, setIsMemorial] = useState<boolean>(false);
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string>('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<string>('upi_gpay');
  const [upiId, setUpiId] = useState<string>('ananya@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [idempotencyKey] = useState<string>(() => `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const targetShelter = shelters.find(s => s.id === selectedShelterId) || shelters[0];
  const totalPaise = gift.amountInPaise * quantity;

  // Handle auto-filling dedication from selected family member
  const handleSelectFamilyMember = (memberId: string) => {
    setSelectedFamilyMemberId(memberId);
    if (!memberId) return;

    const member = familyMembers.find(m => m.id === memberId);
    if (member) {
      setHonoreeName(member.name);
      if (member.specialDates && member.specialDates.length > 0) {
        const primary = member.specialDates[0];
        setOccasion(primary.title);
        setIsMemorial(primary.type === 'memorial');
        setMessage(`In honour of ${member.name}'s ${primary.title}. May our love reach every bowl.`);
      }
    }
  };

  const handleExecutePayment = async () => {
    if (isSubmitting) return; // Idempotency double-click defense
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const cleanHonoree = sanitizeCleanDisplay(honoreeName) || 'Our Rescued Friends';
      const cleanOccasion = sanitizeCleanDisplay(occasion) || 'Heartfelt Kindness';
      const cleanMessage = sanitizeCleanDisplay(message);

      const order = await onProcessPayment({
        gift,
        shelter: targetShelter,
        quantity,
        dedication: {
          honoreeName: cleanHonoree,
          occasion: cleanOccasion,
          message: cleanMessage,
          isMemorial,
        },
        paymentMethod: paymentMethod === 'upi_custom' ? `UPI (${upiId})` : paymentMethod.replace('_', ' ').toUpperCase(),
        idempotencyKey,
      });

      setCompletedOrder(order);
      setCurrentStep('done');
      onOrderCompleted(order);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Payment simulation interrupted. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList: { id: CheckoutStep; label: string }[] = [
    { id: 'gift', label: '1. Gift' },
    { id: 'dedication', label: '2. Dedicate' },
    { id: 'review', label: '3. Review' },
    { id: 'pay', label: '4. Pay' },
    { id: 'done', label: '5. Done' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/60 backdrop-blur-xs animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-paw-lg flex flex-col justify-between">
        {/* Top Header & Progress Indicator */}
        <div className="p-6 border-b border-[#F4A8C3]/40 bg-[#FDEBF0]/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-[#7E1B43] font-heading" id="checkout-modal-title">
                Send Gift & Meals
              </span>
              <span className="text-xs text-[#8A6B79]">• INR (₹)</span>
            </div>
            {currentStep !== 'done' && (
              <button
                onClick={onClose}
                className="p-1.5 text-[#8A6B79] hover:text-[#3A2530] rounded-full hover:bg-[#FDEBF0]"
                aria-label="Cancel checkout"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Stepper Bar */}
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {stepsList.map((s, idx) => {
              const isPast = stepsList.findIndex(x => x.id === currentStep) > idx;
              const isCurrent = s.id === currentStep;
              return (
                <div key={s.id} className="space-y-1">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      isCurrent
                        ? 'bg-[#B0285F]'
                        : isPast
                        ? 'bg-[#E27AA1]'
                        : 'bg-[#F4A8C3]/40'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-bold block truncate ${
                      isCurrent ? 'text-[#7E1B43]' : 'text-[#8A6B79]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Body Content */}
        <div className="p-6 flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 bg-[#FDF0F2] border border-[#F6C2CB] text-[#A82944] text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: GIFT & SHELTER CONFIG */}
          {currentStep === 'gift' && (
            <div className="space-y-5">
              <div className="p-4 bg-[#FDEBF0] rounded-2xl border border-[#F4A8C3]/60 flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#B0285F] uppercase tracking-wider block">
                    Selected Item
                  </span>
                  <h3 className="text-base font-bold text-[#3A2530] font-heading">{gift.title}</h3>
                  <p className="text-xs text-[#8A6B79] mt-0.5">{gift.description}</p>
                </div>
                <span className="text-lg font-extrabold text-[#7E1B43] font-heading shrink-0 ml-3">
                  {formatINR(gift.amountInPaise)}
                </span>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center justify-between p-3.5 bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-2xl">
                <div>
                  <span className="text-xs font-bold text-[#3A2530] block">Quantity / Portions:</span>
                  <span className="text-[11px] text-[#8A6B79]">
                    Provides {gift.mealsEquivalent * quantity} total meals
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-full border border-[#E27AA1] flex items-center justify-center font-bold text-[#7E1B43] hover:bg-[#FDEBF0] disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold text-sm text-[#3A2530]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-[#E27AA1] flex items-center justify-center font-bold text-[#7E1B43] hover:bg-[#FDEBF0]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Destination Shelter Selection */}
              <div>
                <label htmlFor="shelter-destination-select" className="block text-xs font-bold text-[#7E1B43] mb-1.5">
                  Delivering to Shelter:
                </label>
                <select
                  id="shelter-destination-select"
                  value={selectedShelterId}
                  onChange={e => setSelectedShelterId(e.target.value)}
                  className="w-full bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl px-3.5 py-2.5 text-xs text-[#3A2530] font-semibold focus:outline-none focus:border-[#B0285F]"
                >
                  {shelters.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} — {s.city} ({s.dogCount} dogs needing food)
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#8A6B79] mt-1">
                  100% of this gift goes directly to {targetShelter.name}.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: DEDICATION */}
          {currentStep === 'dedication' && (
            <div className="space-y-4">
              {familyMembers.length > 0 && (
                <div>
                  <label htmlFor="family-member-select" className="block text-xs font-bold text-[#7E1B43] mb-1">
                    Select from Your Saved Family Dates (Optional):
                  </label>
                  <select
                    id="family-member-select"
                    value={selectedFamilyMemberId}
                    onChange={e => handleSelectFamilyMember(e.target.value)}
                    className="w-full bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl px-3 py-2 text-xs text-[#3A2530] focus:outline-none"
                  >
                    <option value="">-- Custom Honoree / New Dedication --</option>
                    {familyMembers.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.relationship})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">
                  Honoree Name (will appear on the certificate):
                </label>
                <input
                  type="text"
                  value={honoreeName}
                  onChange={e => setHonoreeName(e.target.value)}
                  placeholder="e.g. Aaji, Simba, Mom & Dad, Dr. Anand"
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">Occasion:</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={e => setOccasion(e.target.value)}
                  placeholder="e.g. Birthday, Anniversary, Memorial, Recovery Blessing"
                  className="w-full px-3.5 py-2.5 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A2530] mb-1">
                  Special Message for the Shelter Plaque / Certificate:
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="e.g. Wishing you vibrant health and happiness. Thank you shelter caretakers for loving these babies!"
                  className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-[#FDEBF0]/60 rounded-2xl border border-[#F4A8C3]/50">
                <input
                  type="checkbox"
                  id="memorial-check"
                  checked={isMemorial}
                  onChange={e => setIsMemorial(e.target.checked)}
                  className="rounded text-[#B0285F] focus:ring-[#B0285F]"
                />
                <label htmlFor="memorial-check" className="text-xs text-[#3A2530] font-medium cursor-pointer">
                  This gift is in loving memory of a beloved companion who has passed over the rainbow bridge.
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl shadow-paw-sm space-y-3">
                <div className="flex justify-between items-start border-b border-[#F4A8C3]/30 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#7E1B43]">{gift.title}</h3>
                    <p className="text-xs text-[#8A6B79]">Quantity: {quantity} ({gift.unitLabel})</p>
                    <p className="text-xs text-[#3F7A59] font-semibold mt-1">
                      Recipient Sanctuary: {targetShelter.name}
                    </p>
                  </div>
                  <span className="text-base font-bold text-[#7E1B43] font-heading">
                    {formatINR(totalPaise)}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-[#8A6B79]">
                  <p><strong className="text-[#3A2530]">Dedicated to:</strong> {honoreeName || 'Animal Friends'}</p>
                  <p><strong className="text-[#3A2530]">Occasion:</strong> {occasion || 'Blessing'}</p>
                  {message && <p><strong className="text-[#3A2530]">Message:</strong> "{message}"</p>}
                  <p><strong className="text-[#3A2530]">Donor:</strong> {currentUser.name} ({currentUser.phone})</p>
                </div>

                <div className="pt-3 border-t border-[#F4A8C3]/30 flex justify-between items-center text-sm font-bold text-[#7E1B43]">
                  <span>Total Amount Payable (INR):</span>
                  <span className="text-lg font-extrabold">{formatINR(totalPaise)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#EAF5EF] border border-[#C1E3CE] text-xs text-[#3F7A59] rounded-2xl flex items-center gap-2">
                <Shield size={16} className="shrink-0" />
                <span>Zero platform fee. 100% of ₹{totalPaise / 100} is dispatched to {targetShelter.name}.</span>
              </div>
            </div>
          )}

          {/* STEP 4: PAY */}
          {currentStep === 'pay' && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-xs text-[#8A6B79]">Total to Pay:</span>
                <h3 className="text-3xl font-extrabold text-[#7E1B43] font-heading">
                  {formatINR(totalPaise)}
                </h3>
                <span className="text-[11px] text-[#3F7A59] font-semibold">
                  Secure UPI / Netbanking Gateway
                </span>
              </div>

              {/* UPI Options */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#7E1B43]">
                  {BRAND_COPY.upiInstruction}:
                </label>

                {[
                  { id: 'upi_gpay', name: 'Google Pay UPI', desc: 'Fast tap authorization' },
                  { id: 'upi_phonepe', name: 'PhonePe UPI', desc: 'Direct UPI auto-debit' },
                  { id: 'upi_paytm', name: 'Paytm UPI', desc: 'Scan and pay' },
                  { id: 'upi_custom', name: 'Enter Custom UPI ID / VPA', desc: 'BHIM, Cred, ICICI, etc.' },
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-colors ${
                      paymentMethod === opt.id
                        ? 'border-[#B0285F] bg-[#FDEBF0]'
                        : 'border-[#F4A8C3]/60 bg-[#FFF8F6] hover:bg-[#FDEBF0]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={opt.id}
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="text-[#B0285F] focus:ring-[#B0285F]"
                      />
                      <div>
                        <span className="text-xs font-bold text-[#3A2530] block">{opt.name}</span>
                        <span className="text-[11px] text-[#8A6B79]">{opt.desc}</span>
                      </div>
                    </div>
                    <Smartphone size={16} className="text-[#8A6B79]" />
                  </label>
                ))}

                {paymentMethod === 'upi_custom' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. mobile@upi or username@okhdfcbank"
                      className="w-full px-3.5 py-2.5 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none focus:border-[#B0285F]"
                    />
                  </div>
                )}
              </div>

              <div className="p-3 bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-2xl text-[11px] text-[#8A6B79] flex items-center gap-2">
                <Lock size={14} className="text-[#3F7A59] shrink-0" />
                <span>Simulated Indian UPI environment for instant checkout. Click below to authorize.</span>
              </div>
            </div>
          )}

          {/* STEP 5: DONE */}
          {currentStep === 'done' && completedOrder && (
            <div className="text-center py-4 space-y-4">
              <BowCat size={96} mood="celebrating" className="mx-auto" />
              <div>
                <h3 className="text-2xl font-extrabold text-[#7E1B43] font-heading">
                  Blessing Received & Dispatched!
                </h3>
                <p className="text-xs text-[#8A6B79] mt-1 max-w-sm mx-auto">
                  Thank you, <strong className="text-[#3A2530]">{completedOrder.donorName}</strong>. Your gift of {formatINR(completedOrder.amountInPaise)} has been confirmed for {completedOrder.shelterName}.
                </p>
              </div>

              <div className="p-4 bg-[#FDEBF0] border border-[#F4A8C3] rounded-2xl max-w-md mx-auto text-left text-xs space-y-1.5">
                <p className="flex justify-between">
                  <span className="text-[#8A6B79]">Order Number:</span>
                  <strong className="text-[#3A2530]">{completedOrder.id}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#8A6B79]">Certificate ID:</span>
                  <strong className="text-[#7E1B43]">{completedOrder.certificateId.toUpperCase()}</strong>
                </p>
                <p className="flex justify-between">
                  <span className="text-[#8A6B79]">Photo Proof Timeline:</span>
                  <span className="text-[#3F7A59] font-bold">Within 48 Hours</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-6 border-t border-[#F4A8C3]/40 bg-[#FDEBF0]/30 flex items-center justify-between">
          {currentStep === 'gift' && (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79] hover:text-[#3A2530]"
              >
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep('dedication')}
                className="px-5 py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center gap-1.5"
              >
                <span>Add Dedication</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {currentStep === 'dedication' && (
            <>
              <button
                onClick={() => setCurrentStep('gift')}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79] hover:text-[#3A2530] flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep('review')}
                className="px-5 py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center gap-1.5"
              >
                <span>Review Order</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {currentStep === 'review' && (
            <>
              <button
                onClick={() => setCurrentStep('dedication')}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79] hover:text-[#3A2530] flex items-center gap-1"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                onClick={() => setCurrentStep('pay')}
                className="px-5 py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center gap-1.5"
              >
                <span>Proceed to Pay</span>
                <ArrowRight size={14} />
              </button>
            </>
          )}

          {currentStep === 'pay' && (
            <>
              <button
                onClick={() => setCurrentStep('review')}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79] hover:text-[#3A2530] flex items-center gap-1 disabled:opacity-50"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
              <button
                onClick={handleExecutePayment}
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] transition-colors shadow-paw-sm flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Pay {formatINR(totalPaise)} via UPI</span>
                  </>
                )}
              </button>
            </>
          )}

          {currentStep === 'done' && (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79] hover:text-[#3A2530]"
              >
                Close
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43] transition-colors shadow-paw-sm"
              >
                View Timeline & Certificate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
