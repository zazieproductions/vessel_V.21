import { useArchive } from '../context/ArchiveContext';
import { SigilMark } from './Glyph';

export function SpawnLayer() {
  const { spawns, theme } = useArchive();

  return (
    <div className="pointer-events-none fixed inset-0 z-[55]" aria-hidden>
      {spawns.map((s) => {
        if (s.kind === 'ripple') {
          return (
            <div
              key={s.id}
              className="absolute rounded-full border border-[var(--accent2)]"
              style={{
                left: s.x,
                top: s.y,
                width: 40,
                height: 40,
                marginLeft: -20,
                marginTop: -20,
                animation: 'ripple 1.6s ease-out forwards',
              }}
            />
          );
        }
        if (s.kind === 'sigil') {
          return (
            <div
              key={s.id}
              className="absolute"
              style={{ left: s.x - 28, top: s.y - 28, animation: 'sigilIn 1.8s ease-out forwards' }}
            >
              <SigilMark size={56} kind={Math.floor(s.x) % 2} color={theme.accent} />
            </div>
          );
        }
        if (s.kind === 'text') {
          return (
            <div
              key={s.id}
              className="absolute max-w-xs font-ui text-[11px] uppercase tracking-[0.18em] text-[var(--paper)]"
              style={{
                left: s.x + 10,
                top: s.y - 8,
                animation: 'sigilIn 2.1s ease-out forwards',
              }}
            >
              {s.payload}
            </div>
          );
        }
        return (
          <div key={s.id} className="absolute" style={{ left: s.x, top: s.y }}>
            {(s.srcs || []).map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="absolute h-16 w-16 object-cover bezel"
                style={{
                  ['--dx' as string]: `${Math.cos((i / 5) * Math.PI * 2) * 90}px`,
                  ['--dy' as string]: `${Math.sin((i / 5) * Math.PI * 2) * 70}px`,
                  animation: 'swarm 1.5s ease-out forwards',
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
