import type { GlyphSpec } from '../lib/types';

export function Glyph({ g, accent }: { g: GlyphSpec; accent: string }) {
  const s = g.size;
  return (
    <svg
      className="pointer-events-none absolute opacity-70"
      style={{
        left: `${g.x}%`,
        top: `${g.y}%`,
        width: s,
        height: s,
        transform: `rotate(${g.rot}deg)`,
        filter: 'url(#softGlow)',
      }}
      viewBox="0 0 64 64"
      fill="none"
      stroke={accent}
      strokeWidth="1.1"
    >
      {g.kind === 0 && (
        <>
          <circle cx="32" cy="32" r="26" />
          <circle cx="32" cy="32" r="10" />
          <path d="M32 4 L36 24 L56 32 L36 40 L32 60 L28 40 L8 32 L28 24 Z" />
        </>
      )}
      {g.kind === 1 && (
        <>
          <polygon points="32,6 58,54 6,54" />
          <polygon points="32,58 6,10 58,10" />
        </>
      )}
      {g.kind === 2 && (
        <>
          <circle cx="32" cy="32" r="22" />
          <path d="M32 10 A22 22 0 0 1 32 54 A14 14 0 0 0 32 10" fill={accent} opacity="0.25" stroke="none" />
          <circle cx="32" cy="32" r="3" fill={accent} stroke="none" />
        </>
      )}
      {g.kind === 3 && (
        <>
          <rect x="10" y="10" width="44" height="44" />
          <path d="M10 32 H54 M32 10 V54 M16 16 L48 48 M48 16 L16 48" />
        </>
      )}
      {g.kind === 4 && (
        <>
          <path d="M32 4 L40 24 L60 24 L44 36 L50 56 L32 44 L14 56 L20 36 L4 24 L24 24 Z" />
          <circle cx="32" cy="32" r="6" />
        </>
      )}
      {g.kind === 5 && (
        <>
          <ellipse cx="32" cy="32" rx="26" ry="12" />
          <ellipse cx="32" cy="32" rx="12" ry="26" />
          <circle cx="32" cy="32" r="20" />
        </>
      )}
      {g.kind === 6 && (
        <>
          <path d="M8 48 Q32 4 56 48" />
          <path d="M12 40 H52" />
          <circle cx="32" cy="28" r="6" />
          <path d="M20 48 L32 20 L44 48" />
        </>
      )}
      {g.kind === 7 && (
        <>
          <circle cx="32" cy="32" r="24" strokeDasharray="2 4" />
          <path d="M32 8 V56 M8 32 H56" />
          <circle cx="32" cy="18" r="3" />
          <circle cx="46" cy="32" r="3" />
          <circle cx="32" cy="46" r="3" />
          <circle cx="18" cy="32" r="3" />
        </>
      )}
    </svg>
  );
}

export function SigilMark({ size = 48, kind = 0, color = 'currentColor' }: { size?: number; kind?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.2">
      <circle cx="32" cy="32" r="28" />
      {kind % 2 === 0 ? (
        <path d="M32 6 L38 26 L58 32 L38 38 L32 58 L26 38 L6 32 L26 26 Z" />
      ) : (
        <polygon points="32,8 56,50 8,50" />
      )}
      <circle cx="32" cy="32" r="5" fill={color} stroke="none" />
    </svg>
  );
}
