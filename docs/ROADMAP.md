# Roadmap

Phases are defined in detail in [BRIEF.md §7](../BRIEF.md#7-phased-plan). This file is the
running checklist — tick items here as they land.

## Phase 1 — Real geography  ⬅ current
- [ ] `scripts/build-geo.mjs` — Natural Earth → `data/base.json`
- [ ] Coastline + islands (Sri Lanka, Lakshadweep, Andamans)
- [ ] Rivers and lakes (16 named rivers)
- [ ] Relief: Himalaya, Ghats, Vindhyas, Aravallis, Thar
- [ ] Redraw region atoms against real geography (target 40–60 atoms)
- [ ] Decide on Lambert conformal conic vs current equirectangular

## Phase 2 — Code and data separation
- [ ] Split `index.html` → `css/`, `js/`, `data/`
- [ ] Move all historical content to `data/*.json`
- [ ] `scripts/validate.mjs` + CI check
- [ ] `dist/atlas.html` single-file build for offline use

## Phase 3 — Depth of content
- [ ] Eras 18 → 30 (gaps: 185 BCE–30 CE, 550–750, 1200–1500, 1750–1850)
- [ ] Places 22 → 60+
- [ ] Events 25 → 60
- [ ] Journeys: Megasthenes, Al-Biruni, Guru Nanak, Adi Shankara, Vasco da Gama
- [ ] Layer toggles: trade routes, religion spread, Ashokan edicts, Harappan sites

## Phase 4 — Language and accessibility
- [ ] Hindi UI + content
- [ ] Regional-language place names
- [ ] Keyboard navigation, screen-reader era announcements
- [ ] `prefers-reduced-motion`

## Phase 5 — Sharing and teaching
- [ ] URL state (`#year=`, `#place=`, `#journey=`)
- [ ] `?embed=1` mode
- [ ] Export current view as PNG
- [ ] Guided tour / teacher mode
- [ ] Printable era handouts

## Phase 6 — Quality and trust
- [ ] `docs/SOURCES.md` fully populated
- [ ] "How accurate is this?" page
- [ ] One-click error-report issue link
- [ ] Playwright smoke tests in CI
