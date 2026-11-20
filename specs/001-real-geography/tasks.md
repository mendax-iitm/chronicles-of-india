# Tasks: Phase 1 — Real Geography

**Input**: Design documents from `specs/001-real-geography/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: No test suite requested. Two runnable checks only (constitution quality gates):
`scripts/smoke.mjs` and `scripts/check-atoms.mjs`.

**Order note**: Execution order follows HANDOVER.md (coast → relief → atoms → projection → terrain)
with one deliberate change: **terrain tiles are generated after the projection decision**, so they
are built once in the final projection. Relief (US3a) precedes atoms (US2) because atoms are drawn
against it.

**Commits**: one commit per task group marked 🔖, ticking `docs/ROADMAP.md` (and BRIEF §6 where
relevant) in the same commit.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

- [x] T001 Create branch `001-real-geography` from `main` (repo has no remote yet; owner runs HANDOVER Step 2 separately)
- [x] T002 Add `package.json` with `devDependencies` only, exact-pinned: `mapshaper`, `pngjs`, `jpeg-js`, `playwright`; scripts `build:geo`, `build:terrain`, `check`, `smoke`; `"private": true`
- [x] T003 [P] Extend `.gitignore` with `node_modules/` and `.cache/`
- [x] T004 [P] Add a "Generating data" section to `CONTRIBUTING.md`: viewing needs nothing; `npm install` only to regenerate 🔖

## Phase 2: Foundational (blocks all stories)

- [x] T005 Write `scripts/smoke.mjs` (Playwright, `file://` URL): assert `window.atlas` keys `{st,SN,PL,EV,JR,setYear,act}` per contracts/window-atlas.md; `setYear(s.from)` for all 18 snapshots; fail on any console error; screenshot each snapshot at 390, 1024×768, 1440 to `.cache/shots/`
- [x] T006 Run smoke on the untouched prototype; keep `.cache/shots/before-*.png` as the baseline for ◆2 comparisons; record prototype first-paint time and weight (62 KB) for SC-002/SC-003 🔖

**Checkpoint**: baseline captured; smoke passes on prototype.

---

## Phase 3: User Story 1 — Real coastline, islands, rivers, lakes (P1) 🎯 MVP

**Goal**: Natural Earth base map replaces COAST, LANKA and RIVERS in `index.html`.
**Independent test**: quickstart US1 scenario; smoke 18/18, 0 errors.

- [x] T007 [US1] `scripts/build-geo.mjs`: download NE 10m `land`, `minor_islands`, `rivers_lake_centerlines`, `lakes`, `geography_regions_polys` into `.cache/ne/` (skip if cached); record NE version in `meta.ne_version`
- [x] T008 [US1] In `scripts/build-geo.mjs`: mapshaper clip `bbox=58,5,98,38`, `-simplify weighted keep-shapes`, keep-list for Lakshadweep/Andaman/Nicobar; largest polygon → `coast` ("One closed ring: the mainland after clipping"), rest → `islands` sorted by name
- [x] T009 [P] [US1] Create `data/river-labels.json` (allow-list, display name, `rank` 0|1, hand-picked `label` [lon,lat]) for ≥ 16 rivers: Indus, Jhelum, Chenab, Ravi, Beas, Sutlej, Ganga, Yamuna, Ghaghara, Gandak, Kosi, Son, Chambal, Brahmaputra, Narmada, Tapti, Mahanadi, Godavari, Krishna, Tungabhadra, Kaveri, Hooghly (exact NE names verified at build)
- [x] T010 [US1] In `scripts/build-geo.mjs`: rivers filtered by `data/river-labels.json`, merged per name; lakes Chilika, Sambhar, Dal, Wular, Loktak (where NE has them); hand `sea` labels (Arabian Sea, Bay of Bengal, Indian Ocean, Gulf of Mannar, Andaman Sea); `appear`/`vanish` omitted ("absent = always present; only set with a cited source")
- [x] T011 [US1] In `scripts/build-geo.mjs`: validation per data-model.md (bbox containment, ≤ 2 dp, required islands, rivers ≥ 16, no year 0); deterministic output (sorted arrays, schema key order, no timestamps); write `data/base.json` and `data/base.js` (`window.ATLAS_BASE=` + JSON + `;\n`) per contracts/base-json.md
- [x] T012 [US1] Run `npm run build:geo` twice; assert empty `git diff data/` on the second run (SC-008); tune simplify % by eye at max zoom and record it in the script header; commit script + output 🔖
- [x] T013 [US1] `index.html`: load `<script src="data/base.js">` before the app script; replace `COAST`/`LANKA`/`RIVERS` consumers with `ATLAS_BASE.coast/islands/rivers/lakes`; islands join the `#clipLand` clip path so island polities clip correctly; rivers stroke by `rank`; lakes as water fills; `GEO` sea labels from `ATLAS_BASE.sea`; graceful "Base map failed to load" if missing
- [x] T014 [US1] Keep old prototype atoms working against the new coast (no atom edits yet); fix only render breakage, not shapes
- [x] T015 [P] [US1] `docs/SOURCES.md`: Natural Earth rows per layer (version, URL, public domain)
- [x] T016 [P] [US1] `docs/DATA-MODEL.md` `base.json` section: add `meta`, `lakes`, optional `appear`/`vanish`, relief `source`
- [x] T017 [US1] Run smoke (18/18, 0 errors, 3 viewports); weight check `index.html + data/base.js` < 800 KB; tick ROADMAP "build-geo", "Coastline + islands", "Rivers and lakes" 🔖

### ◆ CHECKPOINT 1 — STOP. Show owner screenshots (1440 + 390) of new coastline and rivers, the weight number, and the simplify setting. Wait for approval.

---

## Phase 4: User Story 3a — Relief (P3, needed before atoms)

**Goal**: seven relief areas render under polities.
**Independent test**: quickstart US1/US3 visual; smoke clean.

- [x] T018 [US3] In `scripts/build-geo.mjs`: extract relief from `ne_10m_geography_regions_polys` for whichever of Himalaya, Western Ghats, Eastern Ghats, Vindhya, Satpura, Aravalli, Thar exist (verify NE names); fail loudly if a required name is in neither NE nor `data/relief-traced.json`
- [x] T019 (not needed: NE has all 7 relief areas) [US3] Download the R4 DEM (cache only, no tiles yet) and add a dev-only contour dump to `scripts/build-terrain.mjs --contours` (writes `.cache/contours.geojson`) to trace missing ranges from public-domain elevation
- [x] T020 (not needed) [US3] Hand-trace missing ranges into `data/relief-traced.json` (`[{name, poly}]`) from the DEM contours — never from a copyrighted atlas
- [x] T021 [US3] `index.html`: render `ATLAS_BASE.relief` under polities (replacing `HIMAL`), labelled; `docs/SOURCES.md` rows for relief sources; rebuild; smoke; tick ROADMAP "Relief" 🔖

---

## Phase 5: User Story 2 — Atoms redrawn against real geography (P2)

**Goal**: 26 → 40–60 atoms following coasts, rivers, watersheds; every snapshot keeps its territory.
**Independent test**: `npm run check` → count in range, 0 overlaps; quickstart US2 scenario.

- [x] T022 [US2] `scripts/check-atoms.mjs`: parse `ATOMS` from `index.html`; assert "40–60 atoms"; 0.05° land grid sample, any point inside > 1 atom fails; print count and overlaps
- [x] T023 [US2] `index.html`: `?debug=atoms` overlay — atom outlines, ids, rivers, 1° graticule (debug only, not linked)
- [x] T024 [US2] Redraw north and west atoms (GANDHARA … SAURASHTRA/KUTCH per research R6) in `ATOMS`; river borders copy `base.json` river vertices; coastal edges overshoot ≥ 0.3°
- [x] T025 [US2] Redraw east and north-east atoms (AWADH … NE_HILLS)
- [x] T026 [US2] Redraw centre, Deccan and south (MALWA … KERALA), incl. TELANGANA / RAYALASEEMA / KARNATAKA_N split; `SRILANKA` from the base island polygon; leave forest/tribal interiors as gaps where prototype left them unclaimed
- [x] T027 [US2] `ATOM_MIGRATION` in `index.html`: every prototype id is kept or mapped; expand once at load over `SN[*].pol[*].atoms`; smoke asserts all ids resolve
- [x] T028 [US2] Verify per snapshot that every polity present before is present after (SC-007) and J&K 1947 colour/label unchanged; compare against `.cache/shots/before-*`; `npm run check` + smoke clean; tick ROADMAP "Redraw region atoms" 🔖

### ◆ CHECKPOINT 2 — STOP. Show owner: all atoms with labels (`?debug=atoms`), and 261 BCE, 1526 CE, 1947 CE before/after. Wait for acceptance.

---

## Phase 6: User Story 4 — Projection decision (P4)

**Goal**: evidence-based recommendation; no switch without go-ahead.
**Independent test**: quickstart US4 scenario.

- [x] T029 (done as `?proj=lcc` in index.html instead of a separate page — measures real cost) [US4] `scripts/proj-prototype.html` (standalone, loads `../data/base.js` and copies atoms): equirect-0.93 vs LCC (φ0 23°N, λ0 80°E, standard parallels ~15°N/31°N) side by side, with graticule and the 1526 snapshot
- [x] T030 [US4] `docs/PROJECTION.md`: measured costs from research R7 (14 call sites → `pr([lon,lat])`, LCC inverse in `toLonLat`, densify long edges, terrain resample, label/hit-test impact), screenshots, recommendation 🔖

### ◆ CHECKPOINT 3 — STOP. Owner decides. If approved: T031. If not: skip T031.

- [ ] T031 [US4] (only if approved) Switch `index.html` to LCC: single `pr()` + inverse; densify; smoke; quiz scoring spot-check (tap known city, distance ≈ 0) 🔖

---

## Phase 7: User Story 3b — Terrain hillshade (P3)

**Goal**: ~1 km/px hillshade under everything, lazy, fail-silent.
**Independent test**: quickstart US3 scenario (Slow 3G, blocked tiles).

- [ ] T032 [US3] Verify Terrain Tiles licence for South Asia inputs (SRTM/GMTED2010/ETOPO1, public domain); if unclear, switch to GMTED2010 fallback per research R4
- [ ] T033 [US3] `scripts/build-terrain.mjs`: z7 tiles over bbox → decode (pngjs) → Horn hillshade → resample to the **chosen** projection → greyscale JPEG q≈70, 4×4 grid `data/terrain/r{r}c{c}.jpg` + `manifest.json` + `manifest.js` (`projection`, `extent`, `rows`, `cols`, `source`)
- [ ] T034 [US3] `index.html`: after `load` + `requestIdleCallback`, insert SVG `<image>` tiles beneath all layers; skip if manifest projection ≠ page projection; `onerror` removes silently; opacity fade, no layout shift
- [ ] T035 [US3] Slow-3G check (map usable before tiles; first paint ≤ 120% of T006 baseline); blocked-tiles check (clean console); terrain total ≤ ~1.5 MB; `docs/SOURCES.md` terrain row; tick ROADMAP "Terrain hillshade" + BRIEF §6.2 terrain 🔖

---

## Phase 8: Polish

- [ ] T036 Final quality gate (BRIEF §9): slider end to end at 390, 1024×768, 1440; console clean; every labelable polity labelled; weight report
- [ ] T037 Tick ROADMAP "Decide: projection" with the outcome; keep `.cache/shots` used in ◆ reviews until owner closes Phase 1
- [ ] T038 [P] README: one line on base-map sources and that viewing needs no build 🔖

---

## Dependencies

- Setup → Foundational → US1 → ◆1 → US3a (relief) → US2 (atoms) → ◆2 → US4 → ◆3 → US3b (terrain) → Polish.
- T019 (DEM download) is shared by relief tracing and terrain; T033 reuses its cache.
- T031 is conditional on owner approval at ◆3; T033 depends on the ◆3 outcome.

## Parallel opportunities

- T003, T004 alongside T002.
- T009 (river label list) alongside T007–T008.
- T015, T016 (docs) alongside T013–T014.
- T024 / T025 / T026 touch the same `ATOMS` block — **not** parallel; do sequentially.

## Implementation strategy

- **MVP = US1** (T001–T017): shippable alone — real coastline under the existing kingdoms.
- Each ◆ is a hard stop; nothing past it starts without owner sign-off (Principle VII).
- Session plan: session 1 = Setup → ◆1. Session 2 = relief + atoms → ◆2. Session 3 = projection
  → ◆3 → terrain → polish.
