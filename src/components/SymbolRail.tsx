import { useArchive } from '../context/ArchiveContext';
import type { RoomId } from '../lib/types';

const ROOMS: { id: RoomId; mark: string }[] = [
  { id: 'eye', mark: '◎' },
  { id: 'vessel', mark: '⌬' },
  { id: 'lunar', mark: '☽' },
  { id: 'burning', mark: '✶' },
  { id: 'micro', mark: '⏣' },
  { id: 'nave', mark: '⌂' },
  { id: 'room0', mark: '□' },
];

export function SymbolRail() {
  const { openRoom, room } = useArchive();
  return (
    <nav
      data-hud
      className="pointer-events-auto fixed left-2 top-1/2 z-[60] hidden -translate-y-1/2 flex-col gap-2 md:flex"
    >
      {ROOMS.map((r) => (
        <button
          key={r.id}
          onClick={(e) => {
            e.stopPropagation();
            openRoom(r.id);
          }}
          className={`h-8 w-8 border text-[14px] ${
            room === r.id
              ? 'border-[var(--warn)] bg-[var(--warn)] text-black'
              : 'border-[var(--fg)]/30 bg-black/40 text-[var(--fg)]'
          }`}
          aria-label={r.id}
        >
          {r.mark}
        </button>
      ))}
    </nav>
  );
}
