# Data Model: Phase 1 — Real Geography

Conventions from `docs/DATA-MODEL.md` apply: `[lon, lat]` WGS 84, 2 dp, UPPER_SNAKE_CASE atom ids.
This feature **extends** the `base.json` section of `docs/DATA-MODEL.md` (adds `meta`, `lakes`,
optional `appear`/`vanish`, relief `source`); a task updates that file to match.

## BaseGeography (`data/base.json`, generated)

| Field | Type | Rules |
|---|---|---|
| `meta` | `{generator, ne_version, simplify, bbox:[58,5,98,38]}` | Provenance; no timestamps (determinism, SC-008). |
| `coast` | `[[lon,lat],…]` | One closed ring: the mainland after clipping. Used for `<clipPath>`. |
| `islands` | `[{name, poly}]` | Sorted by name. Must include Sri Lanka, Andaman, Nicobar, Lakshadweep groups. `name` may be `""` for unnamed islets. |
| `rivers` | `[{name, rank, line, label, appear?, vanish?}]` | `rank` 1 = major, 0 = secondary. `line` is `[[lon,lat],…]` or multi-line `[[[lon,lat],…],…]`. `label` hand-picked (from `data/river-labels.json`). ≥ 16 entries. `appear`/`vanish` integer years, no 0, absent = always present; only set with a cited source. |
| `lakes` | `[{name, poly}]` | Chilika, Sambhar, Dal, Wular, Loktak at minimum where NE has them. |
| `relief` | `[{name, poly, source}]` | Exactly: Himalaya, Western Ghats, Eastern Ghats, Vindhya, Satpura, Aravalli, Thar. `source` = `"ne"` or `"traced-dem"`. |
| `sea` | `[{name, at}]` | Arabian Sea, Bay of Bengal, Indian Ocean, Gulf of Mannar, Andaman Sea (hand list). |

Validation (in `build-geo.mjs`, fail loudly): bbox containment; every number has ≤ 2 dp; required
islands present; rivers ≥ 16; all 7 relief names present; no year 0.

## Hand inputs (committed, edited by people)

- `data/river-labels.json`: `{ "<NE river name>": {"name": "<display name>", "rank": 0|1, "label": [lon,lat]} }`.
  Doubles as the allow-list: NE rivers not listed are dropped.
- `data/relief-traced.json`: `[{name, poly}]` for ranges missing from NE.

## RegionAtom (inline `ATOMS` in `index.html`)

`ATOMS[ID] = [[lon,lat],…]` — prototype shape kept.

Rules: 40–60 atoms; no land overlap (check-atoms); coastal edges overshoot ≥ 0.3°; gaps allowed;
`SRILANKA` derives from the `base.islands` Sri Lanka polygon rather than a hand ring.

## AtomMigration (inline `ATOM_MIGRATION`)

`{ OLD_ID: [NEW_ID, …] }`. Applied once at load: each snapshot polity's `atoms` list is expanded.
Rules: every prototype atom id is either still in `ATOMS` or a key here; every target exists in
`ATOMS`; after expansion no snapshot references a missing id (smoke check). Lifecycle: created in
US2, deleted in Phase 2 when snapshot data is rewritten with new ids.

## TerrainManifest (`data/terrain/manifest.json`, generated)

`{ projection: "equirect-0.93" | "lcc-23-80", extent: [x0,y0,x1,y1] (SVG units), rows, cols,
tile: "r{r}c{c}.jpg", source: "aws-terrain-tiles-z7" | "gmted2010" }`.

The page places each tile as an SVG `<image>` at its slice of `extent`. If `projection` differs from
the page's projection, terrain is skipped (guards against stale tiles after a projection switch).
Loaded via `data/terrain/manifest.js` wrapper for the same `file://` reason as R3.
