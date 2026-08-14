# VESSEL — Occult Archive OS

> A living archive. Occult terminal. Broken CD-ROM. Outsider atlas.  
> The organism indexes you as you index it.

VESSEL is a single-page interactive experience that simulates a haunted operating system interface — a procedurally generated infinite scroll of occult imagery, surreal floating windows, cryptic text, and hidden rooms. Every visit produces a unique arrangement from a random seed. The same seed always produces the same organism.

**Status**: Experimental. Functional but incomplete (static assets missing, no tests, CI misconfigured).

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Wait for the boot sequence (or click "skip rite"). Scroll to explore. Press keys to interact.

**Note**: Image assets (`public/images/`) are not in the repository. The layout, effects, and interactions work, but images will appear broken until assets are provided.

## Keyboard Controls

| Key | Action |
|---|---|
| `M` | Mutate theme (cycle through 7 color palettes) |
| `R` | Regenerate (new random seed, fresh arrangement) |
| `S` | Freeze / thaw all animations |
| `D` | Toggle diagnostic overlay |
| `ESC` | Close any open overlay |
| Click void | Inscribe spawn effect (sigil, text, ripple, swarm) |
| Click anomaly image | Open hidden room |

## Feature Summary

- **Infinite procedural scroll** — Seeded PRNG generates clusters of 5–14 images with unique layouts, visual treatments, and animations
- **10 layout algorithms** — Spiral, drawer, nave, constellation, cabinet, wound, oriel, strip, stack, scatter
- **10 image behaviors** — Melt, split, reveal, rotate, duplicate, glitch, pulse, invert, burn, orbit
- **10 treatment dimensions** — Hue, saturation, contrast, invert, blend mode, mask shape, opacity, flip, grain
- **7 color themes** — Vessel/lime, ultraviolet/pink, infrared/red, cyanvoid/cyan, petroleum/amber, cathedral/silver, bruise/purple
- **7 hidden rooms** — Themed overlays for vessel, lunar, eye, room0, burning, micro, nave
- **Floating Win95 windows** — Draggable windows with live feed, system log, image viewer, warnings, map, diagnostics
- **Custom cursor** — Canvas-rendered crosshair with velocity-based particle trail
- **CRT overlay effects** — Scanlines, noise grain, vignette, video grain
- **SVG decorations** — 8 glyph variants, 6 diagram variants, 5 SVG filters
- **Boot sequence** — Terminal-style initialization animation

## Architecture Overview

```
ArchiveContext (single state provider)
  ├─ seed, theme, frozen, diagnostic, booted, room, spawns, log
  ├─ lib/rng.ts         ← Seeded PRNG (mulberry32)
  ├─ lib/catalog.ts     ← 60 image catalog entries
  ├─ lib/generate.ts    ← Cluster generation engine
  ├─ lib/lexicon.ts     ← All text content
  ├─ lib/themes.ts      ← 7 color themes
  └─ lib/pointer.ts     ← Mutable pointer singleton (performance)
```

See [docs/architecture.md](docs/architecture.md) for the full architectural deep-dive.

## Repository Map

```
src/
  main.tsx              Entry point
  App.tsx               Root component + Shell layout
  index.css             All CSS (variables, animations, masks, effects)
  context/
    ArchiveContext.tsx   Central state provider
  lib/
    rng.ts              Seeded PRNG (mulberry32)
    catalog.ts          Image catalog (60 entries)
    generate.ts         Cluster generation engine
    lexicon.ts          Text fragments, warnings, room copy
    themes.ts           7 color themes
    types.ts            TypeScript interfaces
    pointer.ts          Shared mutable pointer state
  components/
    AnomalyLayer.tsx    Fixed-position anomaly images
    BootSequence.tsx    Terminal boot animation
    ClickVoid.tsx       Void click → spawn effect
    Cluster.tsx         Single cluster section with parallax
    CustomCursor.tsx    Canvas cursor with particle trail
    Diagnostic.tsx      Debug grid overlay
    Diagram.tsx         SVG technical diagrams (6 variants)
    FloatingWindows.tsx Draggable Win95-style windows
    Glyph.tsx           SVG sigils (8 variants)
    HUD.tsx             Fixed heads-up display
    HiddenRoom.tsx      Room detail overlays (Framer Motion)
    InfiniteArchive.tsx Scroll-driven cluster virtualizer
    IntroRelic.tsx      Hero section with room navigation
    Keyboard.tsx        Global keydown listener
    LivingImage.tsx     Individual image with treatment + behavior
    OverlayFX.tsx       CRT scanlines, noise, vignette
    SpawnLayer.tsx      Click-spawned visual effects
    SVGFilters.tsx      SVG filter definitions
    SymbolRail.tsx      Sidebar room navigation
    WarningLabel.tsx    Styled warning labels
docs/                   Technical documentation
```

## Development Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## Documentation Index

| Document | Description |
|---|---|
| [overview.md](docs/overview.md) | Project purpose, scope, status, constraints |
| [architecture.md](docs/architecture.md) | Layer structure, component tree, build system |
| [execution-model.md](docs/execution-model.md) | Startup, initialization, animation, teardown |
| [data-flow.md](docs/data-flow.md) | Generation, interaction, and pointer flows |
| [state-model.md](docs/state-model.md) | State ownership, invariants, side effects |
| [module-reference.md](docs/module-reference.md) | API reference for all lib modules |
| [interfaces.md](docs/interfaces.md) | TypeScript type definitions |
| [performance.md](docs/performance.md) | Bundle size, bottlenecks, optimization notes |
| [testing.md](docs/testing.md) | Current state (none) + recommended strategy |
| [accessibility.md](docs/accessibility.md) | What exists, what's missing, recommendations |
| [security.md](docs/security.md) | Threat model, dependency risks, Arena scripts |
| [deployment.md](docs/deployment.md) | Build, assets, CI, hosting |
| [troubleshooting.md](docs/troubleshooting.md) | Common issues and fixes |
| [extension-guide.md](docs/extension-guide.md) | How to add images, behaviors, rooms, themes |
| [glossary.md](docs/glossary.md) | Domain, technical, and occult terminology |
| [contributor-guide.md](docs/contributor-guide.md) | "Understanding This Project in 30 Minutes" |
| [adr/001](docs/adr/001-deterministic-procgen.md) | ADR: Seeded PRNG for generation |
| [adr/002](docs/adr/002-visual-treatment-system.md) | ADR: Multi-dimensional visual treatments |
| [adr/003](docs/adr/003-theming-architecture.md) | ADR: CSS custom properties for theming |

## Testing and Deployment

**Testing**: No test suite exists. See [testing.md](docs/testing.md) for a recommended strategy starting with `lib/rng.ts` and `lib/generate.ts`.

**Build**: `npm run build` produces `dist/` (~139 KB gzipped). The project uses Vite 7.3 with React and Tailwind v4.

**CI**: The GitHub Actions workflow (`.github/workflows/webpack.yml`) is misconfigured — it runs `npx webpack` but the project uses Vite. See [deployment.md](docs/deployment.md) for the corrected pipeline.

**Assets**: The `public/images/` directory with 60 image files and `public/videos/grain.mp4` must be provided separately. See [deployment.md](docs/deployment.md) for the complete asset manifest.

## Known Limitations

- **No static assets in repo** — images and video referenced by `catalog.ts` are missing
- **No tests** — zero test files, no test framework installed
- **CI misconfigured** — GitHub Actions uses webpack instead of Vite
- **Unused dependencies** — `lucide-react` and `react-router-dom` are not imported
- **Reduced motion not dynamic** — checked once at mount, ignores mid-session OS changes
- **No error boundary** — component errors crash the entire app
- **No code splitting** — entire app is one JS bundle (388 KB)
- **No accessibility focus management** — modals don't trap focus, no skip navigation
- **No state persistence** — seed, theme, and settings reset on page reload
- **Linter warnings** — two React hooks warnings in `FloatingWindows.tsx`

## Contributing

1. Read [docs/contributor-guide.md](docs/contributor-guide.md) for a 30-minute walkthrough
2. Pick an extension point from [docs/extension-guide.md](docs/extension-guide.md)
3. Run `npm run dev` and make changes
4. Run `npm run lint` and `npm run build` before committing
5. All generation changes must maintain seed determinism — use the `rand` parameter, never `Math.random()`

## License

Not specified in the repository.
