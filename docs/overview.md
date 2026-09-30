# VESSEL — Project Overview

> A living archive. Occult terminal. Broken CD-ROM. Outsider atlas.

## What This Is

VESSEL is a single-page browser experience that presents itself as the interface of a haunted operating system — a fictional archive terminal ("VESSEL OS 0.9.4") cataloguing occult, surreal, and procedurally arranged imagery. The user scrolls through an infinite sequence of generative image clusters, each assembled from a seeded catalog of ~60 photographs, diagrams, glyphs, and warnings. Every visit is unique: the seed, layout, image treatment, anomaly placement, and thematic palette are all deterministic from a random 8-character hex seed generated at startup.

The project is **experimental creative software** — part interactive art piece, part generative design system, part research into procedural content arrangement. It is not a production application, a CMS, or a gallery. It is a self-contained organism that indexes the user as the user indexes it.

## Current Status

| Aspect | Status |
|---|---|
| Runtime | Functional — builds, runs, type-checks cleanly |
| Tests | **None** — no test suite exists |
| CI | Minimal — GitHub Actions workflow runs `npm install && npx webpack` (note: the project uses Vite, not Webpack; the CI workflow is misconfigured) |
| Static assets | **Missing** — all image paths in `catalog.ts` reference `/images/gen/*.png` and `/images/stock/*.jpg` under `public/`, but no `public/` directory exists in the repository. The application will render with broken images. |
| Videos | **Missing** — `OverlayFX.tsx` references `/videos/grain.mp4`, which does not exist |
| Fonts | Loaded from Google Fonts CDN at runtime (Cinzel Decorative, IBM Plex Mono, Share Tech Mono) |
| Lint | Two eslint warnings in `FloatingWindows.tsx` (setState in effect, impure Date.now in render) |

## What the Project Does

1. **Boot sequence** — a terminal-style animation that types system initialization lines, then yields to the main interface
2. **Infinite scroll** — procedurally generated image clusters laid out vertically; new clusters materialize as the user scrolls down, old ones are discarded
3. **Visual treatments** — each image receives a deterministic random treatment: hue rotation, saturation, contrast, blend mode, mask shape, grain overlay, flip transforms
4. **Behaviors** — images animate (melt, glitch, pulse, orbit, burn, rotate) unless frozen or reduced-motion is active
5. **Anomalies** — at regular intervals, a cluster gets an "anomaly" image placed prominently (eye, skeleton, moon, burning diagram, stock photo, portal)
6. **Hidden rooms** — clicking anomaly images or the intro relic buttons opens modal overlays themed around 7 conceptual "rooms" (vessel, lunar, eye, room0, burning, micro, nave)
7. **Floating windows** — draggable Win95-styled windows showing a live feed, system log, image viewer, warning panel, map, and diagnostics
8. **Spawn layer** — clicking empty space inscribes sigils, text fragments, ripples, or image swarms at the click point
9. **HUD** — fixed heads-up display showing seed, theme, scroll depth, pointer coordinates, and action buttons
10. **Keyboard shortcuts** — M (mutate theme), R (regenerate), S (freeze/thaw animations), D (diagnostic overlay), ESC (close overlays)
11. **Theme cycling** — 7 color themes (vessel/lime, ultraviolet/pink, infrared/red, cyanvoid/cyan, petroleum/amber, cathedral/silver, bruise/purple) cycled with the M key
12. **Custom cursor** — canvas-rendered crosshair with velocity-based particle trail
13. **Overlay effects** — full-screen CRT scanlines, noise grain, vignette, and a video grain layer

## What the Project Does NOT Do

- No backend, API, database, or server-side logic
- No user authentication, persistence, or state saving
- No routing (react-router-dom is listed as a dependency but is unused)
- No testing framework
- No SSR/SSG
- No accessibility features beyond `aria-label` on a handful of buttons and `aria-hidden` on decorative layers
- No responsive layout optimization (desktop-oriented; coarse-pointer detection exists but layout is not mobile-optimized)

## Architecture Summary

```
┌─────────────────────────────────────────────┐
│  index.html (entry + Arena platform scripts)│
├─────────────────────────────────────────────┤
│  main.tsx → App.tsx                         │
│    └─ ArchiveProvider (React Context)        │
│       └─ Shell (render tree root)            │
│          ├─ SVGFilters                       │
│          ├─ Keyboard                         │
│          ├─ ClickVoid                        │
│          ├─ BootSequence                     │
│          ├─ AnomalyLayer                     │
│          ├─ IntroRelic                       │
│          ├─ InfiniteArchive                  │
│          │   └─ Cluster[]                    │
│          │       ├─ LivingImage[]            │
│          │       ├─ Glyph[]                  │
│          │       ├─ Diagram[]                │
│          │       └─ WarningLabel[]           │
│          ├─ SymbolRail                       │
│          ├─ FloatingWindows                  │
│          ├─ SpawnLayer                       │
│          ├─ Diagnostic                       │
│          ├─ HUD                              │
│          ├─ HiddenRoom                       │
│          ├─ OverlayFX                        │
│          └─ CustomCursor                     │
├─────────────────────────────────────────────┤
│  lib/                                       │
│   rng.ts     — seeded PRNG (mulberry32)     │
│   catalog.ts — image catalog (60 items)     │
│   lexicon.ts — text fragments & room copy   │
│   generate.ts — cluster generation engine   │
│   themes.ts  — 7 color themes              │
│   types.ts   — TypeScript interfaces        │
│   pointer.ts — shared mutable pointer state │
└─────────────────────────────────────────────┘
```

## Repository Map

```
vessel_V.21/
├── index.html              Entry HTML (includes Arena platform scripts)
├── package.json            Dependencies and build scripts
├── vite.config.ts          Vite config with source-tags plugin
├── tsconfig.json           TypeScript project references
├── tsconfig.app.json       App TypeScript config
├── tsconfig.node.json      Node TypeScript config
├── eslint.config.js        ESLint flat config
├── .vite-source-tags.js    Compile-time JSX source attribute injector
├── .github/workflows/
│   └── webpack.yml         CI workflow (misconfigured — uses webpack, project uses Vite)
├── src/
│   ├── main.tsx            React entry point
│   ├── App.tsx             Root component + Shell layout
│   ├── App.css             (empty)
│   ├── index.css           All CSS: variables, animations, masks, overlays
│   ├── components/         20 React components
│   │   ├── AnomalyLayer.tsx
│   │   ├── BootSequence.tsx
│   │   ├── ClickVoid.tsx
│   │   ├── Cluster.tsx
│   │   ├── CustomCursor.tsx
│   │   ├── Diagnostic.tsx
│   │   ├── Diagram.tsx
│   │   ├── FloatingWindows.tsx
│   │   ├── Glyph.tsx
│   │   ├── HUD.tsx
│   │   ├── HiddenRoom.tsx
│   │   ├── InfiniteArchive.tsx
│   │   ├── IntroRelic.tsx
│   │   ├── Keyboard.tsx
│   │   ├── LivingImage.tsx
│   │   ├── OverlayFX.tsx
│   │   ├── SpawnLayer.tsx
│   │   ├── SVGFilters.tsx
│   │   ├── SymbolRail.tsx
│   │   └── WarningLabel.tsx
│   ├── context/
│   │   └── ArchiveContext.tsx  Central state provider
│   └── lib/
│       ├── rng.ts          Seeded PRNG utilities
│       ├── catalog.ts      Image catalog
│       ├── lexicon.ts      Text fragments, warnings, room copy
│       ├── generate.ts     Cluster generation engine
│       ├── themes.ts       Color theme definitions
│       ├── types.ts        TypeScript type definitions
│       └── pointer.ts      Shared mutable pointer/scroll state
└── docs/                   This documentation
```

## Key Dependencies

| Dependency | Version | Purpose |
|---|---|---|
| react | ^19.2.0 | UI framework |
| react-dom | ^19.2.0 | DOM rendering |
| framer-motion | ^12.35.0 | Animation (used only in `HiddenRoom.tsx` for enter/exit transitions) |
| lucide-react | ^0.577.0 | Icon library (listed but **unused** in current source) |
| react-router-dom | ^7.13.1 | Routing (listed but **unused** in current source) |
| tailwindcss | ^4.2.1 | Utility-first CSS |
| @tailwindcss/vite | ^4.2.1 | Tailwind Vite integration |
| vite | ^7.3.1 | Build tool and dev server |
| @vitejs/plugin-react | ^5.1.1 | React Fast Refresh via Babel |
| typescript | ~5.9.3 | Type checking |

## Design Philosophy

The project operates on a **seed-equals-organism** principle: given the same seed string, every image placement, treatment, layout choice, anomaly selection, glyph position, warning text, and caption is identical. This determinism is achieved through a custom mulberry32 PRNG (`rng.ts`) that derives all randomness from a combination of the global seed and per-cluster salt values.

The visual language draws from:
- CRT monitors and CRT phosphor decay
- Win95 window chrome
- Medical imaging (MRI, microscopy)
- Occult/bestiary manuscripts
- Broken CD-ROM interfaces
- Museum/archive labeling systems (accession numbers, plates, labels)
