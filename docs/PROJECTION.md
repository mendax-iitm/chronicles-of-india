# Projection decision (Phase 1)

**Status: Adopted.** Lambert conformal conic (LCC) is the default projection for Chronicles of India.
The legacy equirectangular projection remains accessible for visual comparison via `index.html?proj=equirect`.

## Options

| | Equirectangular ×0.93 (current) | Lambert conformal conic |
|---|---|---|
| Parameters | x = (lon − 58)·K·0.93, y = (39 − lat)·K | standard parallels 15°N / 31°N, centre 23°N 80°E, pinned to the same centre and scale |
| Shapes | E–W stretch vs N–S: −6% at 8°N, +1% at 23°N, +8.5% at 31°N, **+16% at 37°N** | conformal: shapes true everywhere |
| Sizes | N–S scale constant | ±3.4% max across 8–37°N (0% at 23°N) |
| Look | rectangular graticule; Kashmir, Punjab and Afghanistan visibly wide | slightly fanned; the north narrows the way school atlases show it |

## What the conic actually cost (measured, not estimated)

The conic is already implemented in `index.html`, so these are the real costs:

1. **Code: about 10 lines.** One forward function, one inverse. The 7 `px`/`py` call-site pairs
   now pass both lon and lat, routed through a single `XY(lon, lat)`. This refactor is already in
   place and is harmless under either projection.
2. **Hit-testing: no cost.** SVG handles polygon hit-testing natively, in any projection.
3. **Clicks and quiz scoring: no cost.** `toLonLat` uses the exact conic inverse (round-trip
   error is about 1e-14°). Tests tapping 7 cities from Kabul to Colombo land within 0.001°
   (about 100 m) in both projections. Distances are still computed with haversine on lon/lat.
4. **Labels: no cost.** Label anchors are lon/lat centroids projected like everything else.
   The greedy collision test runs in screen space and is unchanged.
5. **Frame corners: small cost.** The geography is clipped to the box 56–102°E, 3–40°N. In
   the conic that box is no longer a rectangle, so its slanted edges show at the top-left and
   right of the frame. **Fix: widen the box in `scripts/build-geo.mjs`** (about 50–110°E,
   0–45°N), which adds an estimated 10–20 KB of coastline. This is a one-line change and a
   rebuild.
6. **Long straight edges: cosmetic.** Lines of latitude curve in the conic, but an atom edge
   drawn between two far-apart nodes stays straight. This is only noticeable on the long
   frontier edges (KABUL, BALOCH) and invisible on the subcontinent itself. Fix if wanted:
   densify those edges in `scripts/build-atoms.mjs`.
7. **Terrain: zero runtime cost.** The hillshade has to be resampled into whichever
   projection wins. It is generated after this decision, so it is built only once.

## Recommendation

**Adopt the conic.** It removes up to 16% shape distortion in the north (Kashmir, Punjab,
Afghanistan, Tibet) and 6% in the far south, for about 10 lines of code. Hit-testing,
labels and quiz scoring are unaffected. The cleanup is a wider geography box (item 5);
densifying the long frontier edges (item 6) is optional. If approved:

1. Make `lcc` the default (keep `?proj=equirect` for comparison), and widen the build-geo box.
2. Build the terrain hillshade in the conic.

If declined: delete the `LCC` block and the `PROJ` switch. Keep the `XY` refactor.
