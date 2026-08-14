# Testing

## Current State

**There are no tests.** No test framework is installed, no test files exist, and no test scripts are defined in `package.json`.

This is the single largest gap in the project's engineering quality.

## Testing Strategy (Recommended)

### Unit Tests — `lib/`

The generation layer (`lib/`) is the most testable part of the codebase. All functions are pure, deterministic, and side-effect-free.

**Priority 1 — `rng.ts`**

```typescript
// Verify determinism: same seed → same sequence
// Verify distribution: large sample converges to uniform
// Verify edge cases: empty string, single char, salt mixing
```

| Test Case | Assertion |
|---|---|
| `hashString("")` returns consistent value | Deterministic |
| `hashString("abc")` !== `hashString("abd")` | Different inputs → different outputs |
| `mulberry32(seed)` sequence is deterministic | Same seed, same 1000 values |
| `rngFrom("abc")` !== `rngFrom("abc", "salt")` | Salt changes the sequence |
| `pick(rand, [1])` always returns 1 | Single-element array |
| `chance(rand, 0)` always returns false | Zero probability |
| `chance(rand, 1)` always returns true | Certain probability |
| `range(rand, 5, 10)` ∈ [5, 10) | Range bounds |
| `irange(rand, 3, 7)` ∈ {3, 4, 5, 6, 7} | Inclusive integer range |

**Priority 2 — `generate.ts`**

```typescript
// Snapshot test: generateCluster("TESTSEED", 0) produces stable output
// Layout coverage: all 10 layouts produce valid positions
// Anomaly detection: index 7, 14, 21... have anomalies
// Node counts: oriel → 5-8, others → 7-14
// Position bounds: all x ∈ [0, 100], y ∈ [0, 100]
```

| Test Case | Assertion |
|---|---|
| `generateCluster("A", 0)` equals snapshot | Reproducible output |
| `generateCluster("A", 0)` === `generateCluster("A", 0)` (run twice) | Pure function |
| Cluster 0 layout is always `'oriel'` | First cluster invariant |
| All node positions are within bounds | No overflow |
| Anomaly appears at index 7 | Per-7th-cluster rule |

**Priority 3 — `themes.ts`**

| Test Case | Assertion |
|---|---|
| `themeById('vessel')` returns vessel theme | Lookup works |
| `themeById('nonexistent')` returns first theme | Fallback |
| `nextThemeId` cycles through all 7 themes | Circular rotation |
| All themes have all 10 required properties | Completeness |

**Priority 4 — `catalog.ts`**

| Test Case | Assertion |
|---|---|
| All ids are unique | No duplicates |
| All `kind` values are valid `ImageKind` | Type safety |
| All `ratio` values are positive | Valid aspect ratios |
| `RARES` ⊂ `CATALOG` | Correct subset |
| `NORMALS` ⊂ `CATALOG` | Correct subset |

### Component Tests

Component testing would require a DOM environment (jsdom or happy-dom) and React Testing Library.

**Priority components**:

1. **`BootSequence`** — Verify it renders boot lines sequentially and transitions to `booted`
2. **`Keyboard`** — Verify key bindings call correct context methods
3. **`ClickVoid`** — Verify clicks on void space trigger `spawnAt`, clicks on interactive elements do not
4. **`LivingImage`** — Verify treatment filters are applied, room click calls `openRoom`

### Integration Tests

**Seed-based snapshot test**: Generate clusters for a known seed, verify the entire rendered output matches a snapshot. This catches regressions in the generation pipeline.

### Visual Regression Tests

The project is heavily visual. Playwright or Chromatic screenshot tests would catch:
- Broken CSS masks
- Animation regressions
- Theme application failures
- Layout overflow

### What NOT to Test

- Arena platform scripts (not part of the application)
- CSS animation timing (tested visually or with screenshot tools)
- `pointer.ts` singleton behavior (display-only, no correctness requirement)
- Framer Motion transitions (library responsibility)

## Recommended Test Infrastructure

```json
// package.json additions
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "vitest": "^3.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "jsdom": "^26.x"
  }
}
```

Vitest is recommended over Jest because the project already uses Vite and Vitest shares the same configuration.

## CI Gap

The current GitHub Actions workflow (`webpack.yml`) runs:
```yaml
npm install
npx webpack
```

This is **incorrect** — the project uses Vite, not Webpack. The `npx webpack` command likely succeeds only because it falls back to some default behavior or fails silently. The workflow should be:

```yaml
npm ci
npm run lint
npm run build
npm run test   # (once tests exist)
```

The workflow also does not cache `node_modules`, does not run linting, and does not run type checking (`tsc -b`).
