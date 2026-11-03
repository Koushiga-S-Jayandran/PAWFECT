import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Sparkles, Award, Image as ImageIcon } from 'lucide-react';
import type { Order, OrderStatus } from '../../../domain/types';
import { formatINR } from '../../../domain/types';
import { DateService } from '../../../services/date-utils';

interface OrderTrackingTimelineProps {
  order: Order;
  onOpenCertificate: (order: Order) => void;
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({
  order,
  onOpenCertificate,
}) => {
  const steps: { status: OrderStatus; title: string; desc: string }[] = [
    { status: 'PAID', title: 'Payment Confirmed', desc: 'UPI payment cleared & allocated directly.' },
    { status: 'SHELTER_CONFIRMED', title: 'Shelter Confirmed', desc: 'Sanctuary caretakers acknowledged intake.' },
    { status: 'FOOD_BOUGHT', title: 'Food & Supplies Procured', desc: 'Vendor delivery received in kitchen.' },
    { status: 'PROOF_UPLOADED', title: 'Photo Proof Uploaded', desc: 'Photographs of bowl distribution captured.' },
    { status: 'CERTIFICATE_READY', title: 'Blessing Certificate Ready', desc: 'Digitally signed and shareable.' },
  ];

  const currentIdx = steps.findIndex(s => s.status === order.status);

  return (
    <div className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-8 shadow-paw-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F4A8C3]/30 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8A6B79]">ORDER #{order.id}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FDEBF0] text-[#7E1B43] font-bold">
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#3A2530] font-heading mt-1">
            {order.giftTitle}
          </h2>
          <p className="text-xs text-[#8A6B79]">
            Sanctuary: <strong className="text-[#7E1B43]">{order.shelterName}</strong> • {formatINR(order.amountInPaise)}
          </p>
        </div>

        <button
          onClick={() => onOpenCertificate(order)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B0285F] text-[#FFF8F6] rounded-full text-xs font-bold hover:bg-[#7E1B43] transition-colors shadow-paw-sm"
        >
          <Award size={14} />
          <span>View Certificate</span>
        </button>
      </div>

      {/* 48-Hour Guarantee Callout */}
      <div className="p-3.5 bg-[#FEF5EA] border border-[#F6DFBE] rounded-2xl flex items-center justify-between text-xs text-[#B86B1E]">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>
            <strong>48-Hour Doorstep Proof Standard:</strong> Photo verification of meals served is uploaded directly by shelter volunteers.
          </span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#F4A8C3]/50">
        {steps.map((s, idx) => {
          const isDone = idx <= currentIdx;
          const isCurrent = idx === currentIdx;
          const event = order.timeline.find(t => t.status === s.status);

          return (
            <div key={s.status} className="relative flex items-start gap-4">
              {/* Circle Marker */}
              <div
                className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? 'bg-[#B0285F] text-[#FFF8F6] ring-4 ring-[#FDEBF0]'
                    : 'bg-[#FFF8F6] text-[#8A6B79] border-2 border-[#F4A8C3]'
                }`}
              >
                {isDone ? <CheckCircle2 size={14} /> : idx + 1}
              </div>

              {/* Step info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-bold ${
                      isCurrent ? 'text-[#7E1B43]' : isDone ? 'text-[#3A2530]' : 'text-[#8A6B79]'
                    }`}
                  >
                    {s.title}
                  </h3>
                  {event?.timestamp && (
                    <span className="text-[11px] text-[#8A6B79]">
                      {DateService.formatIST(event.timestamp)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8A6B79] mt-0.5">{s.desc}</p>
                {event?.note && (
                  <p className="mt-1 text-xs text-[#7E1B43] bg-[#FDEBF0] px-2.5 py-1 rounded-lg w-fit">
                    🐾 Note: {event.note}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Proof Photo Display if uploaded */}
      {order.proofPhotoUrl && (
        <div className="pt-4 border-t border-[#F4A8C3]/30">
          <span className="text-xs font-bold text-[#7E1B43] block mb-2 flex items-center gap-1.5">
            <ImageIcon size={14} />
            <span>Shelter Photo Proof Verified:</span>
          </span>
          <img
            src={order.proofPhotoUrl}
            alt="Proof of Feeding"
            className="w-full max-w-md h-52 object-cover rounded-2xl border-2 border-[#F4A8C3] shadow-paw-sm"
          />
        </div>
      )}
    </div>
  );
};
