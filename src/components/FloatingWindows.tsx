import { useEffect, useMemo, useRef, useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { CATALOG } from '../lib/catalog';
import { LOG_LINES, WINDOW_TITLES } from '../lib/lexicon';
import { rngFrom } from '../lib/rng';
import type { WinSpec } from '../lib/types';

function makeWindows(seed: string): WinSpec[] {
  const rand = rngFrom(seed, 'windows');
  const kinds: WinSpec['kind'][] = ['feed', 'log', 'viewer', 'warn', 'map', 'diag'];
  return kinds.map((kind, i) => ({
    id: `win-${kind}`,
    title: WINDOW_TITLES[i % WINDOW_TITLES.length],
    kind,
    x: 24 + ((i * 173) % 56) * (typeof window === 'undefined' ? 6 : Math.max(4, (window.innerWidth - 300) / 60)),
    y: 86 + ((i * 89) % 40) * (typeof window === 'undefined' ? 4 : Math.max(3, (window.innerHeight - 260) / 50)),
    w: kind === 'log' ? 280 : kind === 'feed' ? 220 : 260,
    h: kind === 'warn' ? 120 : kind === 'log' ? 200 : 180,
    src: CATALOG[Math.floor(rand() * CATALOG.length)].src,
    z: 20 + i,
  }));
}

export function FloatingWindows() {
  const { seed, log, diagnostic, theme } = useArchive();
  const base = useMemo(() => makeWindows(seed), [seed]);
  const [wins, setWins] = useState(base);
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const zTop = useRef(40);

  useEffect(() => {
    setWins(base);
    setClosed({});
  }, [base]);

  const drag = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const onDown = (e: React.PointerEvent, w: WinSpec) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id: w.id, dx: e.clientX - w.x, dy: e.clientY - w.y };
    zTop.current += 1;
    setWins((prev) => prev.map((x) => (x.id === w.id ? { ...x, z: zTop.current } : x)));
  };

  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const { id, dx, dy } = drag.current;
    setWins((prev) => prev.map((x) => (x.id === id ? { ...x, x: e.clientX - dx, y: e.clientY - dy } : x)));
  };

  const onUp = () => {
    drag.current = null;
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-[45]">
      {wins.map((w) => {
        if (closed[w.id]) return null;
        if (w.kind === 'diag' && !diagnostic) return null;
        return (
          <div
            key={w.id}
            data-win
            className="pointer-events-auto absolute win95 text-[11px]"
            style={{ left: w.x, top: w.y, width: w.w, zIndex: w.z }}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="win95-bar flex cursor-none items-center justify-between px-1 py-0.5 text-[10px] tracking-widest"
              onPointerDown={(e) => onDown(e, w)}
            >
              <span className="truncate">{w.title}</span>
              <button
                className="ml-2 border border-[#2a2040] bg-[#d4cfc2] px-1 text-black"
                onClick={() => setClosed((c) => ({ ...c, [w.id]: true }))}
              >
                ×
              </button>
            </div>
            <div className="max-h-[220px] overflow-hidden bg-[#1a1814] p-1 text-[var(--paper)]">
              {w.kind === 'feed' && (
                <div className="relative">
                  <img src={w.src} alt="" className="h-36 w-full object-cover" />
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 text-[9px] text-[var(--accent)]">
                    LIVE · FRAME {Math.floor((Date.now() / 80) % 4096)}
                  </div>
                </div>
              )}
              {w.kind === 'log' && (
                <div className="h-44 overflow-hidden font-ui text-[10px] leading-4 text-[var(--accent)]">
                  {[...LOG_LINES, ...log.slice(-8)].slice(-14).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  <span className="caret">█</span>
                </div>
              )}
              {w.kind === 'viewer' && (
                <div className="grid grid-cols-3 gap-0.5">
                  {CATALOG.slice(0, 9).map((c) => (
                    <img key={c.id} src={c.src} alt="" className="h-14 w-full object-cover" />
                  ))}
                </div>
              )}
              {w.kind === 'warn' && (
                <div>
                  <div className="warn-stripe mb-2 h-3" />
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--warn)]">
                    SYMBOLIC INTEGRITY DEGRADED. DO NOT INDEX THE MOON. OBSERVER IS INSIDE THE FRAME.
                  </p>
                </div>
              )}
              {w.kind === 'map' && (
                <div className="relative">
                  <img src="/images/gen/impossible-map.png" alt="" className="h-36 w-full object-cover" />
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 60">
                    <circle cx="42" cy="28" r="3" fill={theme.warn} />
                    <path d="M10 50 Q40 10 90 30" stroke={theme.accent} fill="none" strokeWidth="0.6" />
                  </svg>
                </div>
              )}
              {w.kind === 'diag' && (
                <pre className="font-ui text-[9px] leading-4 text-[var(--accent2)]">
{`SEED  ${seed}
THEME ${theme.id}
PID   vessel/${theme.codename}
HEAP  ${Math.round(performance.now())}
IRIS  tracking
`}
                </pre>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
