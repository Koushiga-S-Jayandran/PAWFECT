import React, { useEffect, useRef, useState } from 'react';
import { RabbitMascot } from './RabbitMascot';
import { DogMascot } from './DogMascot';
import { CatMascot } from './CatMascot';

interface CompanionState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  facing: 1 | -1; // 1 = right, -1 = left
}

export const CursorCompanions: React.FC = () => {
  const [isPaused, setIsPaused] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pawfect_pause_companions') === 'true';
    } catch {
      return false;
    }
  });

  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isIdle, setIsIdle] = useState<boolean>(true);

  // References to DOM elements for hardware-accelerated transform updates
  const rabbitRef = useRef<HTMLDivElement>(null);
  const dogRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);

  // Physics state
  const mousePos = useRef<{ x: number; y: number; lastMoveTime: number }>({
    x: -100,
    y: -100,
    lastMoveTime: 0,
  });

  const rabbitState = useRef<CompanionState>({ x: -100, y: -100, vx: 0, vy: 0, facing: 1 });
  const dogState = useRef<CompanionState>({ x: -100, y: -100, vx: 0, vy: 0, facing: 1 });
  const catState = useRef<CompanionState>({ x: -100, y: -100, vx: 0, vy: 0, facing: 1 });

  const animFrameId = useRef<number | null>(null);

  // Check touch devices and reduced motion
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMediaChange);

    // Listen for custom event or storage change from footer toggle
    const handleStorageChange = () => {
      try {
        setIsPaused(localStorage.getItem('pawfect_pause_companions') === 'true');
      } catch {
        // no-op
      }
    };
    window.addEventListener('pawfect_toggle_companions', handleStorageChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('pawfect_toggle_companions', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (isPaused || isTouchDevice || prefersReducedMotion) {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      mousePos.current.lastMoveTime = performance.now();
      setIsIdle(false);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let isTabVisible = document.visibilityState === 'visible';
    const onVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Physics parameters for trailing group
    // Target offsets relative to cursor:
    // Rabbit: follows slightly behind and above (-24px, -18px)
    // Dog: follows middle (-46px, 12px)
    // Cat: follows rear (-70px, -6px)
    const updatePhysics = (
      state: CompanionState,
      targetX: number,
      targetY: number,
      stiffness: number,
      damping: number
    ) => {
      const dx = targetX - state.x;
      const dy = targetY - state.y;

      const ax = dx * stiffness;
      const ay = dy * stiffness;

      state.vx = (state.vx + ax) * damping;
      state.vy = (state.vy + ay) * damping;

      state.x += state.vx;
      state.y += state.vy;

      if (Math.abs(state.vx) > 0.4) {
        state.facing = state.vx > 0 ? 1 : -1;
      }
    };

    const loop = (timestamp: number) => {
      if (isTabVisible && mousePos.current.x > 0) {
        // Check idle status (cursor stationary for > 600ms)
        if (timestamp - mousePos.current.lastMoveTime > 600) {
          setIsIdle(true);
        }

        const mx = mousePos.current.x;
        const my = mousePos.current.y;

        // Companion 1: Rabbit (fastest, lightest spring)
        updatePhysics(rabbitState.current, mx - 28, my - 20, 0.09, 0.72);
        // Companion 2: Dog (moderate spring)
        updatePhysics(dogState.current, mx - 54, my + 8, 0.065, 0.78);
        // Companion 3: Cat (curious wanderer, looser spring)
        updatePhysics(catState.current, mx - 80, my - 12, 0.045, 0.82);

        // Apply hardware-accelerated transforms
        if (rabbitRef.current) {
          const { x, y, facing } = rabbitState.current;
          rabbitRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing})`;
        }
        if (dogRef.current) {
          const { x, y, facing } = dogState.current;
          dogRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing})`;
        }
        if (catRef.current) {
          const { x, y, facing } = catState.current;
          catRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${facing})`;
        }
      }

      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isPaused, isTouchDevice, prefersReducedMotion]);

  // If paused or touch device or prefers-reduced-motion, render static in corner as requested
  if (isPaused || isTouchDevice || prefersReducedMotion) {
    return (
      <aside
        aria-label="Pawfect Mascot Companions"
        className="fixed bottom-4 right-4 z-40 hidden md:flex items-center gap-1 bg-[#FFF8F6]/90 backdrop-blur-xs border border-[#F4A8C3]/50 rounded-full px-3 py-1 shadow-paw-sm pointer-events-auto"
      >
        <RabbitMascot size={26} mood="happy" />
        <DogMascot size={26} mood="happy" />
        <CatMascot size={26} mood="happy" />
      </aside>
    );
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {/* Rabbit Companion */}
      <div
        ref={rabbitRef}
        className={`absolute top-0 left-0 will-change-transform ${isIdle ? 'animate-bounce [animation-duration:2.5s]' : ''}`}
        style={{ transform: 'translate3d(-200px, -200px, 0)' }}
      >
        <RabbitMascot size={32} mood={isIdle ? 'sleeping' : 'happy'} />
      </div>

      {/* Dog Companion */}
      <div
        ref={dogRef}
        className={`absolute top-0 left-0 will-change-transform ${isIdle ? 'animate-pulse [animation-duration:3s]' : ''}`}
        style={{ transform: 'translate3d(-200px, -200px, 0)' }}
      >
        <DogMascot size={34} mood={isIdle ? 'happy' : 'celebrating'} />
      </div>

      {/* Cat Companion */}
      <div
        ref={catRef}
        className="absolute top-0 left-0 will-change-transform"
        style={{ transform: 'translate3d(-200px, -200px, 0)' }}
      >
        <CatMascot size={30} mood={isIdle ? 'sleeping' : 'proud'} />
      </div>
    </div>
  );
};
