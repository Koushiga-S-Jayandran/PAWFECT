import React from 'react';
import type { MascotProps } from './types';

export const CatMascot: React.FC<MascotProps> = ({
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
      aria-label={`Pawfect Kitty Mascot (${mood})`}
      role="img"
    >
      {/* Left Ear */}
      <path d="M28 44L22 22C21 20 24 19 26 20L44 32" fill="#FDEBF0" stroke="#B0285F" strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 36L25 25L37 32" fill="#F4A8C3" />

      {/* Right Ear */}
      <path d="M72 44L78 22C79 20 76 19 74 20L56 32" fill="#FDEBF0" stroke="#B0285F" strokeWidth="2" strokeLinejoin="round" />
      <path d="M72 36L75 25L63 32" fill="#F4A8C3" />

      {/* Head */}
      <circle cx="50" cy="54" r="26" fill="#FFF8F6" stroke="#B0285F" strokeWidth="2" />

      {/* Tiny Cheeks */}
      <ellipse cx="36" cy="58" rx="4.5" ry="3" fill="#F4A8C3" opacity="0.9" />
      <ellipse cx="64" cy="58" rx="4.5" ry="3" fill="#F4A8C3" opacity="0.9" />

      {/* Eyes */}
      {mood === 'sleeping' ? (
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          <path d="M38 52C40 54 44 54 46 52" />
          <path d="M54 52C56 54 60 54 62 52" />
        </g>
      ) : (
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          <path d="M38 51C40 48 44 48 46 51" />
          <path d="M54 51C56 48 60 48 62 51" />
        </g>
      )}

      {/* Nose and Mouth */}
      <path d="M48 56L52 56L50 58Z" fill="#E27AA1" stroke="#B0285F" strokeWidth="1" />
      <path d="M47 60C49 61 50 60 50 59C50 60 51 61 53 60" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />

      {/* Whiskers */}
      <path d="M28 54L18 53M28 58L16 59" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M72 54L82 53M72 58L84 59" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};
