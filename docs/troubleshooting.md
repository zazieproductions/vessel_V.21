# Troubleshooting

## Common Issues

### Images are broken / not loading

**Symptom**: All image slots show broken image icons. The layout works but no images render.

**Cause**: The `public/images/` directory does not exist in the repository. The `catalog.ts` file references 60 images under `/images/gen/` and `/images/stock/`, but these files must be provided separately.

**Fix**: Create the `public/images/gen/` and `public/images/stock/` directories and populate them with the image files listed in `catalog.ts`. See [deployment.md](./deployment.md) for the full asset list.

### Build fails with TypeScript errors

**Symptom**: `npm run build` fails during `tsc -b`.

**Fix**: Ensure you're using TypeScript ~5.9.3. Run `npx tsc -b --noEmit` to see errors. The project currently type-checks cleanly as of the latest commit.

### ESLint warnings

**Symptom**: `npm run lint` shows two warnings in `FloatingWindows.tsx`.

**Known issues**:
1. `set-state-in-effect` at line 32 — `setWins(base)` called inside `useEffect`. This is a pattern that should use derived state or be refactored.
2. `purity` at line 88 — `Date.now()` called during render. Should be moved to a `useEffect` with `setInterval`.

These are warnings, not errors. The application functions correctly despite them.

### Animations are jerky / low FPS

**Possible causes**:
- Many active SVG melt/displacement filters (check if images with `behavior: 'melt'` are numerous)
- Noise overlays on many images simultaneously
- Running on a device with integrated GPU

**Mitigations**:
- Press `S` to freeze animations
- The `prefers-reduced-motion` media query disables most effects
- Consider reducing the cluster count in `InfiniteArchive` (`START_COUNT` constant)

### Custom cursor doesn't appear

**Cause**: `CustomCursor` is hidden on touch devices via:
```css
z-[80] hidden [@media(pointer:fine)]:block
```

On devices with `pointer: coarse` (touch), the native cursor is restored instead.

### Boot sequence doesn't appear

**Cause**: If `booted` is somehow `true` at mount (should not happen), `BootSequence` returns `null`. This cannot happen without code modification since the initial state is `false`.

### Theme doesn't change

**Cause**: Check that keyboard focus is not on an input element. `Keyboard.tsx` ignores keydowns when `e.target` is an `INPUT`, `TEXTAREA`, or `contentEditable` element.

### Floating windows overlap content

**Cause**: Windows are positioned absolutely within a fixed container. Their initial positions are computed from the seed and viewport dimensions. On very small viewports, windows may overlap significantly.

**Fix**: Close windows by clicking the `×` button on their title bar.

### Scroll resets unexpectedly

**Cause**: Pressing `R` (regenerate) calls `regenerate()`, which changes the seed. `InfiniteArchive` has a `useEffect` that resets `window.scrollTo(0, 0)` when the seed changes. This is intentional.

### Diagnostic overlay shows stale data

**Cause**: `Diagnostic` polls `pointer.ts` every 80ms. There may be a brief lag between pointer movement and display update. This is by design (polling vs. continuous rendering).

## Development Issues

### HMR doesn't work

**Cause**: The `.vite-source-tags.js` plugin transforms JSX at build time. If it encounters a parsing error, Vite may silently skip it (the `try/catch` in `vite.config.ts`).

**Fix**: Check the Vite console for plugin errors. The source tags plugin is non-essential — if it fails, the app still works but the Arena element picker won't have source locations.

### Node modules issues

```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript project references

The project uses TypeScript project references (`tsconfig.json` references `tsconfig.app.json` and `tsconfig.node.json`). If you get stale build artifacts:

```bash
rm -rf node_modules/.tmp
npx tsc -b --clean
npx tsc -b
```

## Unresolved Issues

| Issue | Status | Notes |
|---|---|---|
| CI uses webpack instead of Vite | **Unfixed** | `.github/workflows/webpack.yml` |
| Static assets missing from repo | **Unresolved** | Images and video not committed |
| Unused dependencies | **Not cleaned up** | `lucide-react`, `react-router-dom` |
| `reduced` not re-evaluated | **Known limitation** | Requires page reload |
| No error boundary | **Known limitation** | Component errors crash the app |
