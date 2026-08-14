# ADR-002: Visual Treatment System

## Status

**Observed** — This is an implemented design decision.

## Context

The catalog contains 60 real and generated images. Without visual processing, a finite set of images would look repetitive in an infinite scroll. The images need to feel like artifacts from an occult archive — distorted, aged, processed.

## Decision

Apply a multi-layer visual treatment to each image using CSS:

### Treatment Parameters (10 dimensions)

| Parameter | Range | Probability | CSS Property |
|---|---|---|---|
| `hue` | -40 to 80 | Always | `filter: hue-rotate()` |
| `sat` | 0.7 to 1.7 | Always | `filter: saturate()` |
| `contrast` | 0.85 to 1.45 | Always | `filter: contrast()` |
| `invert` | 0.4 to 1.0 | 8% chance | `filter: invert()` |
| `blend` | 10 blend modes | 35% chance of non-"normal" | `mix-blend-mode` |
| `mask` | 7 mask shapes | 28% chance of non-"none" | CSS mask-image |
| `opacity` | 0.78 to 1.0 | Always | `opacity` |
| `flipX` | boolean | 12% chance | `transform: scaleX(-1)` |
| `flipY` | boolean | 4% chance | `transform: scaleY(-1)` |
| `grain` | 0 to 0.45 | Always | Noise overlay opacity (shown when > 0.15) |

### Hover Amplification

On hover, treatment values are amplified:
- `hue` += 40
- `sat` *= 1.25
- `contrast` *= 1.1
- `invert` swaps between current and `1 - current`
- Scale increases to 1.06

### Layering

Each image is rendered as:
1. Optional under-layer (45% chance, for "reveal" behavior)
2. Primary image with CSS filter chain
3. Optional duplicate ghost (for "duplicate" behavior on hover)
4. Noise overlay (when grain > 0.15)
5. Badge ("ORDINARY" or "ANOMALY")

## Consequences

**Positive**:
- 60 images × 10 treatment dimensions × 10 behaviors = effectively infinite visual variety
- CSS filters are GPU-accelerated
- Treatments are deterministic from the seed — reproducible
- The hover amplification creates interactive depth without JS complexity

**Negative**:
- SVG displacement filters (melt) are expensive on integrated GPUs
- Multiple CSS masks on many elements can cause compositing overhead
- The treatment system is entirely CSS-driven — no server-side or canvas-based image processing
- No A/B testing or visual QA pipeline exists for treatment quality

**Neutral**:
- The probability distributions (8% invert, 35% blend, 28% mask) were chosen aesthetically, not empirically. They could be tuned.
- The hover amplification values (40° hue, 1.25× sat, 1.1× contrast) are magic numbers without documented rationale.
