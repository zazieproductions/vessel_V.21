import { useEffect, useState } from 'react';
import { useArchive } from '../context/ArchiveContext';

const LINES = [
  'VESSEL OS 0.9.4  //  DISC 7 OF 7',
  'mounting /dev/relic .............. ok',
  'checksum mismatched — proceeding anyway',
  'loading glyph table (4096) ....... ok',
  'calibrating iris / reticle ....... ok',
  'warming infrared plates .......... warm',
  'warning: ordinary photographs present',
  'symbolic integrity ............... 34%',
  'the archive noticed you.',
];

export function BootSequence() {
  const { booted, setBooted, seed } = useArchive();
  const [n, setN] = useState(0);

  useEffect(() => {
    if (booted) return;
    if (n >= LINES.length) {
      const t = window.setTimeout(() => setBooted(true), 500);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setN((x) => x + 1), 220 + (n % 3) * 80);
    return () => window.clearTimeout(t);
  }, [n, booted, setBooted]);

  if (booted) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black text-[var(--accent)]">
      <div className="w-[min(640px,92vw)] font-ui text-[12px] leading-6 tracking-wide">
        <div className="mb-6 font-display text-2xl tracking-[0.3em] text-[var(--paper)]">VESSEL</div>
        {LINES.slice(0, n).map((l) => (
          <div key={l}>{l}</div>
        ))}
        <div className="mt-4 text-[var(--accent2)]">
          SEED {seed} <span className="caret">█</span>
        </div>
        <button
          className="mt-8 border border-[var(--accent)] px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
          onClick={() => setBooted(true)}
        >
          skip rite
        </button>
      </div>
    </div>
  );
}
