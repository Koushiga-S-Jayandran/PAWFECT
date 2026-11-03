/**
 * Types and Moods for Pawfect Inline Mascot SVG Illustrations
 */

export type MascotMood = 'happy' | 'celebrating' | 'sleeping' | 'hungry' | 'proud';

export interface MascotProps {
  size?: number;
  mood?: MascotMood;
  className?: string;
  animate?: boolean;
}
