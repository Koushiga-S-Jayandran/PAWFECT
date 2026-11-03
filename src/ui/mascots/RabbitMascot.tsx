import React from 'react';
import type { MascotProps } from './types';

export const RabbitMascot: React.FC<MascotProps> = ({
  size = 48,
  mood = 'happy',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className}`}
      aria-label={`Pawfect Bunny Mascot (${mood})`}
      role="img"
    >
      {/* Tall Left Ear */}
      <path
        d="M38 46C34 24 38 12 44 12C50 12 50 24 46 46"
        fill="#FFF8F6"
        stroke="#B0285F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M41 40C39 26 41 18 44 18C47 18 47 26 44 40" fill="#F4A8C3" />

      {/* Tall Right Ear */}
      <path
        d="M54 46C50 24 50 12 56 12C62 12 66 24 62 46"
        fill="#FFF8F6"
        stroke="#B0285F"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M56 40C53 26 53 18 56 18C59 18 61 26 59 40" fill="#F4A8C3" />

      {/* Round Bunny Head */}
      <circle cx="50" cy="58" r="26" fill="#FFF8F6" stroke="#B0285F" strokeWidth="2" />

      {/* Cheeks */}
      <ellipse cx="36" cy="62" rx="4.5" ry="3" fill="#F4A8C3" opacity="0.9" />
      <ellipse cx="64" cy="62" rx="4.5" ry="3" fill="#F4A8C3" opacity="0.9" />

      {/* Eyes */}
      {mood === 'sleeping' ? (
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          <path d="M38 56C40 58 44 58 46 56" />
          <path d="M54 56C56 58 60 58 62 56" />
        </g>
      ) : (
        <g fill="#3A2530">
          <circle cx="41" cy="54" r="3" />
          <circle cx="40" cy="53" r="1" fill="#FFF8F6" />
          <circle cx="59" cy="54" r="3" />
          <circle cx="58" cy="53" r="1" fill="#FFF8F6" />
        </g>
      )}

      {/* Heart Nose */}
      <path
        d="M50 63C48 60 46 62 48 64L50 66L52 64C54 62 52 60 50 63Z"
        fill="#E27AA1"
      />

      {/* Whiskers */}
      <path d="M32 60L22 58M32 64L20 65" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M68 60L78 58M68 64L80 65" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
