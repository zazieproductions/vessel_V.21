# Interfaces & Type Reference

## ImageKind

Classification of images in the catalog. Used for selection bias, caption generation, and room assignment.

```typescript
type ImageKind =
  | 'anatomy'     // Body parts, corridors, medical imagery
  | 'insect'      // Pinned specimens, moths, beetles
  | 'machine'     // Gears, engines, circuits
  | 'geometry'    // Mandalas, manuscripts, sacred geometry
  | 'satellite'   // Moons, nebulae, orbital bodies
  | 'scan'        // MRI, x-rays, lightbox readings
  | 'ruin'        // Gothic architecture, abandoned spaces
  | 'botanical'   // Plants, fungi, herbarium
  | 'face'        // Portraits, wax figures
  | 'interface'   // CRT terminals, CD-ROM UI, typewriters
  | 'family'      // Group photos, domestic scenes
  | 'map'         // Cartography, ocean charts
  | 'portal'      // Mercury, glass, dimensional openings
  | 'sigil'       // Seals, stamps, symbolic marks
  | 'micro'       // Microscopy, cells, organisms
  | 'anomaly';    // Eyes, special images
```

## Behavior

Animation applied to an image node. Resolved to CSS class names in `LivingImage`.

```typescript
type Behavior =
  | 'melt'       // SVG displacement filter animation (7s)
  | 'split'      // Image splits in half on hover
  | 'reveal'     // Under-image fades in on hover
  | 'rotate'     // Slow continuous rotation (48s)
  | 'duplicate'  // Ghost image appears on hover
  | 'glitch'     // RGB split effect (2.8s)
  | 'pulse'      // Scale/opacity oscillation (4.4s)
  | 'invert'     // Color inversion on hover (CSS filter)
  | 'burn'       // Hue/contrast flickering (1.8s)
  | 'orbit';     // Circular translation (14s)
```

**Rendering mapping** (in `LivingImage.tsx`):

| Behavior | CSS Class | Hover Effect |
|---|---|---|
| `melt` | `melt` | Image stretches vertically |
| `split` | — (custom JSX) | Image divides into two halves that separate |
| `reveal` | — (custom JSX) | Under-image opacity increases from 0.15 to 1 |
| `rotate` | `spin-slow` | +8° additional rotation |
| `duplicate` | — (custom JSX) | Ghost image appears offset with screen blend |
| `glitch` | `glitch` | RGB split filter triggers |
| `pulse` | `pulse-slow` | No additional hover change |
| `invert` | — (CSS filter) | Invert value swaps between `t.invert` and `1 - t.invert` |
| `burn` | `burn-flicker` | No additional hover change |
| `orbit` | `orbit` | No additional hover change |

## ClusterLayout

Layout strategy for arranging images within a cluster section.

```typescript
type ClusterLayout =
  | 'scatter'        // Random distribution across the section
  | 'spiral'         // Archimedean spiral
  | 'drawer'         // 4-column grid with jitter
  | 'nave'           // Alternating left/right columns
  | 'strip'          // Horizontal strip with sine wave
  | 'stack'          // Centered vertical stack
  | 'constellation'  // Wide random scatter, small images
  | 'cabinet'        // 3-column grid, no rotation
  | 'wound'          // Cosine oscillation, reverse z-order
  | 'oriel';         // Hero image + scattered smaller (cluster 0 only)
```

## RoomId

Identifiers for the 7 hidden room overlays.

```typescript
type RoomId = 'vessel' | 'lunar' | 'eye' | 'room0' | 'burning' | 'micro' | 'nave';
```

| Room | Theme | Trigger |
|---|---|---|
| `vessel` | Glass skeleton | Click skeleton anomaly or intro button |
| `lunar` | Wrong moon | Click moon anomaly or intro button |
| `eye` | Cathedral eye | Click eye anomaly or intro button |
| `room0` | Ordinary photos | Click stock anomaly or intro button |
| `burning` | Burning diagram | Click burn anomaly or intro button |
| `micro` | Microscopic feed | Click intro button |
| `nave` | Glitch cathedral | Click portal anomaly, intro button, or mercury portal |

## SpawnKind

Types of spawn effects created on void click.

```typescript
type SpawnKind = 'sigil' | 'text' | 'ripple' | 'swarm';
```

| Kind | Visual | Duration |
|---|---|---|
| `sigil` | SVG mark (circle + star/triangle) | 1.8s fade-out |
| `text` | Fragment text from lexicon | 2.1s fade-out |
| `ripple` | Expanding circle | 1.6s expand + fade |
| `swarm` | 5 images orbit outward | 1.5s expand + fade |

## AnomalyKind

Types of anomalies that can appear in clusters.

```typescript
type AnomalyKind = 'eye' | 'skeleton' | 'moon' | 'burn' | 'stock' | 'portal';
```

Each maps to a specific catalog item and hidden room:
- `eye` → `g-eye` → room `eye`
- `skeleton` → `g-skel` → room `vessel`
- `moon` → `g-moon` → room `lunar`
- `burn` → `g-burn` → room `burning`
- `stock` → random from `NORMALS` → room `room0`
- `portal` → `g-port` → room `nave`

## CatalogItem

```typescript
interface CatalogItem {
  id: string;       // Unique identifier (e.g. 'g-eye')
  src: string;      // Path under /public (e.g. '/images/gen/eye-cathedral.png')
  alt: string;      // Accessible description / caption
  kind: ImageKind;  // Classification
  ratio: number;    // Aspect ratio (width / height)
  rare?: boolean;   // Preferential selection for anomalies
  room?: RoomId;    // Associated hidden room
  normal?: boolean; // "Ordinary" photo flag (used for room0)
}
```

## ImageNode

A fully specified image placement within a cluster. Created by `generateCluster`.

```typescript
interface ImageNode {
  uid: string;          // Unique ID: "${index}:${nodeIndex}:${itemId}"
  item: CatalogItem;    // Primary image
  under?: CatalogItem;  // Optional under-layer (for 'reveal' behavior)
  x: number;            // Left position (percentage, 0–100)
  y: number;            // Top position (percentage, 0–100)
  w: number;            // Width (percentage, 4–58)
  rot: number;          // Rotation (degrees, -25 to 25)
  z: number;            // Z-index (typically 0–14)
  behavior: Behavior;   // Animation type
  treatment: Treatment; // Visual treatment parameters
  caption: string;      // Figcaption text
  label: string;        // Short label (e.g. "VEIN-47")
  anomaly?: AnomalyKind; // Present only on anomaly leader images
}
```

## Treatment

Visual treatment parameters applied via CSS filters and styles.

```typescript
interface Treatment {
  hue: number;        // hue-rotate degrees (-40 to 80)
  sat: number;        // saturate multiplier (0.7 to 1.7)
  contrast: number;   // contrast multiplier (0.85 to 1.45)
  invert: number;     // invert amount (0 = none, 0.4–1 when active; 8% chance)
  blend: string;      // mix-blend-mode (10 options; 35% chance of non-'normal')
  mask: string;       // CSS mask shape (7 options; 28% chance of non-'none')
  opacity: number;    // Container opacity (0.78 to 1.0)
  flipX: boolean;     // Horizontal flip (12% chance)
  flipY: boolean;     // Vertical flip (4% chance)
  grain: number;      // Noise overlay opacity (0 to 0.45)
}
```

**Applied in `LivingImage.tsx`**:
- `hue`, `sat`, `contrast`, `invert` → CSS `filter` string on the `<img>`
- `blend` → CSS `mix-blend-mode` on the container `<div>`
- `mask` → CSS class mapping to mask image
- `opacity` → CSS `opacity` on the container
- `flipX`, `flipY` → CSS `transform: scaleX(-1)` / `scaleY(-1)`
- `grain` → Noise overlay div with that opacity (only when > 0.15)

## ClusterSpec

```typescript
interface ClusterSpec {
  index: number;          // Cluster position in sequence (0-based)
  layout: ClusterLayout;  // Layout algorithm used
  height: number;         // Section height in pixels (920–1280)
  nodes: ImageNode[];     // 5–14 image placements
  glyphs: GlyphSpec[];    // 3–8 SVG sigils
  warnings: WarningSpec[];// 1–3 warning labels
  diagrams: DiagramSpec[];// 1–3 technical diagrams
  title: string;          // Two-word title (e.g. "VESSEL GLYPH")
  accession: string;      // Accession number (e.g. "ACC-4713.07")
}
```

## GlyphSpec

```typescript
interface GlyphSpec {
  id: string;   // Unique ID
  x: number;    // Left position (percentage)
  y: number;    // Top position (percentage)
  kind: number; // Glyph variant (0–7)
  size: number; // Width/height in pixels (18–64)
  rot: number;  // Rotation (degrees, 0–360)
}
```

8 glyph variants are defined in `Glyph.tsx`: concentric circles with star, interlocking triangles, crescent moon, grid crosshair, pentagram, overlapping ellipses, arch with triangle, compass rose.

## DiagramSpec

```typescript
interface DiagramSpec {
  id: string;   // Unique ID
  x: number;    // Left position (percentage)
  y: number;    // Top position (percentage)
  kind: number; // Diagram variant (0–5)
  size: number; // Width/height in pixels (70–160)
}
```

6 diagram variants in `Diagram.tsx`:
- 0: **Vesica** — two overlapping circles
- 1: **Orbitals** — three rotated ellipses with center point
- 2: **Lattice** — grid with inscribed circle and diagonals
- 3: **AnatomyMap** — stick figure with labels (IRIS, ROOT)
- 4: **StarChart** — points on a dashed circle, connected by lines
- 5: **CircuitSeal** — rectangle with internal circuit pattern

## WarningSpec

```typescript
interface WarningSpec {
  id: string;              // Unique ID
  x: number;               // Left position (percentage)
  y: number;               // Top position (percentage)
  text: string;            // Warning text
  level: 'note' | 'caution' | 'forbid';  // Severity
}
```

| Level | Visual Style |
|---|---|
| `note` | Paper-colored background, black text |
| `caution` | Warning-colored background, black text |
| `forbid` | Black background, warning-colored text, slight left tilt |

## SpawnEvent

```typescript
interface SpawnEvent {
  id: string;       // Unique ID: "sp-${sequence}"
  kind: SpawnKind;  // Effect type
  x: number;        // Viewport X coordinate
  y: number;        // Viewport Y coordinate
  born: number;     // performance.now() timestamp
  payload?: string; // Text content (for 'text' kind)
  srcs?: string[];  // Image sources (for 'swarm' kind, 5 items)
}
```

## WinSpec

```typescript
interface WinSpec {
  id: string;    // Unique ID
  title: string; // Window title bar text
  kind: 'feed' | 'log' | 'viewer' | 'warn' | 'map' | 'diag';
  x: number;     // Left position (pixels)
  y: number;     // Top position (pixels)
  w: number;     // Width (pixels)
  h: number;     // Height (pixels)
  src?: string;  // Image source (for 'feed' kind)
  z: number;     // Z-index
}
```

## Theme

```typescript
interface Theme {
  id: ThemeId;      // Identifier
  name: string;     // Display name
  codename: string; // Flavor text
  bg: string;       // Background color
  fg: string;       // Foreground color
  accent: string;   // Primary accent
  accent2: string;  // Secondary accent
  warn: string;     // Warning color
  paper: string;    // Light surface
  metal: string;    // Metallic neutral
  void: string;     // Deep background
  scan: string;     // Scanline color
  glow: string;     // Glow effect color
}
```
