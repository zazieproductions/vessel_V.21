import type { WarningSpec } from '../lib/types';

export function WarningLabel({ w }: { w: WarningSpec }) {
  const tone =
    w.level === 'forbid'
      ? 'bg-black text-[var(--warn)] border-[var(--warn)]'
      : w.level === 'caution'
        ? 'bg-[var(--warn)] text-black border-black'
        : 'bg-[var(--paper)] text-black border-black';

  return (
    <div
      className={`pointer-events-none absolute z-20 border px-2 py-1 text-[10px] tracking-[0.18em] uppercase ${tone}`}
      style={{ left: `${w.x}%`, top: `${w.y}%`, transform: `rotate(${w.level === 'forbid' ? -3 : 2}deg)` }}
    >
      <div className="warn-stripe h-1.5 w-full mb-1" />
      {w.text}
    </div>
  );
}
