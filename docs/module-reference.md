# Module Reference

## lib/rng.ts — Seeded Pseudorandom Number Generator

**Purpose**: Provide deterministic, reproducible randomness for all procedural generation. Same seed always produces the same sequence.

### `hashString(str: string): number`

FNV-1a-variant string hash. Returns a 32-bit unsigned integer.

| | |
|---|---|
| **Input** | Any string |
| **Output** | `number` (32-bit unsigned, never 0 due to `\|\| 1` fallback) |
| **Determinism** | Yes — same input, same output |
| **Used by** | `rngFrom` to convert string seeds to numeric |

### `mulberry32(seed: number): RNG`

Creates a mulberry32 PRNG function. Returns a closure that produces values in `[0, 1)`.

| | |
|---|---|
| **Input** | Numeric seed (32-bit) |
| **Output** | `() => number` — each call advances state, returns `[0, 1)` |
| **Determinism** | Yes — same seed, same sequence |
| **Period** | 2³² |
| **Used by** | `rngFrom` |

### `rngFrom(seed: number | string, ...salt: Array<number | string>): RNG`

Factory function that creates a new RNG by combining a seed with optional salt values using golden-ratio hashing.

| | |
|---|---|
| **Input** | Seed (number or string), optional salt values |
| **Output** | `RNG` function |
| **Determinism** | Yes — same (seed, salt) pair, same RNG sequence |
| **Used by** | `generateCluster`, `AnomalyLayer`, `FloatingWindows` |

The salt mixing uses `Math.imul(s ^ n, 0x9e3779b9) + 0x85ebca6b` (golden ratio constants) for good bit diffusion.

### `pick<T>(rand: RNG, arr: readonly T[]): T`

Select one random element from an array.

| | |
|---|---|
| **Invariant** | `arr.length > 0` (undefined behavior on empty array) |
| **Distribution** | Uniform |

### `pickN<T>(rand: RNG, arr: readonly T[], n: number): T[]`

Select `n` unique random elements from an array (without replacement). Modifies a copy of the array.

### `range(rand: RNG, min: number, max: number): number`

Random float in `[min, max)`.

### `irange(rand: RNG, min: number, max: number): number`

Random integer in `[min, max]` (inclusive on both ends).

### `chance(rand: RNG, p: number): boolean`

Returns `true` with probability `p`.

### `hexSeed(n = 6): string`

Generates `n` random hex characters using `crypto.getRandomValues`. **Not deterministic** — uses real randomness for the initial seed.

### `padHex(n: number, len = 6): string`

Converts a number to zero-padded uppercase hex string.

---

## lib/catalog.ts — Image Catalog

**Purpose**: Static registry of all images available for cluster generation.

### `CATALOG: CatalogItem[]`

60 entries (22 generated, 38 stock). Each entry:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g. `'g-eye'`, `'s-ana'`) |
| `src` | `string` | Path under `/public` (e.g. `/images/gen/eye-cathedral.png`) |
| `alt` | `string` | Alt text / caption |
| `kind` | `ImageKind` | Category (16 values: anatomy, insect, machine, geometry, satellite, scan, ruin, botanical, face, interface, family, map, portal, sigil, micro, anomaly) |
| `ratio` | `number` | Aspect ratio (width/height), typically 0.66–1.77 |
| `rare?` | `boolean` | Weighted selection bias when anomaly present |
| `normal?` | `boolean` | Used for room0 "ordinary" photos |
| `room?` | `RoomId` | Associated hidden room |

### Derived Indexes

| Export | Type | Description |
|---|---|---|
| `BY_KIND` | `Record<string, CatalogItem[]>` | Images grouped by `kind` |
| `RARES` | `CatalogItem[]` | Items where `rare === true` |
| `NORMALS` | `CatalogItem[]` | Items where `normal === true` |
| `ROOMS` | `CatalogItem[]` | Items with a `room` assignment |

### `itemById(id: string): CatalogItem | undefined`

Lookup by id. Returns `undefined` if not found.

**Important**: All `src` paths reference files under `/public/images/`. These files are **not present in the repository**. The application renders with broken images until these assets are provided.

---

## lib/lexicon.ts — Text Content

**Purpose**: All prose, labels, warnings, and room descriptions.

### Constants

| Export | Type | Count | Purpose |
|---|---|---|---|
| `FRAGMENTS` | `string[]` | 35 | Long-form ominous phrases for image captions |
| `SHORT` | `string[]` | 28 | Single words for labels and captions |
| `WARNINGS` | `string[]` | 15 | Warning label text |
| `ACCESSION` | `string[]` | 10 | Accession number prefixes (ACC, PLATE, NEG, etc.) |
| `WINDOW_TITLES` | `string[]` | 9 | Floating window title bars |
| `LOG_LINES` | `string[]` | 15 | System log entries (displayed in log window) |
| `ROOM_COPY` | `Record<string, {title, sub, body[]}>` | 7 | Hidden room content (keyed by RoomId) |

### `accessionOf(n: number): string`

Generates an accession string like `"ACC-4713.07"` from a numeric input. Uses modular arithmetic with fixed magic numbers for deterministic output.

---

## lib/generate.ts — Cluster Generation Engine

**Purpose**: The core procedural generation function that builds complete cluster specifications from a seed and index.

### `generateCluster(seed: string, index: number): ClusterSpec`

**This is the most important function in the codebase.** It produces the entire specification for one scroll section.

| | |
|---|---|
| **Inputs** | `seed` (global seed string), `index` (cluster position) |
| **Output** | Immutable `ClusterSpec` |
| **Determinism** | Guaranteed by mulberry32 PRNG |
| **Performance** | Pure computation, no DOM access. Creates 7–14 `ImageNode` objects with full treatment. |

#### Generation Steps

1. Create RNG: `rngFrom(seed, 'cluster', index)`
2. Choose layout: cluster 0 → `'oriel'`, others random from 10 options
3. Determine count: oriel → 5–8, others → 7–14
4. Check anomaly: every 7th cluster deterministically, or 7% random
5. For each node:
   - Select catalog item (anomaly-biased for first node of anomaly clusters)
   - Calculate position via `place(layout, i, n, rand)`
   - Generate treatment (hue, sat, contrast, invert, blend, mask, opacity, flipX, flipY, grain)
   - Pick behavior from 10 options
   - Generate caption and label
6. Generate 3–8 glyphs, 1–3 warnings, 1–3 diagrams
7. Compute title and accession number

#### Layout Algorithms

| Layout | Description |
|---|---|
| `oriel` | One large hero image (58% width) + scattered smaller images below |
| `spiral` | Archimedean spiral path |
| `drawer` | 4-column grid with slight jitter |
| `nave` | Alternating left/right columns (cathedral nave) |
| `strip` | Horizontal strip with sine-wave vertical offset |
| `stack` | Centered vertical stack |
| `constellation` | Random scatter (wide range) |
| `cabinet` | 3-column grid, no rotation |
| `wound` | Cosine-wave horizontal oscillation, reversed z-order |
| `scatter` | Default random placement |

### `place(layout, i, n, rand): { x, y, w, rot, z }`

Internal function. Calculates position as percentages of container width/height.

### Re-exports

`pick`, `chance`, `range`, `irange` are re-exported from `rng.ts` for convenience.

---

## lib/themes.ts — Color Themes

**Purpose**: Defines 7 color themes and applies them to the DOM.

### `THEMES: Theme[]`

7 themes, each with 12 fields:

| Field | CSS Var | Description |
|---|---|---|
| `id` | — | Theme identifier |
| `name` | — | Display name |
| `codename` | — | Flavor text |
| `bg` | `--bg` | Background color |
| `fg` | `--fg` | Foreground / primary text |
| `accent` | `--accent` | Primary accent (matches fg in most themes) |
| `accent2` | `--accent2` | Secondary accent |
| `warn` | `--warn` | Warning/alert color |
| `paper` | `--paper` | Light surface (labels, hidden rooms) |
| `metal` | `--metal` | Neutral metallic |
| `void` | `--void` | Deep background gradient |
| `scan` | `--scan` | Scanline color (semi-transparent) |
| `glow` | `--glow` | Glow effect color |

### `themeById(id: ThemeId): Theme`

Lookup by id. Falls back to first theme if not found.

### `nextThemeId(id: ThemeId): ThemeId`

Returns the next theme id in circular order.

### `applyTheme(theme: Theme): void`

**Imperative function** that sets CSS custom properties on `document.documentElement` and sets `data-theme` attribute. Called from `ArchiveContext`'s `useEffect`.

---

## lib/types.ts — Type Definitions

**Purpose**: All TypeScript interfaces and union types.

### Union Types

| Type | Values | Used For |
|---|---|---|
| `ImageKind` | 16 values | Catalog classification |
| `Behavior` | 10 values | Image animation type |
| `ClusterLayout` | 10 values | Cluster arrangement strategy |
| `RoomId` | 7 values | Hidden room identifiers |
| `SpawnKind` | 4 values | Spawn effect types |
| `AnomalyKind` | 6 values | Anomaly image types |

### Interfaces

| Interface | Fields | Purpose |
|---|---|---|
| `CatalogItem` | 8 fields | Image catalog entry |
| `ImageNode` | 12 fields | Placed image in a cluster (item + position + treatment) |
| `Treatment` | 10 fields | Visual treatment parameters |
| `ClusterSpec` | 8 fields | Complete cluster specification |
| `GlyphSpec` | 6 fields | SVG glyph placement |
| `WarningSpec` | 5 fields | Warning label placement |
| `DiagramSpec` | 5 fields | Technical diagram placement |
| `SpawnEvent` | 6 fields | Click-spawned effect |
| `WinSpec` | 9 fields | Floating window specification |

Full interface definitions are in [interfaces.md](./interfaces.md).

---

## lib/pointer.ts — Shared Mutable Pointer State

**Purpose**: Performance optimization for high-frequency pointer/scroll data.

```typescript
export const pointer = { x: 0, y: 0, vx: 0, vy: 0 };
export const scroll = { y: 0 };
export function writePointer(x, y, vx, vy): void;
export function writeScroll(y): void;
```

**Not React state.** Module-level mutable objects written at 60fps, polled at 5–12fps by UI consumers.

---

## context/ArchiveContext.tsx — Central State Provider

**Purpose**: Single React Context provider for all shared application state.

### `ArchiveProvider`

Wraps the entire application. Initializes state and exposes all actions.

**Side effects on mount**:
- Generates initial seed via `hexSeed(8)` (calls `crypto.getRandomValues`)
- Applies initial theme to DOM

**Side effects on state change**:
- `theme` change → `applyTheme()` writes to DOM
- `seed` change → scroll reset (via `InfiniteArchive`)

### `useArchive(): ArchiveState`

Hook that returns the full context. Throws if called outside provider.

**Performance note**: All 15+ components call `useArchive()`. Any state change causes all of them to re-render. This is acceptable for the current scale but would need optimization (selectors, splitting context) if the component count grew significantly.
