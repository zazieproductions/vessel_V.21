import { CATALOG, NORMALS, RARES } from './catalog';
import { FRAGMENTS, SHORT, WARNINGS, accessionOf } from './lexicon';
import { chance, irange, pick, range, rngFrom, type RNG } from './rng';
import type {
  AnomalyKind,
  Behavior,
  ClusterLayout,
  ClusterSpec,
  DiagramSpec,
  GlyphSpec,
  ImageNode,
  Treatment,
  WarningSpec,
} from './types';

const LAYOUTS: ClusterLayout[] = [
  'scatter', 'spiral', 'drawer', 'nave', 'strip', 'stack', 'constellation', 'cabinet', 'wound', 'oriel',
];

const BEHAVIORS: Behavior[] = [
  'melt', 'split', 'reveal', 'rotate', 'duplicate', 'glitch', 'pulse', 'invert', 'burn', 'orbit',
];

const BLENDS = [
  'normal', 'screen', 'multiply', 'overlay', 'hard-light', 'soft-light', 'lighten', 'color-dodge', 'difference',
];

const MASKS = ['none', 'vignette', 'slats', 'circle', 'jagged', 'film', 'iris'];

function treatment(rand: RNG): Treatment {
  return {
    hue: range(rand, -40, 80),
    sat: range(rand, 0.7, 1.7),
    contrast: range(rand, 0.85, 1.45),
    invert: chance(rand, 0.08) ? range(rand, 0.4, 1) : 0,
    blend: chance(rand, 0.35) ? pick(rand, BLENDS) : 'normal',
    mask: chance(rand, 0.28) ? pick(rand, MASKS) : 'none',
    opacity: range(rand, 0.78, 1),
    flipX: chance(rand, 0.12),
    flipY: chance(rand, 0.04),
    grain: range(rand, 0, 0.45),
  };
}

function caption(rand: RNG, kind: string): string {
  if (chance(rand, 0.4)) return pick(rand, FRAGMENTS);
  return `${pick(rand, SHORT)} // ${kind.toUpperCase()} // ${pick(rand, SHORT)}`;
}

function maybeAnomaly(rand: RNG, index: number): AnomalyKind | undefined {
  if (index > 0 && index % 7 === 0) {
    return pick(rand, ['eye', 'skeleton', 'moon', 'burn', 'stock', 'portal']);
  }
  if (chance(rand, 0.07)) {
    return pick(rand, ['eye', 'skeleton', 'moon', 'burn', 'stock', 'portal']);
  }
  return undefined;
}

function place(layout: ClusterLayout, i: number, n: number, rand: RNG): { x: number; y: number; w: number; rot: number; z: number } {
  const t = n <= 1 ? 0 : i / (n - 1);
  switch (layout) {
    case 'spiral': {
      const ang = t * Math.PI * 4 + rand() * 0.2;
      const rad = 8 + t * 38;
      return {
        x: 50 + Math.cos(ang) * rad,
        y: 18 + t * 64,
        w: range(rand, 14, 28),
        rot: range(rand, -18, 18),
        z: i,
      };
    }
    case 'drawer': {
      const cols = 4;
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        x: 8 + col * 23 + range(rand, -1.5, 1.5),
        y: 14 + row * 28 + range(rand, -1, 1),
        w: range(rand, 18, 22),
        rot: range(rand, -2, 2),
        z: i,
      };
    }
    case 'nave': {
      const side = i % 2 === 0 ? 8 : 62;
      return {
        x: side + range(rand, 0, 8),
        y: 8 + t * 78,
        w: range(rand, 22, 34),
        rot: range(rand, -6, 6),
        z: i,
      };
    }
    case 'strip': {
      return {
        x: 4 + t * 78,
        y: 28 + Math.sin(t * Math.PI * 2) * 18 + range(rand, -4, 4),
        w: range(rand, 16, 26),
        rot: range(rand, -12, 12),
        z: i,
      };
    }
    case 'stack': {
      return {
        x: 28 + range(rand, -16, 16),
        y: 10 + t * 70,
        w: range(rand, 30, 48),
        rot: range(rand, -8, 8),
        z: i,
      };
    }
    case 'constellation': {
      return {
        x: range(rand, 4, 82),
        y: range(rand, 6, 84),
        w: range(rand, 8, 18),
        rot: range(rand, -20, 20),
        z: i,
      };
    }
    case 'cabinet': {
      const col = i % 3;
      return {
        x: 6 + col * 31,
        y: 10 + Math.floor(i / 3) * 30 + range(rand, -2, 2),
        w: range(rand, 24, 30),
        rot: 0,
        z: i,
      };
    }
    case 'wound': {
      return {
        x: 38 + Math.cos(t * Math.PI * 3) * 28 + range(rand, -4, 4),
        y: 12 + t * 72,
        w: range(rand, 18, 36),
        rot: range(rand, -25, 25),
        z: 20 - i,
      };
    }
    case 'oriel': {
      if (i === 0) return { x: 18, y: 12, w: 58, rot: range(rand, -2, 2), z: 0 };
      return {
        x: range(rand, 4, 78),
        y: range(rand, 48, 86),
        w: range(rand, 10, 20),
        rot: range(rand, -16, 16),
        z: i,
      };
    }
    default: {
      return {
        x: range(rand, 2, 78),
        y: range(rand, 6, 82),
        w: range(rand, 14, 34),
        rot: range(rand, -16, 16),
        z: i,
      };
    }
  }
}

export function generateCluster(seed: string, index: number): ClusterSpec {
  const rand = rngFrom(seed, 'cluster', index);
  const layout = index === 0 ? 'oriel' : pick(rand, LAYOUTS);
  const count = layout === 'oriel' ? irange(rand, 5, 8) : irange(rand, 7, 14);
  const anomaly = maybeAnomaly(rand, index);

  const nodes: ImageNode[] = [];
  for (let i = 0; i < count; i++) {
    let item = pick(rand, CATALOG);
    if (anomaly && i === 0) {
      if (anomaly === 'eye') item = CATALOG.find((c) => c.id === 'g-eye') ?? item;
      if (anomaly === 'skeleton') item = CATALOG.find((c) => c.id === 'g-skel') ?? item;
      if (anomaly === 'moon') item = CATALOG.find((c) => c.id === 'g-moon') ?? item;
      if (anomaly === 'burn') item = CATALOG.find((c) => c.id === 'g-burn') ?? item;
      if (anomaly === 'stock') item = pick(rand, NORMALS.length ? NORMALS : CATALOG);
      if (anomaly === 'portal') item = CATALOG.find((c) => c.id === 'g-port') ?? item;
    } else if (chance(rand, 0.08) && RARES.length) {
      item = pick(rand, RARES);
    }

    const p = place(layout, i, count, rand);
    const under = chance(rand, 0.45) ? pick(rand, CATALOG) : undefined;
    nodes.push({
      uid: `${index}:${i}:${item.id}`,
      item,
      under,
      ...p,
      w: anomaly && i === 0 ? Math.max(p.w, 36) : p.w,
      behavior: pick(rand, BEHAVIORS),
      treatment: treatment(rand),
      caption: caption(rand, item.kind),
      label: `${pick(rand, SHORT)}-${irange(rand, 10, 99)}`,
      anomaly: anomaly && i === 0 ? anomaly : undefined,
    });
  }

  const glyphs: GlyphSpec[] = Array.from({ length: irange(rand, 3, 8) }, (_, i) => ({
    id: `g${index}-${i}`,
    x: range(rand, 2, 92),
    y: range(rand, 4, 90),
    kind: irange(rand, 0, 7),
    size: range(rand, 18, 64),
    rot: range(rand, 0, 360),
  }));

  const warnings: WarningSpec[] = Array.from({ length: irange(rand, 1, 3) }, (_, i) => ({
    id: `w${index}-${i}`,
    x: range(rand, 4, 78),
    y: range(rand, 6, 88),
    text: pick(rand, WARNINGS),
    level: pick(rand, ['note', 'caution', 'forbid'] as const),
  }));

  const diagrams: DiagramSpec[] = Array.from({ length: irange(rand, 1, 3) }, (_, i) => ({
    id: `d${index}-${i}`,
    x: range(rand, 6, 84),
    y: range(rand, 8, 86),
    kind: irange(rand, 0, 5),
    size: range(rand, 70, 160),
  }));

  return {
    index,
    layout,
    height: range(rand, 920, 1280),
    nodes,
    glyphs,
    warnings,
    diagrams,
    title: `${pick(rand, SHORT)} ${pick(rand, SHORT)}`,
    accession: accessionOf(Math.abs(index) * 17 + hashTiny(seed)),
  };
}

function hashTiny(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h % 800;
}

export { pick, chance, range, irange };
