# Understanding This Project in 30 Minutes

A walkthrough for new contributors. By the end, you'll be able to run the project, trace how it works, and make your first change.

## Step 1: Run It (2 minutes)

```bash
npm install
npm run dev
```

Open the URL shown in your terminal (typically `http://localhost:5173`).

You'll see a terminal-style boot sequence typing system initialization lines. After a few seconds (or click "skip rite"), the main interface appears: an infinite scroll of occult imagery with floating windows, a custom cursor, and a HUD.

**Note**: Images will be broken unless you provide the `public/images/` assets. The structure and layout will still be visible.

## Step 2: Locate the Entry Point (3 minutes)

The entry chain is short:

```
index.html → src/main.tsx → src/App.tsx → ArchiveProvider → Shell
```

- **`main.tsx`** — 10 lines. Mounts `<App />` inside `<StrictMode>`.
- **`App.tsx`** — 47 lines. Wraps everything in `<ArchiveProvider>`, then renders `<Shell>`.
- **`Shell`** — The component that lists every visual layer in the application (16 components).

Open `src/App.tsx` and look at the `Shell` component. This is the complete render tree of the application. Every line in `Shell` is a distinct visual layer, listed in z-order from back to front.

## Step 3: Trace One Operation — Pressing 'R' to Regenerate (5 minutes)

Follow this path through the code:

1. **`Keyboard.tsx`** — A global `keydown` listener. When `e.key === 'r'`, it calls `regenerate()`.

2. **`ArchiveContext.tsx` → `regenerate()`** — Generates a new `hexSeed(8)`, sets it as `seed`, clears `spawns`, and pushes a log line.

3. **`InfiniteArchive.tsx`** — Has `seed` as a dependency of its `useMemo`. When seed changes:
   - Calls `generateCluster(seed, 0)` through `generateCluster(seed, 4)` for the visible range
   - `useEffect` resets scroll to top

4. **`lib/generate.ts` → `generateCluster(seed, index)`** — The core function. For each cluster:
   - Creates an RNG: `rngFrom(seed, 'cluster', index)`
   - Picks a layout (cluster 0 always gets `'oriel'`)
   - Generates 5–14 image nodes, each with position, treatment, behavior, caption
   - Generates glyphs, warnings, diagrams

5. **`lib/rng.ts` → `rngFrom(seed, 'cluster', index)`** — Creates a deterministic RNG. The `seed` string is hashed, then mixed with salt values using golden-ratio multiplication.

6. **`Cluster.tsx`** — Renders each cluster section. Maps over `spec.nodes` to render `<LivingImage>` components.

7. **`LivingImage.tsx`** — Renders an `<img>` with CSS filters computed from the node's `treatment` field. The CSS class is determined by the `behavior` field.

**Key insight**: The same seed always produces the same images in the same positions with the same treatments. Pressing R changes everything; refreshing the page with the same seed restores everything.

## Step 4: Understand the State Model (5 minutes)

Open `src/context/ArchiveContext.tsx`. This single React Context is the **entire state** of the application:

| State | What It Controls |
|---|---|
| `seed` | Everything — all generation derives from this |
| `themeId` | Which of the 7 color palettes is active |
| `frozen` | Whether animations are playing |
| `diagnostic` | Whether the debug overlay is showing |
| `booted` | Whether the boot sequence is complete |
| `room` | Which hidden room overlay is open (if any) |
| `spawns` | Active click-spawn effects |
| `log` | System log lines |

That's it. There's no Redux, no Zustand, no complex state machines. One context, one provider, 15 consumers.

The only state outside this context is `lib/pointer.ts` — a plain JavaScript object that stores cursor position and velocity. It bypasses React for performance (60fps updates would cause too many re-renders).

## Step 5: Identify the Extension Points (5 minutes)

### Easy extensions (no risk):
- **Add an image**: Add an entry to `CATALOG` in `src/lib/catalog.ts`
- **Add a theme**: Add a `Theme` object to `THEMES` in `src/lib/themes.ts`
- **Add text**: Add entries to `FRAGMENTS`, `WARNINGS`, etc. in `src/lib/lexicon.ts`

### Medium extensions (moderate risk):
- **Add a behavior**: Modify `Behavior` type, add CSS class + animation in `index.css`, add mapping in `LivingImage.tsx`
- **Change layout**: Modify the `place()` function in `generate.ts`
- **Add a hidden room**: Add `RoomId`, add `ROOM_COPY`, add catalog items, add `SymbolRail` button

### High-risk extensions (understand first):
- **Change PRNG**: Would break all existing seeds
- **Change Context shape**: Would break all 15+ consumers
- **Change `ClusterSpec` shape**: Would break generation and rendering

## Step 6: Locate the Relevant Tests (1 minute)

There are no tests. The project has zero test files, no test framework, and no test scripts.

If you're adding tests, start with `lib/rng.ts` and `lib/generate.ts` — they are pure functions and easy to test. See [testing.md](./testing.md) for recommendations.

## Step 7: Make One Safe Small Change (5 minutes)

Let's add a new text fragment to the lexicon.

1. Open `src/lib/lexicon.ts`
2. Find the `FRAGMENTS` array
3. Add a new line at the end:
```typescript
'THE CURSOR REMEMBERS WHAT THE EYE FORGETS',
```
4. Save the file
5. Press `R` in the browser to regenerate
6. Click on empty space several times — eventually you'll see a "text" spawn effect that includes your new fragment
7. Your fragment may also appear as an image caption in some clusters (40% chance per image)

**That's it.** You've made a deterministic, non-breaking change to the procedural generation system. The seed still determines everything — your new text simply enters the pool of possible selections.

## Quick Reference

| Want to... | Look at... |
|---|---|
| Change how images are arranged | `src/lib/generate.ts` → `place()` |
| Change visual effects on images | `src/components/LivingImage.tsx` |
| Change color themes | `src/lib/themes.ts` |
| Change keyboard shortcuts | `src/components/Keyboard.tsx` |
| Change what the HUD shows | `src/components/HUD.tsx` |
| Change floating windows | `src/components/FloatingWindows.tsx` |
| Change boot sequence text | `src/components/BootSequence.tsx` |
| Change hidden room content | `src/lib/lexicon.ts` → `ROOM_COPY` |
| Change cursor behavior | `src/components/CustomCursor.tsx` |
| Change overlay effects | `src/components/OverlayFX.tsx` + `src/index.css` |
| Change spawn effects | `src/components/SpawnLayer.tsx` + `src/context/ArchiveContext.tsx` |
| Change image masks | `src/index.css` (`.mask-*` classes) |
| Change SVG glyphs | `src/components/Glyph.tsx` |
| Change SVG diagrams | `src/components/Diagram.tsx` |
