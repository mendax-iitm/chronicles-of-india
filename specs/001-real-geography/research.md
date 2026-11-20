# Research: Phase 1 — Real Geography

Each item: Decision / Rationale / Alternatives. Items marked **verify** must be confirmed during the
first task that touches them; if verification fails, fall back to the stated alternative.

## R1. Vector source and layers

- **Decision**: Natural Earth 10m, downloaded from `naciscdn.org/naturalearth/10m/...`:
  `physical/ne_10m_land`, `physical/ne_10m_minor_islands`, `physical/ne_10m_rivers_lake_centerlines`,
  `physical/ne_10m_lakes`, `physical/ne_10m_geography_regions_polys`.
- **Rationale**: Public domain, global, named rivers and lakes, already the BRIEF default.
- **Coastline from land polygons, not `ne_10m_coastline` lines**: the renderer needs a closed ring
  for `<clipPath>`. Clip land to the bbox; the largest resulting polygon is `coast`; the rest are
  `islands`.
- **No modern borders drawn**: `admin_0_countries` is not used in Phase 1 (modern boundaries belong
  to the Phase 4 X-ray lens).
- **Alternatives**: GSHHG (heavier, licence history less clean) — rejected; OSM coastlines (ODbL,
  share-alike) — forbidden by Principle II.

## R2. Clip, simplify, round

- **Decision**: mapshaper `-clip bbox=58,5,98,38` → `-simplify weighted <pct> keep-shapes` →
  `-filter-islands` with a named keep-list (Lakshadweep, Andaman, Nicobar) → `-o precision=0.01`.
  Tune `<pct>` by eye at max zoom; start at ~5% and record the final value in the script header.
- **Rationale**: mapshaper is the BRIEF-named tool; `keep-shapes` stops small islands vanishing.
- **Ceiling**: one global simplification level. If max zoom facets, add a finer coast used only
  above a zoom threshold (later work, not now).
- **Determinism (SC-008)**: pin mapshaper version; sort output arrays by name; stable key order.

## R3. Loading under `file://`

- **Decision**: build writes `data/base.json` and `data/base.js` (`window.ATLAS_BASE={...};`).
  `index.html` loads `<script src="data/base.js">` before the main script.
- **Rationale**: browsers block `fetch()` on `file://`; a script tag works everywhere. BRIEF §5
  names this exact fallback.
- **Alternatives**: inline into `index.html` (bloats hand-edited file); fetch-only (breaks
  "just open it").

## R4. DEM and hillshade

- **Decision**: AWS Terrain Tiles (Terrarium PNG encoding) at zoom 7 (~1 km/px at 25°N), only the
  tiles covering the bbox. Decode with `pngjs`, compute Horn hillshade (azimuth 315°, altitude 45°,
  z-factor tuned by eye), resample into the map projection, encode greyscale JPEG (q≈70) as a 4×4
  tile grid (`data/terrain/r{r}c{c}.jpg`) plus `manifest.json`.
- **Licence — verify**: Terrain Tiles merge several sources; over South Asia they are SRTM,
  GMTED2010 and ETOPO1, all US-government public domain. Confirm from the Terrain Tiles attribution
  list before committing output; credit in `docs/SOURCES.md`. **Fallback**: GMTED2010 30-arc-second
  mean elevation directly from USGS (public domain), adding `geotiff` as a dev dependency.
- **Loading**: SVG `<image>` elements beneath every other layer, inserted from
  `requestIdleCallback` (fallback `setTimeout`) after `load`; `onerror` removes the element
  silently; CSS opacity fade, fixed geometry so no layout shift.
- **Budget**: excluded from the 800 KB budget; target ≤ 1.5 MB for the whole grid.

## R5. Relief polygons

- **Decision**: take Himalaya, Western Ghats, Eastern Ghats, Thar Desert (and Vindhya, Satpura,
  Aravalli where present) from `ne_10m_geography_regions_polys` (**verify** names at build time;
  the script fails loudly if an expected name is neither in NE nor in the hand-traced file).
  Missing ranges are hand-traced into `data/relief-traced.json` from contours derived from the R4
  DEM (public domain), never from a copyrighted atlas.
- **Rationale**: no tracing needed for most; physical geography is uncontested; DEM-derived tracing
  is honest and reproducible. Implies terrain DEM download (not tile output) happens before relief.

## R6. Atom redraw method

- **Decision**: hand-author atom rings in `index.html`'s `ATOMS`, using the new base layers as a
  reference via a debug overlay (`?debug=atoms`: atom outlines, ids, rivers, 1° graticule). Where a
  river is the border, copy vertices from the `base.json` river line. Coastal edges overshoot
  ≥ 0.3° into the sea.
- **Candidate split (~50 atoms, final list fixed at ◆2)** — refines the prototype's 26:
  GANDHARA, KABUL, BALOCH_N, MAKRAN, SINDH_N, SINDH_S, PUNJAB_W, PUNJAB_E, KASHMIR, LADAKH,
  HIMACHAL, KUMAON_GARHWAL, NEPAL_TERAI, DOAB_UPPER, DOAB_LOWER, ROHILKHAND, AWADH, VATSA, MAGADHA,
  MITHILA, BENGAL_W, BENGAL_N, BENGAL_E, ASSAM, NE_HILLS, MARWAR, MEWAR, SAURASHTRA, KUTCH,
  GUJARAT_MAIN, MALWA, BUNDELKHAND, BAGHELKHAND, GONDWANA, CHHATTISGARH, JHARKHAND, KALINGA_N,
  KALINGA_S, KHANDESH, VIDARBHA, DESH, KONKAN, TELANGANA, RAYALASEEMA, KARNATAKA_N, KARNATAKA_S,
  ANDHRA_COAST, TONDAIMANDALAM, CHOLA_NADU, PANDYA_NADU, KERALA, SRILANKA.
- **Migration map**: `ATOM_MIGRATION = { DECCAN: ["TELANGANA","RAYALASEEMA","KARNATAKA_N"], … }`
  expanded once at load over every snapshot's `atoms`. Every prototype id must appear either as a
  kept id or a migration key. Removed in Phase 2 when snapshot data is rewritten with new ids.
- **Overlap check**: `scripts/check-atoms.mjs` samples a 0.05° grid over land; any point inside > 1
  atom fails. Ceiling: misses slivers under ~5 km — acceptable at this zoom; upgrade to mapshaper
  overlap detection if a sliver shows up visually.
- **Alternative rejected**: atoms as faces of a planar graph (rivers + hand watershed lines)
  built in mapshaper — guarantees shared borders, but a much larger build and harder for data
  contributors. Revisit with the Phase 3 topology encoding (§6.11).

## R7. Projection (US4 input)

- **Current**: `px = (lon-58)·K·0.93`, `py = (39-lat)·K`, K=22. 7 `px` + 7 `py` call sites and one
  inverse (`toLonLat`, used by quiz scoring with haversine).
- **LCC at φ0=23°N, λ0=80°E, standard parallels ~15°N/31°N**: ~15-line forward, ~10-line inverse.
  Costs found so far:
  1. Call sites move from separable `px(lon)`/`py(lat)` to one `pr([lon,lat])` → 14 edits.
  2. `toLonLat` becomes the LCC inverse; quiz distances stay haversine, so scoring is unaffected.
  3. Long straight edges (bbox clip, atom overshoots) need densifying or they won't curve with
     the graticule — mapshaper `-densify` at build, or a small render-time densify for atoms.
  4. Hillshade resampled into the conic at build time (~20 lines, zero runtime cost).
  5. Labels sit at projected centroids and SVG hit-tests natively, so both are unaffected. Visible
     change: curved graticule, fan-shaped frame.
- **Provisional lean**: conic looks cheap here. Final recommendation only after the side-by-side
  prototype; the switch waits for the owner (Principle VII).
- **Order consequence**: decide projection **before** final terrain output, so terrain is built
  once. Tasks order US4 before terrain tile generation.
