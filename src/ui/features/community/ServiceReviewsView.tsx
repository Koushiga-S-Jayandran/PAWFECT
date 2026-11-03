import React, { useState } from 'react';
import { Star, MessageSquare, Shield, CheckCircle2, Heart, Plus, Sparkles } from 'lucide-react';
import type { ServiceReview, ServiceAspect, User } from '../../../domain/types';
import { BowCat } from '../../mascots/BowCat';

interface ServiceReviewsViewProps {
  reviews: ServiceReview[];
  currentUser: User;
  onAddReview: (review: {
    authorName: string;
    authorCity: string;
    rating: number;
    aspect: ServiceAspect;
    comment: string;
    isVerifiedDonor: boolean;
  }) => Promise<void>;
}

export const ServiceReviewsView: React.FC<ServiceReviewsViewProps> = ({
  reviews,
  currentUser,
  onAddReview,
}) => {
  const [selectedAspect, setSelectedAspect] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [aspect, setAspect] = useState<ServiceAspect>('trust');
  const [city, setCity] = useState('Bengaluru');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const aspects: { id: ServiceAspect | 'all'; label: string }[] = [
    { id: 'all', label: 'All Reviews' },
    { id: 'trust', label: 'Proof & Trust' },
    { id: 'reminders', label: 'Smart Reminders' },
    { id: 'ease_of_use', label: 'Ease of Use & UPI' },
    { id: 'support', label: 'Donor Support' },
  ];

  const filtered = reviews.filter(r => {
    if (selectedAspect !== 'all' && r.aspect !== selectedAspect) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddReview({
        authorName: currentUser.name,
        authorCity: city,
        rating,
        aspect,
        comment: comment.trim(),
        isVerifiedDonor: true,
      });
      setSuccessMsg('Thank you for reviewing Pawfect! Your review has been published.');
      setShowAddModal(false);
      setComment('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#FDEBF0] via-[#FFF8F6] to-[#FDEBF0] border border-[#F4A8C3]/60 rounded-3xl p-6 sm:p-10 shadow-paw-sm">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF8F6] border border-[#F4A8C3] rounded-full text-xs font-bold text-[#B0285F] mb-3">
            <Sparkles size={14} />
            <span>Platform Accountability</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#7E1B43] font-heading">
            Reviews of Pawfect
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#8A6B79]">
            Read genuine donor feedback on our support team, photo verification turnaround, and calendar reminders.
          </p>

          <div className="mt-4 p-3 bg-[#FFF8F6] border border-[#F4A8C3]/50 rounded-2xl flex items-center gap-2.5 text-xs text-[#7E1B43]">
            <Shield size={16} className="text-[#3F7A59] shrink-0" />
            <span>
              <strong>Ethical Notice:</strong> We do NOT allow subjective star-ratings of animal shelters. Shelters operate under daily trauma and rescue emergencies; our platform rates only Pawfect's own delivery, proof logistics, and technology.
            </span>
          </div>
        </div>
      </section>

      {successMsg && (
        <div className="p-4 bg-[#EAF5EF] border border-[#C1E3CE] text-[#3F7A59] rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Write Review CTA */}
      <div className="bg-[#FFF8F6] p-4 sm:p-5 rounded-3xl border border-[#F4A8C3]/50 shadow-paw-sm flex flex-wrap items-center justify-between gap-4">
        {/* Aspect Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {aspects.map(asp => (
            <button
              key={asp.id}
              onClick={() => setSelectedAspect(asp.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedAspect === asp.id
                  ? 'bg-[#B0285F] text-[#FFF8F6] shadow-paw-sm'
                  : 'bg-[#FDEBF0] text-[#3A2530] hover:bg-[#F4A8C3]/40'
              }`}
            >
              {asp.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B0285F] text-[#FFF8F6] rounded-full text-xs font-bold hover:bg-[#7E1B43] shadow-paw-sm"
        >
          <Plus size={14} />
          <span>Write a Review of Pawfect</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(rev => (
          <article
            key={rev.id}
            className="bg-[#FFF8F6] border border-[#F4A8C3]/60 rounded-3xl p-6 shadow-paw-sm flex flex-col justify-between"
          >
            <div>
              {/* Stars & Aspect Pill */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-[#E6A23C]">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star
                      key={s}
                      size={14}
                      fill={s <= rev.rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                    />
                  ))}
                </div>

                <span className="px-2 py-0.5 rounded-full bg-[#FDEBF0] text-[#7E1B43] text-[10px] font-bold uppercase tracking-wider">
                  {rev.aspect.replace('_', ' ')}
                </span>
              </div>

              <blockquote className="text-xs sm:text-sm text-[#3A2530] leading-relaxed my-3 italic">
                "{rev.comment}"
              </blockquote>
            </div>

            <div className="pt-3 border-t border-[#F4A8C3]/30 flex items-center justify-between text-xs text-[#8A6B79]">
              <div className="flex items-center gap-1.5">
                <strong className="text-[#3A2530]">{rev.authorName}</strong>
                <span>• {rev.authorCity}</span>
              </div>
              <span className="text-[#3F7A59] font-semibold text-[11px] flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified Donor
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal: Write Review */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A2530]/50 backdrop-blur-xs">
          <form
            onSubmit={handleSubmit}
            className="bg-[#FFF8F6] border border-[#F4A8C3] rounded-3xl p-6 w-full max-w-md shadow-paw-lg space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-[#7E1B43] font-heading">
                Review the Pawfect Platform
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#8A6B79] hover:text-[#3A2530]"
              >
                ✕
              </button>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">Star Rating:</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="p-1 text-[#E6A23C] hover:scale-110 transition-transform"
                  >
                    <Star
                      size={24}
                      fill={num <= rating ? 'currentColor' : 'none'}
                      stroke="currentColor"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">
                Which aspect of the Pawfect service are you reviewing?
              </label>
              <select
                value={aspect}
                onChange={e => setAspect(e.target.value as ServiceAspect)}
                className="w-full px-3 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none"
              >
                <option value="trust">Photo Proof & Transparency</option>
                <option value="reminders">Smart Calendar Reminders</option>
                <option value="ease_of_use">Ease of Giving & UPI Flow</option>
                <option value="support">Donor Care & Responsiveness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">Your City:</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="e.g. Mumbai, Bengaluru, Delhi, Pune"
                className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3A2530] mb-1">
                Your Review & Experience:
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts on how smoothly your gift was executed, certificates delivered, and photo proof verified..."
                className="w-full px-3.5 py-2 bg-[#FFF8F6] border border-[#F4A8C3] rounded-2xl text-xs text-[#3A2530] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold text-[#8A6B79]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-[#B0285F] text-[#FFF8F6] text-xs font-bold rounded-full hover:bg-[#7E1B43]"
              >
                {isSubmitting ? 'Submitting...' : 'Post Service Review'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
