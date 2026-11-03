import React from 'react';
import type { MascotProps } from './types';

export const BowCat: React.FC<MascotProps> = ({
  size = 120,
  mood = 'happy',
  className = '',
  animate = false,
}) => {
  // Outline dark pink #B0285F, fills blush/cream/soft pink, cheeks #F4A8C3
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none overflow-visible ${className} ${animate ? 'hover:scale-105 transition-transform duration-200' : ''}`}
      aria-label={`Pawfect Cat with Bow (${mood})`}
      role="img"
    >
      {/* Celebrating party hat or confetti */}
      {mood === 'celebrating' && (
        <g>
          <path d="M72 16L88 16L80 2Z" fill="#E27AA1" stroke="#B0285F" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="80" cy="2" r="3.5" fill="#FFF8F6" stroke="#B0285F" strokeWidth="1.5" />
          <circle cx="56" cy="28" r="2.5" fill="#E6A23C" />
          <circle cx="106" cy="24" r="2.5" fill="#E27AA1" />
          <circle cx="48" cy="48" r="2" fill="#4A90E2" />
          <circle cx="114" cy="44" r="2" fill="#4E8752" />
        </g>
      )}

      {/* Cat Ears */}
      <path
        d="M50 64L38 32C37 30 40 28 42 29L68 46"
        fill="#FDEBF0"
        stroke="#B0285F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Left Ear Inner */}
      <path d="M47 54L41 36L58 46" fill="#F4A8C3" />

      {/* Right Ear */}
      <path
        d="M110 64L122 32C123 30 120 28 118 29L92 46"
        fill="#FDEBF0"
        stroke="#B0285F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Ear Inner */}
      <path d="M113 54L119 36L102 46" fill="#F4A8C3" />

      {/* Cat Head */}
      <path
        d="M44 80C44 54 60 44 80 44C100 44 116 54 116 80C116 104 100 112 80 112C60 112 44 104 44 80Z"
        fill="#FFF8F6"
        stroke="#B0285F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Tiny Blush Cheeks */}
      <ellipse cx="58" cy="85" rx="5.5" ry="3.5" fill="#F4A8C3" opacity="0.85" />
      <ellipse cx="102" cy="85" rx="5.5" ry="3.5" fill="#F4A8C3" opacity="0.85" />

      {/* Eyes based on mood */}
      {mood === 'sleeping' ? (
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          <path d="M60 76C63 79 67 79 70 76" />
          <path d="M90 76C93 79 97 79 100 76" />
          {/* Zzz */}
          <text x="115" y="55" fill="#E27AA1" fontSize="13" fontWeight="bold">z</text>
          <text x="125" y="45" fill="#E27AA1" fontSize="15" fontWeight="bold">Z</text>
        </g>
      ) : mood === 'hungry' ? (
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          <circle cx="65" cy="74" r="5" fill="#3A2530" />
          <circle cx="63" cy="72" r="1.8" fill="#FFF8F6" />
          <circle cx="95" cy="74" r="5" fill="#3A2530" />
          <circle cx="93" cy="72" r="1.8" fill="#FFF8F6" />
          {/* Sparkle tears of hunger */}
          <path d="M57 82Q55 86 57 88" stroke="#4A90E2" strokeWidth="1.5" />
        </g>
      ) : mood === 'proud' ? (
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          {/* Wink on right, curved happy eye on left */}
          <path d="M60 75C63 72 67 72 70 75" />
          <circle cx="95" cy="74" r="4.5" fill="#3A2530" />
          <circle cx="93" cy="72" r="1.5" fill="#FFF8F6" />
        </g>
      ) : (
        /* Happy / Celebrating Eyes */
        <g stroke="#B0285F" strokeWidth="2" strokeLinecap="round">
          <path d="M59 75C62 70 68 70 71 75" />
          <path d="M89 75C92 70 98 70 101 75" />
        </g>
      )}

      {/* Tiny Nose */}
      <path d="M78 81L82 81L80 84Z" fill="#E27AA1" stroke="#B0285F" strokeWidth="1" strokeLinejoin="round" />

      {/* Mouth */}
      {mood === 'hungry' ? (
        <path d="M76 86C78 90 82 90 84 86" stroke="#B0285F" strokeWidth="2" strokeLinecap="round" fill="#F4A8C3" />
      ) : (
        <path
          d="M74 86C77 88 80 86 80 84C80 86 83 88 86 86"
          stroke="#B0285F"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}

      {/* Whiskers */}
      <path d="M46 78L34 76M46 84L32 85" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M114 78L126 76M114 84L128 85" stroke="#B0285F" strokeWidth="1.5" strokeLinecap="round" />

      {/* Signature Cute Ribbon Bow under Chin */}
      <g>
        {/* Bow Knot */}
        <circle cx="80" cy="112" r="5" fill="#B0285F" stroke="#7E1B43" strokeWidth="1.5" />
        {/* Left Bow Loop */}
        <path
          d="M77 112C72 105 60 106 63 114C65 120 74 116 77 113"
          fill="#E27AA1"
          stroke="#B0285F"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Right Bow Loop */}
        <path
          d="M83 112C88 105 100 106 97 114C95 120 86 116 83 113"
          fill="#E27AA1"
          stroke="#B0285F"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Bow Tails */}
        <path d="M77 116L72 127L76 125L80 120" fill="#E27AA1" stroke="#B0285F" strokeWidth="1.5" />
        <path d="M83 116L88 127L84 125L80 120" fill="#E27AA1" stroke="#B0285F" strokeWidth="1.5" />
      </g>
    </svg>
  );
};
