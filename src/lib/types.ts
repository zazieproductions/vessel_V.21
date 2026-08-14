export type ImageKind =
  | 'anatomy'
  | 'insect'
  | 'machine'
  | 'geometry'
  | 'satellite'
  | 'scan'
  | 'ruin'
  | 'botanical'
  | 'face'
  | 'interface'
  | 'family'
  | 'map'
  | 'portal'
  | 'sigil'
  | 'micro'
  | 'anomaly';

export type Behavior =
  | 'melt'
  | 'split'
  | 'reveal'
  | 'rotate'
  | 'duplicate'
  | 'glitch'
  | 'pulse'
  | 'invert'
  | 'burn'
  | 'orbit';

export type ClusterLayout =
  | 'scatter'
  | 'spiral'
  | 'drawer'
  | 'nave'
  | 'strip'
  | 'stack'
  | 'constellation'
  | 'cabinet'
  | 'wound'
  | 'oriel';

export type RoomId = 'vessel' | 'lunar' | 'eye' | 'room0' | 'burning' | 'micro' | 'nave';

export interface CatalogItem {
  id: string;
  src: string;
  alt: string;
  kind: ImageKind;
  ratio: number;
  rare?: boolean;
  room?: RoomId;
  normal?: boolean;
}

export interface ImageNode {
  uid: string;
  item: CatalogItem;
  under?: CatalogItem;
  x: number;
  y: number;
  w: number;
  rot: number;
  z: number;
  behavior: Behavior;
  treatment: Treatment;
  caption: string;
  label: string;
  anomaly?: AnomalyKind;
}

export interface Treatment {
  hue: number;
  sat: number;
  contrast: number;
  invert: number;
  blend: string;
  mask: string;
  opacity: number;
  flipX: boolean;
  flipY: boolean;
  grain: number;
}

export type AnomalyKind = 'eye' | 'skeleton' | 'moon' | 'burn' | 'stock' | 'portal';

export interface ClusterSpec {
  index: number;
  layout: ClusterLayout;
  height: number;
  nodes: ImageNode[];
  glyphs: GlyphSpec[];
  warnings: WarningSpec[];
  diagrams: DiagramSpec[];
  title: string;
  accession: string;
}

export interface GlyphSpec {
  id: string;
  x: number;
  y: number;
  kind: number;
  size: number;
  rot: number;
}

export interface WarningSpec {
  id: string;
  x: number;
  y: number;
  text: string;
  level: 'note' | 'caution' | 'forbid';
}

export interface DiagramSpec {
  id: string;
  x: number;
  y: number;
  kind: number;
  size: number;
}

export type SpawnKind = 'sigil' | 'text' | 'ripple' | 'swarm';

export interface SpawnEvent {
  id: string;
  kind: SpawnKind;
  x: number;
  y: number;
  born: number;
  payload?: string;
  srcs?: string[];
}

export interface WinSpec {
  id: string;
  title: string;
  kind: 'feed' | 'log' | 'viewer' | 'warn' | 'map' | 'diag';
  x: number;
  y: number;
  w: number;
  h: number;
  src?: string;
  z: number;
}
