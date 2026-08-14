import type { CatalogItem } from './types';

export const CATALOG: CatalogItem[] = [
  { id: 'g-eye', src: '/images/gen/eye-cathedral.png', alt: 'Cathedral reflected in a living iris', kind: 'anomaly', ratio: 0.8, rare: true, room: 'eye' },
  { id: 'g-skel', src: '/images/gen/skeleton-glass.png', alt: 'Translucent glass skeleton', kind: 'anatomy', ratio: 0.66, rare: true, room: 'vessel' },
  { id: 'g-map', src: '/images/gen/impossible-map.png', alt: 'City that folds into veins', kind: 'map', ratio: 1.33 },
  { id: 'g-burn', src: '/images/gen/burning-diagram.png', alt: 'Sacred geometry on fire', kind: 'geometry', ratio: 1, rare: true, room: 'burning' },
  { id: 'g-moon', src: '/images/gen/wrong-moon.png', alt: 'Moon with facial craters', kind: 'satellite', ratio: 1, rare: true, room: 'lunar' },
  { id: 'g-face', src: '/images/gen/melt-face.png', alt: 'Wax portrait, one eye too large', kind: 'face', ratio: 0.75 },
  { id: 'g-bot', src: '/images/gen/botanical-impossible.png', alt: 'Plant that is also an insect', kind: 'botanical', ratio: 0.75 },
  { id: 'g-beetle', src: '/images/gen/jewel-beetle.png', alt: 'Iridescent specimen, pinned', kind: 'insect', ratio: 1 },
  { id: 'g-cath', src: '/images/gen/glitch-cathedral.png', alt: 'Nave shattered into pixels', kind: 'ruin', ratio: 0.75, room: 'nave' },
  { id: 'g-sat', src: '/images/gen/dead-satellite.png', alt: 'Dead satellite still blinking', kind: 'satellite', ratio: 1.77 },
  { id: 'g-cd', src: '/images/gen/cdrom-ui.png', alt: 'Disc 7 of 7 interface', kind: 'interface', ratio: 1.33 },
  { id: 'g-mri', src: '/images/gen/mri-door.png', alt: 'Cortex containing a door', kind: 'scan', ratio: 1 },
  { id: 'g-sigil', src: '/images/gen/sigil-seal.png', alt: 'Unnamed seal', kind: 'sigil', ratio: 1 },
  { id: 'g-micro', src: '/images/gen/micro-feed.png', alt: 'Unknown organisms, darkfield', kind: 'micro', ratio: 1.33, room: 'micro' },
  { id: 'g-fam', src: '/images/gen/family-blank.png', alt: 'Picnic, one face missing', kind: 'family', ratio: 1.33 },
  { id: 'g-eng', src: '/images/gen/bone-engine.png', alt: 'Engine of bone and crystal', kind: 'machine', ratio: 1.33 },
  { id: 'g-port', src: '/images/gen/mercury-portal.png', alt: 'Mercury hanging in a ruined room', kind: 'portal', ratio: 1.5, rare: true },
  { id: 'g-heart', src: '/images/gen/heart-cathedral.png', alt: 'Heart drawn as a floorplan', kind: 'anatomy', ratio: 0.75 },
  { id: 'g-moth', src: '/images/gen/moth-drawer.png', alt: 'Moths arranged as a seal', kind: 'insect', ratio: 1.33 },
  { id: 'g-bru', src: '/images/gen/brutalist-ruin.png', alt: 'Emergency lights in a dead complex', kind: 'ruin', ratio: 1.77 },
  { id: 'g-crt', src: '/images/gen/crt-occult.png', alt: 'Terminal reciting seals', kind: 'interface', ratio: 1.33 },
  { id: 'g-hand', src: '/images/gen/hand-moon-xray.png', alt: 'Hand holding a moon, x-rayed', kind: 'scan', ratio: 0.75 },

  { id: 's-ana', src: '/images/stock/anatomy-01.jpg', alt: 'Clinical corridor, unlabelled', kind: 'anatomy', ratio: 0.7 },
  { id: 's-ins', src: '/images/stock/insect-01.jpg', alt: 'Pinned Lepidoptera', kind: 'insect', ratio: 1 },
  { id: 's-mac', src: '/images/stock/machine-01.jpg', alt: 'Gear train, purpose unknown', kind: 'machine', ratio: 1.5 },
  { id: 's-geo', src: '/images/stock/geometry-01.jpg', alt: 'Textile mandala', kind: 'geometry', ratio: 1 },
  { id: 's-sat', src: '/images/stock/satellite-01.jpg', alt: 'Orbital body, classified', kind: 'satellite', ratio: 1.5 },
  { id: 's-scn', src: '/images/stock/scan-01.jpg', alt: 'Lightbox reading', kind: 'scan', ratio: 1, normal: true },
  { id: 's-rui', src: '/images/stock/ruin-01.jpg', alt: 'Gothic remainder', kind: 'ruin', ratio: 0.7 },
  { id: 's-bot', src: '/images/stock/botanical-01.jpg', alt: 'Herbarium under glass', kind: 'botanical', ratio: 0.7 },
  { id: 's-fac', src: '/images/stock/face-01.jpg', alt: 'Subject 14, knitted', kind: 'face', ratio: 0.75 },
  { id: 's-int', src: '/images/stock/interface-01.jpg', alt: 'Obsolete workstation', kind: 'interface', ratio: 1.4 },
  { id: 's-fam', src: '/images/stock/family-01.jpg', alt: 'Unfiled domestic plate', kind: 'family', ratio: 1.4, normal: true, room: 'room0' },
  { id: 's-map', src: '/images/stock/map-01.jpg', alt: 'Ocean of an older world', kind: 'map', ratio: 1.4 },
  { id: 's-skl', src: '/images/stock/skull-01.jpg', alt: 'Cranium, studio dark', kind: 'anatomy', ratio: 0.75 },
  { id: 's-eye', src: '/images/stock/eye-01.jpg', alt: 'Iris, wet, watching', kind: 'anomaly', ratio: 1, rare: true },
  { id: 's-moo', src: '/images/stock/moon-01.jpg', alt: 'Ordinary moon (suspect)', kind: 'satellite', ratio: 1, normal: true },
  { id: 's-mic', src: '/images/stock/micro-01.jpg', alt: 'Field of unnamed cells', kind: 'micro', ratio: 1.4 },
  { id: 's-fac2', src: '/images/stock/factory-01.jpg', alt: 'Foundry, abandoned mid-cycle', kind: 'ruin', ratio: 1.5 },
  { id: 's-stn', src: '/images/stock/stained-01.jpg', alt: 'Window that still believes', kind: 'ruin', ratio: 0.7 },
  { id: 's-mth', src: '/images/stock/moth-01.jpg', alt: 'Noctuid, extreme close', kind: 'insect', ratio: 1 },
  { id: 's-cir', src: '/images/stock/circuit-01.jpg', alt: 'Gold pins, a city', kind: 'machine', ratio: 1.5 },
  { id: 's-man', src: '/images/stock/manuscript-01.jpg', alt: 'Page that refuses translation', kind: 'geometry', ratio: 0.7 },
  { id: 's-web', src: '/images/stock/web-01.jpg', alt: 'Survey net, dew-indexed', kind: 'botanical', ratio: 1.5 },
  { id: 's-chl', src: '/images/stock/children-01.jpg', alt: 'Silhouettes at a shoreline', kind: 'family', ratio: 1.5, normal: true, room: 'room0' },
  { id: 's-neb', src: '/images/stock/nebula-01.jpg', alt: 'Uncatalogued violet', kind: 'satellite', ratio: 1.5 },
  { id: 's-hnd', src: '/images/stock/hands-01.jpg', alt: 'Vessel of red liquor', kind: 'scan', ratio: 0.75 },
  { id: 's-cor', src: '/images/stock/coral-01.jpg', alt: 'Calcified colony', kind: 'micro', ratio: 1.5 },
  { id: 's-typ', src: '/images/stock/typewriter-01.jpg', alt: 'Keys that remember names', kind: 'interface', ratio: 1 },
  { id: 's-for', src: '/images/stock/forest-01.jpg', alt: 'Fog index, stand 7', kind: 'ruin', ratio: 0.7 },
  { id: 's-spi', src: '/images/stock/spine-01.jpg', alt: 'Column of a former person', kind: 'anatomy', ratio: 0.7 },
  { id: 's-clk', src: '/images/stock/clock-01.jpg', alt: 'Timekeeping viscera', kind: 'machine', ratio: 1 },
  { id: 's-vlt', src: '/images/stock/vault-01.jpg', alt: 'Ceiling receding into rite', kind: 'ruin', ratio: 0.7, room: 'nave' },
  { id: 's-fun', src: '/images/stock/fungi-01.jpg', alt: 'Fruiting body, uninvited', kind: 'botanical', ratio: 1 },
  { id: 's-tv', src: '/images/stock/tv-01.jpg', alt: 'Receivers waiting for a signal', kind: 'interface', ratio: 1.4 },
  { id: 's-bld', src: '/images/stock/blood-01.jpg', alt: 'Cellular congregation', kind: 'micro', ratio: 1 },
  { id: 's-crv', src: '/images/stock/carving-01.jpg', alt: 'Relief that predates the file', kind: 'geometry', ratio: 1.4 },
  { id: 's-gls', src: '/images/stock/glass-01.jpg', alt: 'Shatter study', kind: 'portal', ratio: 1 },
];

export const BY_KIND = CATALOG.reduce<Record<string, CatalogItem[]>>((acc, item) => {
  (acc[item.kind] ||= []).push(item);
  return acc;
}, {});

export const RARES = CATALOG.filter((c) => c.rare);
export const NORMALS = CATALOG.filter((c) => c.normal);
export const ROOMS = CATALOG.filter((c) => c.room);

export function itemById(id: string): CatalogItem | undefined {
  return CATALOG.find((c) => c.id === id);
}
