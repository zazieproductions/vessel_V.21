# Deployment

## Build Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Build Output

```
dist/
├── index.html          30.13 KB
├── assets/
│   ├── index.css       30.81 KB (gzip: 7.05 KB)
│   └── index.js       387.81 KB (gzip: 123.01 KB)
└── (images/ if public/ existed)
```

## Static Asset Requirements

The application references assets that are **not in the repository**:

### Required Images

**Generated images** (22 files, `/public/images/gen/`):

| File | Used By |
|---|---|
| `eye-cathedral.png` | Catalog, AnomalyLayer, IntroRelic |
| `skeleton-glass.png` | Catalog, AnomalyLayer, IntroRelic |
| `wrong-moon.png` | Catalog, AnomalyLayer, IntroRelic |
| `burning-diagram.png` | Catalog, IntroRelic |
| `impossible-map.png` | Catalog, FloatingWindows |
| `melt-face.png` | Catalog |
| `botanical-impossible.png` | Catalog |
| `jewel-beetle.png` | Catalog |
| `glitch-cathedral.png` | Catalog, IntroRelic (background) |
| `dead-satellite.png` | Catalog |
| `cdrom-ui.png` | Catalog, IntroRelic |
| `mri-door.png` | Catalog |
| `sigil-seal.png` | Catalog |
| `micro-feed.png` | Catalog, IntroRelic |
| `family-blank.png` | Catalog, IntroRelic |
| `bone-engine.png` | Catalog |
| `mercury-portal.png` | Catalog, IntroRelic |
| `heart-cathedral.png` | Catalog |
| `moth-drawer.png` | Catalog |
| `brutalist-ruin.png` | Catalog |
| `crt-occult.png` | Catalog |
| `hand-moon-xray.png` | Catalog |

**Stock images** (38 files, `/public/images/stock/`):

All `s-*` entries in `catalog.ts` — `anatomy-01.jpg`, `insect-01.jpg`, `machine-01.jpg`, etc.

**Video** (1 file, `/public/videos/`):

| File | Used By |
|---|---|
| `grain.mp4` | `OverlayFX` video grain overlay |

### Asset Format

- Generated images: `.png` format, referenced as `/images/gen/*.png`
- Stock images: `.jpg` format, referenced as `/images/stock/*.jpg`
- Video: `.mp4` format, referenced as `/videos/grain.mp4`

All paths are absolute from the public root.

## Deployment Options

### Static Hosting (Recommended)

Since VESSEL is a pure client-side SPA, it can be deployed to any static hosting:

**Vercel**:
```bash
npm run build
vercel --prod
```

**Netlify**:
```bash
npm run build
# deploy dist/
```

**GitHub Pages**:
```bash
npm run build
# deploy dist/ to gh-pages branch
```

**Cloudflare Pages / S3 / any static host**: Same — build and upload `dist/`.

### Standalone Deployment Cleanup

For deployment outside the Arena platform, remove these from `index.html`:
- `<script data-arena-recording="true">...</script>` (session recording)
- `<script data-arena-views="true">...</script>` (page view tracking)
- `<script data-element-picker>...</script>` (element picker)

Also remove unused dependencies:
```bash
npm uninstall lucide-react react-router-dom
```

## CI / GitHub Actions

The current workflow (`.github/workflows/webpack.yml`) is **misconfigured**:

```yaml
# CURRENT (wrong):
- name: Build
  run: |
    npm install
    npx webpack

# SHOULD BE:
- name: Install
  run: npm ci
- name: Lint
  run: npm run lint
- name: Type Check
  run: npx tsc -b
- name: Build
  run: npm run build
```

The workflow name ("NodeJS with Webpack") and the `npx webpack` command suggest it was auto-generated or copied from a template. The project uses Vite, not Webpack. Running `npx webpack` on a Vite project either fails silently or succeeds vacuously.

### Recommended CI Pipeline

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx tsc -b
      - run: npm run build
```

## Environment Variables

The Vite config supports environment variables with `VITE_` and `NEXT_PUBLIC_` prefixes:

```typescript
envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
```

Currently **no environment variables are used** by the application. The config also injects `process.env.*` defines, which are unused.

## Browser Support

**Not explicitly defined.** Based on the technology choices:

| Feature | Minimum Support |
|---|---|
| ES2022 target | Chrome 94+, Firefox 93+, Safari 15.4+ |
| CSS `@import "tailwindcss"` | Tailwind v4 browsers |
| `crypto.getRandomValues` | All modern browsers |
| `requestAnimationFrame` | All modern browsers |
| `contenteditable="plaintext-only"` | Chrome/Edge only (falls back to `"true"`) |
| SVG filters | All modern browsers |
| CSS masks | Chrome 120+, Firefox 53+, Safari 15.4+ |

**Note**: The `@media (pointer: coarse)` media query correctly handles touch devices by restoring the native cursor. No other mobile-specific adaptations exist.
