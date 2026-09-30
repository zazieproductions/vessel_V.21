# Accessibility

## Current State

Accessibility is **minimal**. The project prioritizes visual atmosphere over accessibility, which is a deliberate (though undocumented) tradeoff for an experimental art piece.

### What Exists

| Feature | Location | Notes |
|---|---|---|
| `aria-label` on anomaly buttons | `AnomalyLayer.tsx` | "lunar annex", "the eye", "glass skeleton" |
| `aria-label` on intro buttons | `IntroRelic.tsx` | "mercury portal" |
| `aria-label` on room nav buttons | `SymbolRail.tsx` | Room IDs as labels |
| `aria-hidden` on decorative layers | `SpawnLayer`, `Diagnostic`, `OverlayFX`, `CustomCursor` | Prevents screen reader noise |
| `prefers-reduced-motion` | `ArchiveContext`, `index.css` | Disables animations |
| `alt` text on images | `CatalogItem.alt` | Present on catalog images |
| `loading="lazy"` on images | `LivingImage.tsx` | Defers off-screen image loading |
| `playsInline` on video | `OverlayFX.tsx` | Prevents fullscreen on mobile |

### What Is Missing

#### Keyboard Navigation

- **No focus management**: Tab order is undefined. The custom cursor hides the native cursor via `cursor: none`, and there is no focus indicator styling.
- **No focus trap**: `HiddenRoom` modal does not trap focus. A keyboard user can tab behind the overlay.
- **No skip navigation**: No way to bypass the boot sequence or scroll directly to content.
- **Keyboard shortcuts conflict**: Single-letter shortcuts (M, R, S, D) are bound globally and would conflict with screen reader shortcuts on some platforms.

#### Screen Readers

- **Boot sequence is inaccessible**: Terminal animation text is rendered as `<div>` elements without semantic meaning.
- **Image treatments obscure content**: CSS filters, masks, and blend modes make images visually different from their `alt` text.
- **HUD information is `pointer-events-none`**: The HUD displays seed, coordinates, and depth — this information is not accessible to assistive technology.
- **Floating windows lack ARIA roles**: The Win95-style windows have no `role="dialog"`, no `aria-labelledby`, and no close-button labels.
- **Spawn effects are decorative but announced**: Spawn layer has `aria-hidden` but spawn text content would not be accessible.

#### Color Contrast

- Text colors are theme-dependent. The default `vessel` theme uses `#c8ff3d` (lime) on `#050508` (near-black), which has a contrast ratio of approximately 12.5:1 — **passes WCAG AAA**.
- However, many text elements use opacity modifiers (`text-[var(--paper)]/55`, `text-[var(--paper)]/70`) which reduce effective contrast. At 55% opacity, the contrast may drop below 4.5:1 depending on the background.
- Warning text (`--warn: #ff2a1a` on dark backgrounds) has adequate contrast.

#### Motion

- `prefers-reduced-motion` is respected for CSS animations and canvas rendering.
- **Gap**: The `reduced` flag is read once at mount and never updated. If a user enables reduced motion mid-session, the app continues with full animations until reload.
- **Gap**: The boot sequence animation (typing effect) is not disabled by reduced motion.
- **Gap**: Framer Motion transitions in `HiddenRoom` are not affected by the `reduced` flag.

#### Touch / Mobile

- `@media (pointer: coarse)` restores the native cursor, which is correct.
- Layout is not mobile-optimized. The infinite archive and floating windows assume desktop viewport.
- No touch-specific interactions (tap-to-spawn works via click, but drag for floating windows uses pointer events).

## Recommendations

### High Priority

1. Add `role="dialog"` and `aria-labelledby` to `HiddenRoom` modal
2. Add `aria-label` to floating window close buttons
3. Trap focus inside `HiddenRoom` when open
4. Add visible focus indicators to interactive elements
5. Respect `prefers-reduced-motion` for boot sequence animation

### Medium Priority

6. Add `role="status"` or live region for log updates
7. Provide a way to skip the boot sequence via keyboard
8. Ensure all color contrast meets WCAG AA (4.5:1) across all themes
9. Make floating windows keyboard-navigable (Escape to close, Tab to cycle)
10. Update `reduced` flag dynamically via `matchMedia.addEventListener`

### Low Priority

11. Provide an alternative text-only mode for screen readers
12. Add high-contrast theme option
13. Ensure spawn effects don't trigger vestibular reactions (currently they are short-duration and non-repeating)
14. Add `prefers-contrast` media query support
