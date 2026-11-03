import React, { useRef, useState } from 'react';
import { Download, Share2, Check, Sparkles, Heart } from 'lucide-react';
import type { Order } from '../../domain/types';
import { CERTIFICATE_THEMES } from '../../config/roles';
import { BowCat } from '../mascots/BowCat';
import { BRAND_COPY } from '../../config/copy';
import { formatINR } from '../../domain/types';

interface CertificateViewProps {
  order: Order;
  onClose?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ order, onClose }) => {
  const [selectedThemeId, setSelectedThemeId] = useState('classic_rose');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const theme = CERTIFICATE_THEMES.find(t => t.id === selectedThemeId) || CERTIFICATE_THEMES[0];

  const handleCopyLink = () => {
    const url = `${window.location.origin}/#certificate?id=${order.certificateId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      // Use clean canvas-based drawing to ensure zero-dependency, ultra-crisp export
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 840;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = theme.bgColor;
      ctx.fillRect(0, 0, 1200, 840);

      // Draw decorative double border
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, 1140, 780);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(42, 42, 1116, 756);

      // Load logo
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = '/assets/aistudio/pawfect-logo-brown-beige_f8c728e7.png';

      await new Promise<void>(resolve => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => resolve();
      });

      if (logoImg.complete && logoImg.naturalWidth > 0) {
        ctx.drawImage(logoImg, 1200 / 2 - 45, 60, 90, 90);
      }

      // Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#7E1B43';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('PAWFECT CERTIFICATE OF BLESSING', 600, 190);

      ctx.font = 'italic 18px serif';
      ctx.fillStyle = '#8A6B79';
      ctx.fillText('Connecting every paw to its perfect hands', 600, 220);

      // Dedication
      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#3A2530';
      ctx.fillText('This heartfelt gift of kindness is dedicated with immense love to', 600, 280);

      ctx.font = 'bold 44px serif';
      ctx.fillStyle = theme.primaryColor;
      const honoree = order.dedication?.honoreeName || 'Beloved Animal Souls';
      ctx.fillText(honoree, 600, 340);

      if (order.dedication?.occasion) {
        ctx.font = 'italic 20px sans-serif';
        ctx.fillStyle = '#8A6B79';
        ctx.fillText(`on the auspicious occasion of ${order.dedication.occasion}`, 600, 380);
      }

      // Gift impact
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#3A2530';
      ctx.fillText(
        `Funded: "${order.giftTitle}" (${formatINR(order.amountInPaise)}) for the rescued residents of`,
        600,
        450
      );

      ctx.font = 'bold 28px sans-serif';
      ctx.fillStyle = '#7E1B43';
      ctx.fillText(order.shelterName, 600, 495);

      // Dedication message quote
      if (order.dedication?.message) {
        ctx.font = 'italic 19px serif';
        ctx.fillStyle = '#664052';
        ctx.fillText(`"${order.dedication.message.slice(0, 95)}..."`, 600, 560);
      }

      // Footer details & Certificate ID
      ctx.strokeStyle = '#F4A8C3';
      ctx.beginPath();
      ctx.moveTo(200, 640);
      ctx.lineTo(1000, 640);
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = '14px monospace';
      ctx.fillStyle = '#8A6B79';
      ctx.fillText(`Certificate No: ${order.certificateId.toUpperCase()}`, 120, 690);
      ctx.fillText(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 120, 720);
      ctx.fillText(`Presented by: ${order.donorName}`, 120, 750);

      ctx.textAlign = 'right';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#3F7A59';
      ctx.fillText('✓ Verified Photo Proof Logged', 1080, 700);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#8A6B79';
      ctx.fillText('pawfect.org', 1080, 730);

      // Trigger download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Pawfect_Certificate_${order.certificateId}.png`;
      a.click();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF8F6] p-4 rounded-3xl border border-[#F4A8C3]/50 shadow-paw-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#7E1B43]">Stationery Theme:</span>
          <div className="flex gap-1.5">
            {CERTIFICATE_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedThemeId(t.id)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  selectedThemeId === t.id ? 'scale-115 border-[#7E1B43]' : 'border-transparent opacity-70'
                }`}
                style={{ backgroundColor: t.primaryColor }}
                title={t.name}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8F6] border border-[#E27AA1] text-[#7E1B43] rounded-full text-xs font-semibold hover:bg-[#FDEBF0] transition-colors"
          >
            {copied ? <Check size={14} className="text-[#3F7A59]" /> : <Share2 size={14} />}
            <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#B0285F] text-[#FFF8F6] rounded-full text-xs font-bold hover:bg-[#7E1B43] transition-colors shadow-paw-sm disabled:opacity-50"
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating...' : 'Save as PNG Image'}</span>
          </button>
        </div>
      </div>

      {/* Rendered Certificate Card */}
      <div
        ref={certRef}
        style={{ backgroundColor: theme.bgColor, borderColor: theme.primaryColor }}
        className="relative p-8 sm:p-12 border-4 rounded-3xl shadow-paw-md text-center overflow-hidden transition-colors duration-200"
      >
        {/* Corner Flourishes */}
        <div className="absolute top-4 left-4 text-[#F4A8C3]">
          <Heart size={20} fill="currentColor" />
        </div>
        <div className="absolute top-4 right-4 text-[#F4A8C3]">
          <Heart size={20} fill="currentColor" />
        </div>
        <div className="absolute bottom-4 left-4 text-[#F4A8C3]">
          <Heart size={20} fill="currentColor" />
        </div>
        <div className="absolute bottom-4 right-4 text-[#F4A8C3]">
          <Heart size={20} fill="currentColor" />
        </div>

        {/* Certificate Header with Logo and Mascot */}
        <div className="flex items-center justify-center gap-4 mb-3">
          <img
            src="/assets/aistudio/pawfect-logo-brown-beige_f8c728e7.png"
            alt="Pawfect Logo"
            className="h-16 w-auto object-contain"
          />
          <BowCat size={52} mood="celebrating" />
        </div>

        <span className="inline-block px-3 py-1 bg-[#FDEBF0] text-[#7E1B43] border border-[#F4A8C3] rounded-full text-[11px] font-bold tracking-wider uppercase mb-3">
          Official Pawfect Blessing Certificate
        </span>

        <h3 className="text-sm font-medium text-[#8A6B79] uppercase tracking-widest mb-1">
          {BRAND_COPY.tagline}
        </h3>

        <div className="my-6">
          <p className="text-sm text-[#3A2530] mb-1">
            This gift of nourishment and healing is lovingly dedicated to
          </p>
          <h2
            style={{ color: theme.primaryColor }}
            className="text-2xl sm:text-4xl font-extrabold font-heading tracking-tight"
          >
            {order.dedication?.honoreeName || 'Our Cherished Animal Friends'}
          </h2>
          {order.dedication?.occasion && (
            <p className="text-xs sm:text-sm text-[#8A6B79] italic mt-1">
              on the special occasion of {order.dedication.occasion}
            </p>
          )}
        </div>

        {/* Gift Impact Box */}
        <div className="bg-[#FFF8F6]/80 backdrop-blur-xs border border-[#F4A8C3]/60 rounded-2xl p-4 sm:p-6 max-w-lg mx-auto my-6 text-left shadow-paw-sm">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-[#B0285F] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-[#3A2530]">
                {order.giftTitle}
              </p>
              <p className="text-xs text-[#8A6B79] mt-0.5">
                Delivered with care to: <strong className="text-[#7E1B43]">{order.shelterName}</strong>
              </p>
              <p className="text-xs font-semibold text-[#3F7A59] mt-2 flex items-center gap-1">
                ✓ Value: {formatINR(order.amountInPaise)} • Verified Photo Proof Recorded
              </p>
            </div>
          </div>

          {order.dedication?.message && (
            <blockquote className="mt-3 pt-3 border-t border-[#F4A8C3]/40 text-xs italic text-[#3A2530] leading-relaxed">
              "{order.dedication.message}"
            </blockquote>
          )}
        </div>

        {/* Proof Photo Attachment if available */}
        {order.proofPhotoUrl && (
          <div className="max-w-xs mx-auto mb-6">
            <span className="block text-[11px] font-bold text-[#8A6B79] mb-1 uppercase tracking-wider">
              Photo from Shelter Feeding
            </span>
            <img
              src={order.proofPhotoUrl}
              alt="Shelter Proof"
              className="w-full h-36 object-cover rounded-2xl border-2 border-[#F4A8C3] shadow-paw-sm"
            />
          </div>
        )}

        {/* Certificate Meta Details */}
        <div className="border-t border-[#F4A8C3]/50 pt-4 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8A6B79] gap-2">
          <div className="text-left">
            <span>Cert No: <strong>{order.certificateId.toUpperCase()}</strong></span>
            <span className="mx-2">•</span>
            <span>Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
          <div>
            <span>Gifted by: <strong className="text-[#3A2530]">{order.donorName}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
