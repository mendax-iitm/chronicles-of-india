# Implementation Plan: Phase 1 — Real Geography

**Branch**: `001-real-geography` | **Date**: 2026-11-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-real-geography/spec.md`

## Summary

Replace the prototype's hand-drawn coastline, rivers, Himalaya blob and 26 region atoms with real
public-domain geodata. A dev-time Node script (`scripts/build-geo.mjs`) downloads Natural Earth 10m,
clips to lon 58–98 / lat 5–38, simplifies with mapshaper, rounds to 2 dp and emits
`data/base.json` (canonical) plus `data/base.js` (a `window.ATLAS_BASE = …` wrapper so the page
works from `file://`). Relief comes from Natural Earth geography-region polygons where present,
hand-traced from public-domain DEM contours where not. A second script (`scripts/build-terrain.mjs`)
turns public-domain DEM tiles into a hillshade image set, lazy-loaded after first paint. Atoms are
redrawn by hand against the new base layers (26 → 40–60) with a migration map so all 18 snapshots
keep their territory. Projection: prototype Lambert conformal conic alongside the current
equirectangular, write up costs, recommend, and stop for sign-off.

## Technical Context

**Language/Version**: Browser JavaScript (no modules, no transpile) in `index.html`; Node 20+ `.mjs`
for build scripts (dev machine has Node 26).

**Primary Dependencies**: Runtime: none. Dev-only (`package.json` `devDependencies`, pinned, never
loaded by the page): `mapshaper` (clip/simplify), `pngjs` + `jpeg-js` (terrain decode/encode),
`playwright` (screenshots and smoke checks).

**Storage**: Committed static files under `data/`; raw downloads cached in git-ignored `.cache/`.

**Testing**: `scripts/smoke.mjs` (Playwright): load page, step every snapshot, assert zero console
errors, screenshot at 390 px, 1024×768, 1440 px. `scripts/check-atoms.mjs`: atom count and land-overlap
check. Both runnable by hand; CI wiring is the roadmap's running requirement, not this feature.

**Target Platform**: Any modern browser from `file://` or static host; low-end Android on 3G.

**Project Type**: Static single-page web app plus offline data-generation scripts.

**Performance Goals**: First paint not >20% slower than prototype; slider drag stays smooth on
low-end phone (no per-frame re-parse of geometry).

**Constraints**: Page weight < 800 KB preferred, < 2 MB hard, hillshade excluded; 2 dp coordinates;
zero runtime deps; `window.atlas` unchanged; no NC/SA/CHGIS data; no tracing copyrighted atlases.

**Scale/Scope**: 1 coastline ring, ~10–40 islands, 16–25 rivers, ~8 lakes, 7 relief areas,
40–60 atoms, 18 existing snapshots re-checked.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | How this plan complies |
|---|---|---|
| I. Zero deps, no build to view | PASS | Dev deps in `devDependencies` only; generated `data/base.js` committed and loaded via plain `<script src>`; works from `file://`. |
| II. Permissive data only | PASS | Natural Earth (PD); DEM from public-domain sources only (research R4); relief traced from PD data; every layer credited in `docs/SOURCES.md`. Schwartzberg/Habib consulted for facts only. |
| III. Cited, neutral history | PASS | No historical claims added. Atom migration preserves every polity's territory. River `appear`/`vanish` left empty unless cited. J&K 1947 treatment untouched. |
| IV. Cartographic honesty | PASS | `<clipPath>` trick kept; coastal atoms overshoot; gaps between atoms allowed; out-of-region land neutral. |
| V. Weight and performance | PASS | Budget: `data/base.js` ≤ 250 KB; hillshade lazy-loaded after `load` + idle, excluded from budget, ≤ ~1.5 MB total. |
| VI. Stable test surface | PASS | `window.atlas` keys untouched; smoke script asserts its shape. |
| VII. Phase discipline | PASS | Geography only. Projection switch gated on owner approval. Two ◆ checkpoints are hard stops. |

**Post-design re-check**: PASS — design artifacts introduce no runtime dependency, no new data
source outside R1–R4, and no change to snapshot content beyond the mechanical atom migration.

## Project Structure

### Documentation (this feature)

```text
specs/001-real-geography/
├── spec.md
├── plan.md              # this file
├── research.md          # R1–R7 decisions
├── data-model.md        # base.json, regions, migration map, terrain manifest
├── quickstart.md        # how to regenerate + validate
├── contracts/
│   ├── base-json.md     # data/base.json + data/base.js contract
│   └── window-atlas.md  # stability contract for window.atlas
├── checklists/requirements.md
└── tasks.md             # /speckit-tasks output
```

### Source Code (repository root)

```text
index.html                  # loads data/base.js; renders base layers; ATOMS + ATOM_MIGRATION inline
package.json                # devDependencies only; scripts: build:geo, build:terrain, smoke, check
.gitignore                  # + .cache/, node_modules/
data/
├── base.json               # generated, committed (canonical, per DATA-MODEL.md)
├── base.js                 # generated, committed: window.ATLAS_BASE = <base.json>
├── relief-traced.json      # hand-traced relief polygons not in Natural Earth (input to build)
├── river-labels.json       # hand-chosen label points + rank per river (input to build)
└── terrain/
    ├── manifest.json       # tile grid, extent, projection
    └── r{row}c{col}.jpg    # hillshade tiles
scripts/
├── build-geo.mjs           # Natural Earth → data/base.json + data/base.js
├── build-terrain.mjs       # DEM tiles → data/terrain/*
├── check-atoms.mjs         # count + overlap check of ATOMS in index.html
├── smoke.mjs               # Playwright: snapshots, console, 3 viewports, screenshots
└── proj-prototype.html     # US4 only: side-by-side equirect vs LCC (not linked from site)
docs/
├── DATA-MODEL.md           # base.json section extended (lakes, appear/vanish)
├── SOURCES.md              # base geography + terrain rows
└── PROJECTION.md           # US4 write-up and recommendation
```

**Structure Decision**: Keep everything in the existing single-page layout. Only base geography and
terrain move to `data/` now (Phase 2 moves the rest). Atoms stay inline in `index.html` next to the
snapshots that reference them, to avoid a half-done Phase 2 split.

## Phase 0: Research

See [research.md](research.md). All unknowns resolved; no NEEDS CLARIFICATION remain.

## Phase 1: Design and Contracts

See [data-model.md](data-model.md), [contracts/](contracts/), [quickstart.md](quickstart.md).

## Checkpoints (hard stops)

- **◆1** after US1 (coastline + islands + rivers + lakes rendering): screenshots at 1440 px and
  390 px, weight report, then wait for owner.
- **◆2** after US2 (atoms redrawn): screenshot of all atoms with labels, plus 261 BCE, 1526 CE and
  1947 CE snapshots before/after, then wait for owner.
- **◆3** (US4): `docs/PROJECTION.md` + `scripts/proj-prototype.html`; no switch without go-ahead.

## Complexity Tracking

| Item | Why needed | Simpler alternative rejected because |
|---|---|---|
| `data/base.js` alongside `base.json` | `fetch()` of local files is blocked under `file://` | Inlining geometry into `index.html` bloats the hand-edited file and fights Phase 2; `python3 -m http.server` alone breaks the "just open it" rule. |
| `package.json` with dev deps | mapshaper, PNG/JPEG codecs, Playwright | Hand-written simplification/codecs would be hundreds of lines; GDAL is not installed and is a heavier ask for contributors. |
| Atom migration map | Splitting DECCAN etc. must not lose territory in 18 snapshots | Editing every snapshot by hand risks silent territory loss; the map is a few lines and is checked by the smoke script. |
