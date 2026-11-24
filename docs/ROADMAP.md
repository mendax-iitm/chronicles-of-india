# Roadmap

Detail lives in [BRIEF.md §6 (parity checklist)](../BRIEF.md#6-feature-parity-checklist)
and [§8 (phases)](../BRIEF.md#8-phased-plan). This file is the running tick-list.

**Goal: functional parity with the reference atlas of China, applied to India.**
Scale target: ~200 territorial snapshots, ~80 places, ~80 events, ~25 journeys.

## Phase 1 — Real geography
- [x] `scripts/build-geo.mjs` — Natural Earth → `data/base.json`
- [x] Coastline + islands (Sri Lanka, Lakshadweep, Andamans)
- [x] Rivers and lakes (16+ named, with `appear`/`vanish` years) — 31 rivers + 5 historical canals/temporal waterways with `appear`/`vanish` (Saraswati, Grand Anicut, Western Yamuna Canal, Upper Ganges Canal, Upper Bari Doab Canal)
- [x] Relief: Himalaya, Ghats, Vindhyas, Aravallis, Thar
- [x] Terrain hillshade from a public-domain DEM, lazy-loaded (built for the current projection; rerun with `--proj lcc` if the conic is adopted)
- [x] Redraw region atoms against real geography (25 → 40–60) — 60 atoms, 0 overlaps
- [x] Decide: equirectangular vs Lambert conformal conic — adopted Lambert conformal conic (LCC) as default, equirectangular available via ?proj=equirect

## Phase 2 — Code and data separation
- [x] Split `index.html` → `css/`, `js/`, `data/`
- [x] All content to `data/*.json`; strings shaped `{en, hi}` from day one
- [x] `scripts/validate.mjs` + CI
- [x] `scripts/export-geojson.mjs` (RFC 7946) + `geojson/demo.html` + point-lookup helper
- [x] `dist/atlas.html` single-file offline build

## Phase 3 — Depth of content
- [x] Snapshots 18 → 36 contiguous key snapshots (-600 to 1947, 0 gaps across all historical epochs)
- [x] `rulers.json` — 54 rulers across 36 dynasties with reign spans, regnal eras (Vikram Samvat, Shaka Samvat, Kollam, Hijri)
- [x] First-level administrative divisions (Maurya Pradeshas, Gupta Bhuktis, Chola Mandalams, Sultanate Iqtas, Mughal Subahs, British Presidencies)
- [x] Places 22 → 92 (passes, ports, battlefields, literary sites, capital badges, place lore)
- [x] Events 25 → 80 historical milestones
- [x] Journeys 5 → 26 person chronicles with 153 stops
- [x] Corridors: Uttarapatha, Dakshinapatha, GT Road, Silk Road Karakoram/Tibet, spice routes, Buddhist Circuit, Char Dham
- [x] Compact topology-deduplicated encoding (all snapshots in 568 KB single-file offline bundle, under 600 KB budget)

## Phase 4 — Interaction parity
- [x] Universal search (`/`, `Cmd+K`) across people, places, rulers, eras, events, quiz
- [x] Keyboard shortcuts (arrows, Shift+arrow, Space, Esc, X, C, G)
- [x] Legend hover-highlight + click-to-zoom-to-bbox
- [x] X-ray lens (modern boundaries over the historical map)
- [x] Trace Place: double-click to open, capital badges, site events that jump to their year
- [x] Person chronicles as arcs with directional ticks; multiple people at once
- [x] Quiz: 10 rounds, clues, confirm, accuracy rings, named ranks

## Phase 5 — Sharing and deployment
- [x] Deep links: `year`, `place` (multi-stop), `person`, `polity`, `quiz`, `lang`
- [x] Embed mode `?embed=1` with full param set
- [x] Export current view as PNG and SVG with attribution watermark
- [x] Docker + Docker Compose (`nginx:alpine`, 8008:80)
- [x] `sitemap.xml` + per-period landing pages (36 periods + robots.txt)

## Phase 6 — AI and agent integration
- [x] `llms.txt` + `llms-full.txt` machine-readable documentation
- [x] MCP server `scripts/mcp-server.js` (`search_atlas`, `inspect_place`, `inspect_person`, `inspect_ruler`, `get_era`, `inspect_atom`)
- [x] Agent skill `skills/chronicles-of-india/SKILL.md`
- [x] `window.atlasAPI` (`locate`, `inspect`, `resolvePlace`, `openPerson`, `search`, `getRulers`, `getTimeline`)
- [x] WebMCP via `navigator.modelContext` and `window.modelContext`
- [x] CLI renderer `scripts/atlas-cli.py` (terminal ASCII map + JSON output)

## Phase 7 — Language and accessibility
- [x] Hindi UI + content (`js/i18n.js`, language toggle button, bilingual quiz clues and cards)
- [x] Regional-script place names across 92 settlements (Tamil, Kannada, Telugu, Malayalam, Bengali, Marathi, Odia, Gurmukhi, Perso-Arabic)
- [x] Keyboard navigation + screen-reader era announcements (`aria-live="polite"`, `l` key, `1-4` tab switching, tablist arrow navigation)
- [x] `prefers-reduced-motion` instantaneous transitions and high-contrast palette support

## Phase 8 — Exam and classroom mode
- [x] NCERT (Classes 6–12) and UPSC syllabus tagging + filter
- [x] Printable revision view per period
- [x] Practice sets (match-the-capital, order-the-dynasties, locate-the-site, which-ruler)
- [x] Teacher mode: scripted guided tour with notes; optional speech narration
- [x] Printable blank outline-map worksheets + answer key
- [x] Verified at 1024×768 projector resolution

## Phase 9 — Community and launch
- [x] 30–50 seeded `good-first-issue` entries, one per missing snapshot/place (`docs/GOOD-FIRST-ISSUES.md`)
- [x] `docs/ACCURACY.md` — method, uncertainty, known weak spots
- [x] One-click pre-filled error-report issue link on every era (`#eraReportLink`)
- [x] Hindi README (`README.hi.md`)
- [x] Courtesy note to the author of the reference atlas (`docs/COURTESY-NOTE.md`)

## Phase 10 — Offline and installable
- [x] PWA manifest + service worker (`manifest.webmanifest`, `sw.js`, `assets/icon.svg`)
- [x] Full offline caching including terrain tiles (`r0c0.jpg`–`r3c3.jpg`)
- [x] "Lite" mode for low-end devices (`#liteBtn`, `?lite=1`, `deviceMemory <= 2` auto-detection)
- [x] Tested on an emulated 2 GB Android phone profile (`scripts/test-phase10.mjs`)

## Running requirement
- [ ] `docs/SOURCES.md` populated as claims land
- [ ] Playwright smoke tests in CI
- [ ] Page weight checked against budget each commit
