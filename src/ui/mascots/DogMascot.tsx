import React from 'react';
import type { MascotProps } from './types';

export const DogMascot: React.FC<MascotProps> = ({
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
      aria-label={`Pawfect Puppy Mascot (${mood})`}
      role="img"
    >
      {/* Floppy Left Ear */}
      <path
        d="M26 38C18 38 14 50 16 64C17 72 24 74 28 66C31 60 30 45 26 38Z"
        fill="#E27AA1"
        stroke="#B0285F"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Floppy Right Ear */}
      <path
        d="M74 38C82 38 86 50 84 64C83 72 76 74 72 66C69 60 70 45 74 38Z"
        fill="#E27AA1"
        stroke="#B0285F"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Dog Head */}
      <circle
        cx="50"
        cy="52"
        r="28"
        fill="#FFF8F6"
        stroke="#B0285F"
        strokeWidth="2"
      />

      {/* Warm Eyepatch or Cheek Spot */}
      <path
        d="M32 46C32 40 37 36 43 38C48 40 48 48 45 52C42 56 32 54 32 46Z"
        fill="#FDEBF0"
      />

      {/* Tiny Blush Cheeks */}
      <ellipse cx="34" cy="56" rx="4.5" ry="3" fill="#F4A8C3" opacity="0.9" />
      <ellipse cx="66" cy="56" rx="4.5" ry="3" fill="#F4A8C3" opacity="0.9" />

      {/* Eyes */}
      {mood === 'sleeping' ? (
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          <path d="M36 50C38 52 42 52 44 50" />
          <path d="M56 50C58 52 62 52 64 50" />
        </g>
      ) : (
        <g fill="#3A2530">
          <circle cx="40" cy="48" r="3.5" />
          <circle cx="39" cy="47" r="1.2" fill="#FFF8F6" />
          <circle cx="60" cy="48" r="3.5" />
          <circle cx="59" cy="47" r="1.2" fill="#FFF8F6" />
        </g>
      )}

      {/* Snout and Nose */}
      <ellipse cx="50" cy="56" rx="8" ry="6" fill="#FDEBF0" />
      <path
        d="M47 54C47 53 53 53 53 54C53 56 51 58 50 58C49 58 47 56 47 54Z"
        fill="#B0285F"
      />

      {/* Happy Tongue or Smile */}
      {mood === 'happy' || mood === 'celebrating' ? (
        <g>
          <path d="M48 58C48 62 52 62 52 58" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M48 60C48 64 52 64 52 60Z" fill="#F4A8C3" stroke="#B0285F" strokeWidth="1" />
        </g>
      ) : (
        <path d="M47 58C48 60 52 60 53 58" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
};
