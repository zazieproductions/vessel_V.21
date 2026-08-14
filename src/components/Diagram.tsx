import type { DiagramSpec } from '../lib/types';

export function Diagram({ d, color }: { d: DiagramSpec; color: string }) {
  return (
    <svg
      className="pointer-events-none absolute opacity-40 mix-blend-screen"
      style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size }}
      viewBox="0 0 120 120"
      fill="none"
      stroke={color}
      strokeWidth="0.7"
    >
      {d.kind === 0 && <Vesica />}
      {d.kind === 1 && <Orbitals />}
      {d.kind === 2 && <Lattice />}
      {d.kind === 3 && <AnatomyMap />}
      {d.kind === 4 && <StarChart />}
      {d.kind === 5 && <CircuitSeal />}
    </svg>
  );
}

function Vesica() {
  return (
    <>
      <circle cx="45" cy="60" r="34" />
      <circle cx="75" cy="60" r="34" />
      <path d="M60 28 V92" strokeDasharray="2 3" />
      <text x="4" y="12" fill="currentColor" stroke="none" fontSize="6" fontFamily="monospace">
        VESICA // 2
      </text>
    </>
  );
}

function Orbitals() {
  return (
    <>
      <ellipse cx="60" cy="60" rx="50" ry="16" />
      <ellipse cx="60" cy="60" rx="50" ry="16" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="50" ry="16" transform="rotate(120 60 60)" />
      <circle cx="60" cy="60" r="6" fill="currentColor" stroke="none" opacity="0.5" />
      <circle cx="110" cy="60" r="3" />
      <circle cx="35" cy="18" r="3" />
    </>
  );
}

function Lattice() {
  const lines = [20, 40, 60, 80, 100];
  return (
    <>
      {lines.map((v) => (
        <g key={v}>
          <line x1={v} y1="10" x2={v} y2="110" />
          <line x1="10" y1={v} x2="110" y2={v} />
        </g>
      ))}
      <circle cx="60" cy="60" r="18" />
      <path d="M20 20 L100 100 M100 20 L20 100" />
    </>
  );
}

function AnatomyMap() {
  return (
    <>
      <ellipse cx="60" cy="34" rx="16" ry="20" />
      <path d="M60 54 L60 92 M60 70 L40 100 M60 70 L80 100 M48 58 L28 78 M72 58 L92 78" />
      <circle cx="54" cy="30" r="2" />
      <circle cx="66" cy="30" r="2" />
      <path d="M52 40 Q60 46 68 40" />
      <text x="84" y="34" fill="currentColor" stroke="none" fontSize="5" fontFamily="monospace">
        IRIS
      </text>
      <text x="86" y="102" fill="currentColor" stroke="none" fontSize="5" fontFamily="monospace">
        ROOT
      </text>
    </>
  );
}

function StarChart() {
  const pts = [
    [20, 24], [40, 18], [70, 22], [96, 30], [18, 60], [50, 55], [88, 62], [30, 90], [64, 86], [100, 80],
  ];
  return (
    <>
      <circle cx="60" cy="60" r="52" strokeDasharray="1 4" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="1.4" fill="currentColor" stroke="none" />
          {i < pts.length - 1 && <line x1={x} y1={y} x2={pts[i + 1][0]} y2={pts[i + 1][1]} opacity="0.5" />}
        </g>
      ))}
    </>
  );
}

function CircuitSeal() {
  return (
    <>
      <rect x="18" y="18" width="84" height="84" />
      <circle cx="60" cy="60" r="22" />
      <path d="M18 40 H42 M78 40 H102 M18 80 H42 M78 80 H102 M40 18 V42 M80 18 V42 M40 78 V102 M80 78 V102" />
      <rect x="52" y="52" width="16" height="16" />
    </>
  );
}
