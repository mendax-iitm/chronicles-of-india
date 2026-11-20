# Roadmap

Detail lives in [BRIEF.md §6 (parity checklist)](../BRIEF.md#6-feature-parity-checklist)
and [§8 (phases)](../BRIEF.md#8-phased-plan). This file is the running tick-list.

**Goal: functional parity with the reference atlas of China, applied to India.**
Scale target: ~200 territorial snapshots, ~80 places, ~80 events, ~25 journeys.

## Phase 1 — Real geography  ⬅ current
- [x] `scripts/build-geo.mjs` — Natural Earth → `data/base.json`
- [x] Coastline + islands (Sri Lanka, Lakshadweep, Andamans)
- [ ] Rivers and lakes (16+ named, with `appear`/`vanish` years) — 31 rivers + Wular done; `appear`/`vanish` schema ready, values need cited sources (Phase 3)
- [ ] Relief: Himalaya, Ghats, Vindhyas, Aravallis, Thar
- [ ] Terrain hillshade from a public-domain DEM, lazy-loaded
- [ ] Redraw region atoms against real geography (25 → 40–60)
- [ ] Decide: equirectangular vs Lambert conformal conic — flag before implementing

## Phase 2 — Code and data separation
- [ ] Split `index.html` → `css/`, `js/`, `data/`
- [ ] All content to `data/*.json`; strings shaped `{en, hi}` from day one
- [ ] `scripts/validate.mjs` + CI
- [ ] `scripts/export-geojson.mjs` (RFC 7946) + `geojson/demo.html` + point-lookup helper
- [ ] `dist/atlas.html` single-file offline build

## Phase 3 — Depth of content
- [ ] Snapshots 18 → ~200 (gaps: 185 BCE–30 CE, 550–750, 1200–1500, 1750–1850)
- [ ] `rulers.json` — dynasties, reign spans, regnal eras (Vikram, Shaka, Kollam, Hijri, Fasli)
- [ ] First-level administrative divisions (subahs, mandalams, iqtas, presidencies)
- [ ] Places 22 → 80+ (incl. passes, ports, battlefields, literary sites) + place lore
- [ ] Events 25 → 80
- [ ] Journeys 5 → 25
- [ ] Corridors: Uttarapatha, Dakshinapatha, GT Road, spice routes, pilgrimage circuits
- [ ] Compact topology-deduplicated encoding (all snapshots under 600 KB)

## Phase 4 — Interaction parity
- [ ] Universal search (`/`, `Cmd+K`) across people, places, rulers, eras, events
- [ ] Keyboard shortcuts (arrows, Shift+arrow, Space, Esc)
- [ ] Legend hover-highlight + click-to-zoom-to-bbox
- [ ] X-ray lens (modern boundaries over the historical map)
- [ ] Trace Place: double-click to open, capital badges, site events that jump to their year
- [ ] Person chronicles as arcs with directional ticks; multiple people at once
- [ ] Quiz: 10 rounds, clues, confirm, accuracy rings, named ranks

## Phase 5 — Sharing and deployment
- [ ] Deep links: `year`, `place` (multi-stop), `person`, `polity`, `quiz`, `lang`
- [ ] Embed mode `?embed=1` with full param set
- [ ] Export current view as PNG
- [ ] Docker + Docker Compose (`nginx:alpine`, 8008:80)
- [ ] `sitemap.xml` + per-period landing pages

## Phase 6 — AI and agent integration
- [ ] `llms.txt`
- [ ] MCP server (`inspect_place`, `inspect_person`, `search_atlas`, `inspect_ruler`)
- [ ] Agent skill `skills/chronicles-of-india/SKILL.md`
- [ ] `window.atlasAPI` (`locate`, `inspect`, `resolvePlace`, `openPerson`, `search`)
- [ ] WebMCP via `navigator.modelContext`
- [ ] CLI renderer `scripts/atlas-cli.py`

## Phase 7 — Language and accessibility
- [ ] Hindi UI + content; then Bengali, Tamil, Telugu, Marathi
- [ ] Regional-script place names
- [ ] Keyboard navigation + screen-reader era announcements
- [ ] `prefers-reduced-motion`

## Phase 8 — Exam and classroom mode
- [ ] NCERT (Classes 6–12) and UPSC syllabus tagging + filter
- [ ] Printable revision view per period
- [ ] Practice sets (match-the-capital, order-the-dynasties, locate-the-site)
- [ ] Teacher mode: scripted guided tour with notes; optional speech narration
- [ ] Printable blank outline-map worksheets + answer key
- [ ] Verified at 1024×768 projector resolution

## Phase 9 — Community and launch
- [ ] 30–50 seeded `good-first-issue` entries, one per missing snapshot/place
- [ ] `docs/ACCURACY.md` — method, uncertainty, known weak spots
- [ ] One-click pre-filled error-report issue link on every era
- [ ] Hindi README
- [ ] Outreach: teachers' groups, r/IndianHistory, HN, WikiProject India, edtech newsletters
- [ ] Courtesy note to the author of the reference atlas

## Phase 10 — Offline and installable
- [ ] PWA manifest + service worker
- [ ] Full offline caching including terrain tiles
- [ ] "Lite" mode for low-end devices
- [ ] Tested on a 2 GB Android phone

## Running requirement
- [ ] `docs/SOURCES.md` populated as claims land
- [ ] Playwright smoke tests in CI
- [ ] Page weight checked against budget each commit
