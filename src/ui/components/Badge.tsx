import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'example' | 'verified' | 'urgent' | 'critical' | 'normal' | 'member';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'normal',
  className = '',
}) => {
  if (variant === 'example') {
    return (
      <span
        className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#FDEBF0] text-[#B0285F] border border-[#F4A8C3] rounded-md ${className}`}
        title="Configurable demo pricing"
      >
        Example
      </span>
    );
  }

  if (variant === 'verified') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#EAF5EF] text-[#3F7A59] border border-[#C1E3CE] rounded-full ${className}`}
      >
        <CheckCircle2 size={13} className="text-[#3F7A59]" />
        <span>Verified Shelter</span>
      </span>
    );
  }

  if (variant === 'critical') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#FDF0F2] text-[#A82944] border border-[#F6C2CB] rounded-full animate-pulse ${className}`}
      >
        <AlertCircle size={13} />
        <span>{children || 'Critical SOS'}</span>
      </span>
    );
  }

  if (variant === 'urgent') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold bg-[#FEF5EA] text-[#B86B1E] border border-[#F6DFBE] rounded-full ${className}`}
      >
        <span>{children || 'Urgent Need'}</span>
      </span>
    );
  }

  if (variant === 'member') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold bg-[#FDEBF0] text-[#7E1B43] border border-[#E27AA1] rounded-full ${className}`}
      >
        <span>★ {children || 'Member'}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium bg-[#FFF8F6] text-[#8A6B79] border border-[#F4A8C3]/60 rounded-full ${className}`}
    >
      {children}
    </span>
  );
};
