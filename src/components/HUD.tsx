import { useEffect, useState } from 'react';
import { useArchive } from '../context/ArchiveContext';
import { pointer, scroll } from '../lib/pointer';

export function HUD() {
  const {
    seed,
    theme,
    frozen,
    diagnostic,
    mutateTheme,
    regenerate,
    toggleFreeze,
    toggleDiagnostic,
  } = useArchive();
  const [pt, setPt] = useState({ x: 0, y: 0, sy: 0 });
  useEffect(() => {
    const id = window.setInterval(() => setPt({ x: pointer.x, y: pointer.y, sy: scroll.y }), 140);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div data-hud className="pointer-events-none fixed inset-0 z-[60]">
      <div className="pointer-events-auto absolute left-3 top-3 max-w-[70vw] border border-[var(--fg)]/30 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.22em] backdrop-blur-[2px]">
        <div className="font-display text-[13px] tracking-[0.28em] text-[var(--fg)]">VESSEL ARCHIVE</div>
        <div className="text-[var(--paper)]/70">
          {theme.codename} · SEED {seed}
        </div>
      </div>

      <div className="pointer-events-auto absolute right-3 top-3 flex flex-wrap justify-end gap-1 text-[9px] tracking-[0.18em]">
        <HudBtn onClick={mutateTheme} k="M" label="mutate" />
        <HudBtn onClick={regenerate} k="R" label="regen" />
        <HudBtn onClick={toggleFreeze} k="S" label={frozen ? 'thaw' : 'freeze'} hot={frozen} />
        <HudBtn onClick={toggleDiagnostic} k="D" label="diag" hot={diagnostic} />
      </div>

      <div className="absolute bottom-3 left-3 font-ui text-[9px] uppercase tracking-[0.2em] text-[var(--paper)]/55">
        DEPTH {Math.round(pt.sy)} · RETICLE {Math.round(pt.x)},{Math.round(pt.y)}
      </div>
      <div className="absolute bottom-3 right-3 text-right font-ui text-[9px] uppercase tracking-[0.2em] text-[var(--paper)]/55">
        click void to inscribe
        <br />
        esc seals rooms
      </div>
    </div>
  );
}

function HudBtn({
  onClick,
  k,
  label,
  hot,
}: {
  onClick: () => void;
  k: string;
  label: string;
  hot?: boolean;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`border px-2 py-1 ${hot ? 'border-[var(--warn)] bg-[var(--warn)] text-black' : 'border-[var(--fg)]/40 bg-black/50 text-[var(--fg)]'}`}
    >
      <span className="text-[var(--accent2)]">{k}</span> {label}
    </button>
  );
}
