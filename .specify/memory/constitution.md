<!--
Sync Impact Report
- Version change: template → 1.0.0 (initial ratification)
- Principles added: I. Zero Dependencies, No Build to View; II. Permissive Data Only;
  III. Cited, Neutral History; IV. Cartographic Honesty; V. Weight and Low-End Performance;
  VI. Stable Test Surface; VII. Phase Discipline and Simplicity
- Sections added: Technical Constraints; Quality Gates and Workflow; Governance
- Removed sections: none
- Deferred TODOs: none
- Source: distilled from BRIEF.md §3, §5, §8–§12. BRIEF.md remains the single source of truth;
  this file is its enforceable summary for Spec Kit gates.
-->
# Chronicles of India Constitution

## Core Principles

### I. Zero Dependencies, No Build to View
- The site MUST run from `file://` and any static host, offline, with `git clone && open index.html`.
- No runtime dependencies: no CDN scripts, no framework, no bundler, no map library (Leaflet,
  D3, Mapbox) in the app. Rendering is plain SVG drawn by our own code.
- Build scripts (`scripts/*.mjs`) exist only to *generate* data. Their output MUST be committed;
  a contributor MUST never need to run a build to view the site.
- Build scripts MAY use dev-time tools (e.g. `mapshaper`) invoked via `npx`; these never ship
  in the page.

Rationale: the target environment is an offline classroom on a cheap phone, forever.

### II. Permissive Data Only
- Data sources MUST be public domain or permissive (CC0, CC BY, MIT-compatible). Natural Earth
  is the default.
- Non-commercial or share-alike data is forbidden. CHGIS and CHGIS-derived data are forbidden.
- Copyrighted atlases (Schwartzberg, Habib, Cambridge) MAY be consulted for facts; their artwork
  MUST NEVER be traced or reproduced.
- Every external dataset MUST be credited in `docs/SOURCES.md` with its licence.
- Code is MIT; `data/` is CC BY 4.0.

### III. Cited, Neutral History (NON-NEGOTIABLE)
- No uncited historical claim ships. Every fact-bearing object carries `sources` keys that
  resolve in `docs/SOURCES.md`.
- BRIEF.md §11 is binding: scope ends at 1947; J&K 1947 shown neutral and labelled disputed;
  no communal, invader-vs-native, caste, triumphalist or verdict framing; disputed dates shown
  as labelled ranges; traditional dates labelled; archaeology and epigraphy outrank tradition.
- Polities are coloured by polity, never by religion.
- Contested framing questions are resolved in an issue, never inside a PR.

### IV. Cartographic Honesty
- The "schematic approximation" disclaimer is visible at all times.
- Snapshot transitions are jumps, never interpolations.
- Unclaimed, forested, tribal and autonomous interiors stay unclaimed; atoms may leave gaps.
- South, north-east and interior are populated in every period.
- Coastal atoms overshoot into the sea; polities are clipped to the coastline via `<clipPath>`.

### V. Weight and Low-End Performance
- Total page weight MUST stay under 2 MB and SHOULD stay under 800 KB, terrain excluded.
- Terrain/hillshade MUST be lazy-loaded and MUST NOT block first paint.
- Coordinates are stored to 2 decimal places. Simplify to the lightest geometry that still
  looks right at the supported zoom range.
- Must work on a ₹10,000 Android phone on 3G. Performance beats polish.

### VI. Stable Test Surface
- `window.atlas` (`{st, SN, PL, EV, JR, setYear, act}`) MUST stay stable; from Phase 6,
  `window.atlasAPI` too. Changing either requires an amendment to this constitution.
- Data conventions in `docs/DATA-MODEL.md` are contracts: integer years, negative = BCE, no
  year 0, `[lon, lat]` WGS 84, kebab-case ids, UPPER_SNAKE_CASE region ids.

### VII. Phase Discipline and Simplicity
- Work only on the current phase in `docs/ROADMAP.md`. No features outside BRIEF.md §6 until
  every row is green.
- Small commits, one per checklist item. `main` is never broken.
- Prefer the simplest thing that works: greedy label placement is adequate; no speculative
  abstractions.
- Decisions flagged "decide before implementing" (e.g. projection) MUST stop for owner sign-off.

## Technical Constraints

- App: plain HTML, CSS and browser JavaScript. Build scripts: Node `.mjs`.
- Accessibility: keyboard navigation, ARIA on controls, text alternatives for map state, never
  colour alone to carry meaning.
- Data loads from `data/` with a `file://` fallback (Phase 2 onward).
- Deployment: GitHub Pages via the committed workflow; static hosting only.

## Quality Gates and Workflow

Every change MUST pass before commit (BRIEF.md §9):
1. Open the page, drag the slider end to end; console is clean.
2. Check at 390 px, 1024×768 and 1440 px.
3. No polity large enough to label is left unlabelled.
4. Every new historical claim has a `docs/SOURCES.md` key.
5. Page weight checked against the Principle V budget.
6. Data changes pass `scripts/validate.mjs` (once it exists, Phase 2).

Checkpoints marked ◆ in a plan are hard stops for owner review (screenshot plus summary).
Tick `docs/ROADMAP.md` and BRIEF.md §6 as items land.

## Governance

- BRIEF.md is the single source of truth. Where this constitution and BRIEF.md disagree,
  BRIEF.md wins and this file is amended to match.
- Every plan MUST include a Constitution Check against Principles I–VII.
- Amendments: edit this file, bump the version (MAJOR = principle removed or redefined,
  MINOR = principle added or expanded, PATCH = wording), record it in the Sync Impact Report,
  and note it in the commit.
- Changes to the §11 editorial policy require an issue and discussion first.

**Version**: 1.0.0 | **Ratified**: 2026-11-20 | **Last Amended**: 2026-11-20
