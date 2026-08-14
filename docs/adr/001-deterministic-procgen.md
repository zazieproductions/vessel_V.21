# ADR-001: Deterministic Procedural Generation via Seeded PRNG

## Status

**Observed** — This is an implemented design decision, not a proposal.

## Context

VESSEL generates infinite scrollable content from a finite image catalog (60 items). Each "cluster" of images must be procedurally arranged with varied positions, treatments, behaviors, and decorations. The experience must be reproducible: the same seed should produce the same arrangement.

## Decision

Use a custom mulberry32 PRNG (`lib/rng.ts`) seeded deterministically. All generation functions accept an `RNG` function parameter and never use `Math.random()`. The initial seed is 8 random hex characters from `crypto.getRandomValues`.

### Design Details

- **PRNG algorithm**: mulberry32 — a fast, simple 32-bit PRNG with period 2³²
- **Seeding**: `rngFrom(seed, ...salt)` combines a string seed with optional salt values using golden-ratio multiplication (`0x9e3779b9`, `0x85ebca6b`)
- **Salt convention**: `generateCluster` uses `rngFrom(seed, 'cluster', index)`, creating independent RNG streams per cluster
- **Derivation**: Each call to `rngFrom` with the same (seed, salt) pair returns an identical RNG sequence
- **Helper functions**: `pick`, `pickN`, `range`, `irange`, `chance` provide typed, ergonomic random selection

### Exception

`spawnAt()` in `ArchiveContext` uses `Math.random()` for spawn kind and payload selection. This is intentional: spawn effects are ephemeral, non-reproducible interactions. They do not affect the cluster layout.

`hexSeed()` uses `crypto.getRandomValues` for the initial seed. This is the only source of true randomness.

## Consequences

**Positive**:
- Same seed, same organism — every aspect of the visual layout is reproducible
- Snapshot testing is trivial: assert `generateCluster("SEED", 0)` matches stored output
- No state synchronization issues: generation is pure computation
- Performance: generation is fast (no network, no storage)

**Negative**:
- mulberry32's 32-bit period means sequences repeat after ~4 billion calls. In practice this is not reached since each cluster only consumes ~100–200 random values.
- String hashing (`hashString`) uses a simple FNV-1a variant. Collision resistance is adequate for this use case but not cryptographic.
- The salt-based derivation pattern is informal. There is no formal proof that `(seed, "cluster", 0)` and `(seed, "cluster", 1)` produce independent streams (they do in practice due to golden-ratio mixing).

**Neutral**:
- Changing the PRNG algorithm would break all existing seeds — the visual output would change completely. This is acceptable for an experimental project but would be a breaking change for any deployment that relies on specific seed appearances.

## Alternatives Considered

- **`Math.random()`**: Non-deterministic, not reproducible. Rejected.
- **`crypto.getRandomValues` per call**: Overkill for procedural generation, not reproducible. Rejected.
- **`seedrandom` library**: More robust PRNG with better statistical properties. Adds a dependency for marginal benefit. Not adopted.
- **Perlin/Simplex noise**: Useful for spatial variation but unnecessary for the selection-based generation used here. Not adopted.
