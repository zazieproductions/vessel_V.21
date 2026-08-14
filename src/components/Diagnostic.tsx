import { useEffect, useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { pointer, scroll } from '../lib/pointer';

export function Diagnostic() {
  const { diagnostic, seed, theme, frozen, log } = useArchive();
  const [pt, setPt] = useState({ x: 0, y: 0, vx: 0, vy: 0, sy: 0 });
  useEffect(() => {
    if (!diagnostic) return;
    const id = window.setInterval(() => setPt({ ...pointer, sy: scroll.y }), 80);
    return () => window.clearInterval(id);
  }, [diagnostic]);
  if (!diagnostic) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[50] diag-grid opacity-40" aria-hidden>
      <div className="pointer-events-none absolute bottom-16 left-3 max-w-sm border border-[var(--accent2)] bg-black/70 p-3 font-ui text-[10px] leading-4 text-[var(--accent2)] opacity-100">
        <div>DIAGNOSTIC / VESSEL</div>
        <div>SEED {seed}</div>
        <div>THEME {theme.id} · {theme.name}</div>
        <div>
          PTR {pt.x.toFixed(1)} {pt.y.toFixed(1)} Δ {pt.vx.toFixed(1)},{pt.vy.toFixed(1)}
        </div>
        <div>SCROLL {pt.sy.toFixed(0)} · CLOCK {frozen ? 'ARRESTED' : 'LIVE'}</div>
        <div className="mt-2 opacity-80">
          {log.slice(-6).map((l, i) => (
            <div key={i}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
