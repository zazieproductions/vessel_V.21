# ADR-003: Theming via CSS Custom Properties

## Status

**Observed** — This is an implemented design decision.

## Context

VESSEL supports 7 color themes that change the entire visual palette. Themes must apply instantly, affect all components, and integrate with Tailwind utility classes.

## Decision

### Theme Storage

Themes are defined as plain objects in `lib/themes.ts` with 12 color fields. They are applied to `document.documentElement.style` via `setProperty()` calls in `applyTheme()`.

### CSS Variable Mapping

| Field | CSS Variable | Used By |
|---|---|---|
| `bg` | `--bg` | Body background, cluster backgrounds |
| `fg` | `--fg` | Primary text, borders |
| `accent` | `--accent` | Glyphs, cursor, primary highlights |
| `accent2` | `--accent2` | Labels, secondary highlights, diagrams |
| `warn` | `--warn` | Warning labels, anomaly badges, active states |
| `paper` | `--paper` | Hidden room backgrounds, labels, body text |
| `metal` | `--metal` | Bezel borders, neutral elements |
| `void` | `--void` | Background gradient endpoint |
| `scan` | `--scan` | CRT scanline color |
| `glow` | `--glow` | Box shadow glow effects |

### Application Pattern

```typescript
// themes.ts
export function applyTheme(theme: Theme) {
  const r = document.documentElement;
  r.style.setProperty('--bg', theme.bg);
  // ... 9 more properties
  r.dataset.theme = theme.id;
}
```

```typescript
// ArchiveContext.tsx
useEffect(() => { applyTheme(theme); }, [theme]);
```

### Tailwind Integration

Tailwind v4 uses CSS variables natively. The application uses them in utility classes:
```html
<div className="bg-[var(--bg)] text-[var(--fg)] border-[var(--accent)]/40">
```

The `/40` opacity modifier works because Tailwind supports CSS color functions.

## Consequences

**Positive**:
- Theme changes are instant (no React re-render for DOM styles)
- All components using CSS variables update automatically
- Tailwind utility classes integrate naturally
- `data-theme` attribute enables theme-specific CSS selectors if needed
- Easy to add new themes (just add objects to the array)

**Negative**:
- Theme application is imperative, not declarative — it lives outside React's rendering model
- Components that read `theme.accent` directly (not via CSS vars) do re-render on theme change (e.g., `Glyph`, `Diagram`, `CustomCursor` canvas)
- No dark/light mode distinction — all themes are dark-mode
- No user preference persistence (theme resets to `'vessel'` on reload)
- The `codename` field is purely decorative (shown in HUD and IntroRelic) — it has no semantic meaning

**Neutral**:
- The choice of 10 CSS variables is specific to this project's needs. A more generic theming system might use semantic tokens (e.g., `--color-primary`, `--color-surface`) instead of material-inspired names (`--paper`, `--metal`).
- Theme names are aesthetic (vessel, ultraviolet, infrared, etc.) rather than descriptive (lime, pink, red, etc.).

## Alternatives Considered

- **CSS-in-JS (styled-components, emotion)**: Adds runtime overhead and dependency weight for a benefit this project doesn't need (scoped styles). Rejected.
- **Tailwind theme config**: Would require rebuilding to change themes. Dynamic CSS vars are better for runtime theme cycling.
- **React Context only (no CSS vars)**: Would require all style values to pass through JS, causing more re-renders. Rejected.
- **CSS `color-scheme`**: Too limited (only light/dark). Doesn't support the palette diversity needed.
