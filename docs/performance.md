# Performance

## Bundle Size

| Asset | Size | Gzipped |
|---|---|---|
| `index.html` | 30.13 KB | 9.21 KB |
| `index.css` | 30.81 KB | 7.05 KB |
| `index.js` | 387.81 KB | 123.01 KB |
| **Total** | **~449 KB** | **~139 KB** |

The JS bundle is a single chunk with no code splitting. The largest contributor is `framer-motion` (~150 KB), which is used only for `HiddenRoom` enter/exit transitions.

## Performance-Sensitive Paths

### 1. Pointer Tracking (60fps)

`CustomCursor` runs a `requestAnimationFrame` loop that:
- Computes velocity from previous position
- Writes to `lib/pointer.ts` singleton
- Manages a particle array (up to 42 items)
- Clears and redraws the entire canvas each frame
- Updates DOM positions of the cursor ring and HUD text

**Cost**: Moderate. Canvas operations are lightweight. The main risk is DOM thrashing from style updates on the ring element, but these are isolated to `transform` and `filter` properties which trigger composite-only layout.

### 2. Scroll Handling

`InfiniteArchive` attaches a `passive: true` scroll listener with `requestAnimationFrame` throttling:
- Computes visible cluster range from scroll position
- Triggers `setState` only if the range changed

`Cluster` attaches its own scroll listener for parallax:
- Updates `--para` CSS variable on all `[data-para]` elements via `style.setProperty`

**Cost**: Low with current cluster counts (2–5 visible). Each cluster has 7–14 images with parallax, so ~30–70 `setProperty` calls per scroll frame. This is acceptable.

### 3. OverlayFX Canvas (20fps effective)

`OverlayFX` generates random noise on a 180×120 canvas every 3rd frame (~20fps at 60fps):
- Creates a 180×120×4 = 86,400 byte `ImageData`
- Fills with `Math.random()` values
- Puts to canvas

**Cost**: Low. The canvas is small and the operation is O(pixels) with no allocation pressure (single `ImageData` buffer reused). However, `Math.random()` is used instead of the seeded PRNG — this is intentional (visual noise should be truly random, not deterministic).

### 4. Noise Overlay CSS Animation

The `.noise-overlay` class applies a CSS animation (`noiseShift`, 0.8s, steps(4)) that translates an SVG noise pattern. This runs on every element with the class — typically 1 (global overlay) + 7–14 per cluster (images with grain > 0.15).

**Cost**: Moderate on low-end GPUs. Each masked/animated element is a compositing layer. With 5 visible clusters averaging 10 images each, ~50 noise overlays could be active. This is the most likely source of jank on mobile.

### 5. SVG Filters

`SVGFilters` defines 5 filters used by various animations:
- `melt0`, `melt1` — turbulence + displacement (GPU-heavy)
- `rgbSplit` — color matrix + blend
- `velDistort` — turbulence + displacement
- `grainF` — turbulence + color matrix + blend
- `softGlow` — gaussian blur + merge

The melt animation cycles between `melt0` and `melt1` filters. Each filter application is a GPU operation that can be expensive on integrated graphics.

## Re-render Analysis

### Context Consumer Count

All components call `useArchive()`, making them context consumers. A single state change causes all 15+ components to re-render:

`BootSequence`, `AnomalyLayer`, `IntroRelic`, `InfiniteArchive`, `Cluster`, `LivingImage`, `SymbolRail`, `FloatingWindows`, `SpawnLayer`, `Diagnostic`, `HUD`, `HiddenRoom`, `Keyboard`, `ClickVoid`, `OverlayFX`, `CustomCursor`

**Mitigating factors**:
- Most components bail out early when their relevant state hasn't changed (React's reconciliation is effective)
- `useMemo` is used for expensive computations (`generateCluster`, `themeById`, `makeWindows`)
- The actual DOM diffing is lightweight since most components render static content

**Risk**: The `frozen` toggle affects every `LivingImage` (7–14 per visible cluster × 2–5 clusters = 14–70 components), which recompute their `behaveClass` string. This is fast but not free.

### Optimization Opportunities

1. **Split context** — separate `theme`, `frozen`, `seed` into independent contexts
2. **Use `useMemo` selectors** — extract only needed fields
3. **React.memo** on `LivingImage`, `Glyph`, `Diagram`, `WarningLabel`
4. **Lazy load framer-motion** — it's 150 KB used only for `HiddenRoom`
5. **Code splitting** — dynamic import for `FloatingWindows`, `HiddenRoom`, `Diagnostic`

## Known Bottlenecks

| Area | Issue | Severity | Location |
|---|---|---|---|
| Context re-renders | All consumers re-render on any state change | Low (current scale) | `ArchiveContext` |
| Melt filter | SVG turbulence + displacement is GPU-intensive | Medium | `LivingImage` + `SVGFilters` |
| Noise overlays | Many animated masked elements | Medium | `OverlayFX` + `LivingImage` |
| framer-motion | 150 KB for modal transitions | Low (one-time load) | `HiddenRoom` |
| No image optimization | Images loaded as-is, no responsive srcset | Medium (with real assets) | `CatalogItem.src` |
| `Date.now()` in render | `FloatingWindows` feed counter calls `Date.now()` during render | Negligible but impure | `FloatingWindows:88` |
| setState in effect | `FloatingWindows` calls `setWins(base)` in useEffect | Negligible but linted | `FloatingWindows:32` |

## Measurement Notes

The following have **not been measured** and are noted as areas for investigation:

- First Contentful Paint (FCP) — depends on Google Fonts loading
- Largest Contentful Paint (LCP) — likely the boot sequence or first cluster
- Total Blocking Time (TBT) — boot sequence delays are pure timeouts, not JS blocking
- Cumulative Layout Shift (CLS) — images load lazily without reserved dimensions, which may cause shifts

## Reduced Motion Performance

When `prefers-reduced-motion: reduce`:
- All CSS animations are disabled via `@media` query
- `OverlayFX` canvas rendering is skipped entirely
- `AnomalyLayer` returns null (removes 3 fixed-position images)
- `CustomCursor` suppresses particle generation
- Video grain layer is not rendered

This significantly reduces GPU and CPU load.
