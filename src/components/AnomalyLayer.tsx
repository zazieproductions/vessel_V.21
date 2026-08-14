import { useEffect, useMemo, useRef } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { rngFrom } from '../lib/rng';

export function AnomalyLayer() {
  const { seed, reduced, frozen, openRoom } = useArchive();
  const moonRef = useRef<HTMLButtonElement>(null);
  const bits = useMemo(() => {
    const rand = rngFrom(seed, 'anomalies');
    return {
      moonX: 8 + rand() * 70,
      eyeY: 1200 + rand() * 4000,
      skelY: 2800 + rand() * 3500,
    };
  }, [seed]);

  useEffect(() => {
    const onScroll = () => {
      if (moonRef.current) {
        moonRef.current.style.transform = `translateY(${window.scrollY * -0.12}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[8]" style={{ height: 0 }}>
      <button
        ref={moonRef}
        className={`pointer-events-auto fixed right-[8%] top-[12%] h-28 w-28 overflow-hidden rounded-full border border-[var(--metal)]/40 ${frozen ? '' : 'spin-slow'}`}
        onClick={(e) => {
          e.stopPropagation();
          openRoom('lunar');
        }}
        aria-label="lunar annex"
      >
        <img src="/images/gen/wrong-moon.png" alt="" className="h-full w-full object-cover" />
      </button>

      <button
        className="pointer-events-auto absolute left-[4%] w-[min(42vw,320px)] overflow-hidden opacity-90 mix-blend-screen"
        style={{ top: bits.eyeY, transform: `translateY(${scrollY * -0.05}px)` }}
        onClick={(e) => {
          e.stopPropagation();
          openRoom('eye');
        }}
        aria-label="the eye"
      >
        <img src="/images/gen/eye-cathedral.png" alt="gigantic eye" className="w-full pulse-slow" />
      </button>

      <button
        className="pointer-events-auto absolute right-[6%] w-[min(28vw,220px)] mix-blend-lighten"
        style={{ top: bits.skelY }}
        onClick={(e) => {
          e.stopPropagation();
          openRoom('vessel');
        }}
        aria-label="glass skeleton"
      >
        <img src="/images/gen/skeleton-glass.png" alt="translucent skeleton" className="floaty w-full" />
      </button>
    </div>
  );
}
