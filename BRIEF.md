# Project Brief — Chronicles of India

> **This file is the single source of truth for what we are building.**
> Hand it to Claude Code at the start of a session and say:
> *"Read BRIEF.md and docs/ROADMAP.md, then start Phase 1."*

---

## 1. Objective

Build **Chronicles of India** — a free, open-source, browser-based **interactive historical
atlas of the Indian subcontinent from c. 600 BCE to 1947 CE**.

A visitor drags one timeline slider and watches the political map change: kingdoms rise and
fall, borders shift, capitals move, cities get renamed. They can click any region, city,
ruler or traveller and immediately learn what it was, who held it, and what happened there.

**The target is functional parity with
[`DeanChensj/jiangshan-map`](https://github.com/DeanChensj/jiangshan-map)
("Chronicles of the Realm"), the interactive historical atlas of China — feature for
feature, applied to India.** Section 6 is the parity checklist and is the spine of this
whole project.

**We reuse its product ideas, never its code or data.** That project is GPL-3.0, and part
of its boundary data (CHGIS-derived prefectures) is restricted to academic, non-commercial
use. Everything here is written from scratch so the result can be MIT-licensed and freely
reused by anyone, including commercially.

### The one-sentence test
*"A 14-year-old should understand the shape of Indian history in ten minutes of dragging a
slider, and a history teacher should trust it enough to project it in class."*

---

## 2. Audience

- **Primary:** school and college students in India, teachers, curious general readers.
- **Secondary:** diaspora readers, history hobbyists, UPSC and state-PSC aspirants — the
  ancient/medieval/modern India syllabus overlaps almost entirely with this content.
- **Purpose:** free public education. No ads, no tracking, no sign-up, no backend.

---

## 3. Non-goals

- No user accounts, login, backend server or database.
- No build step, bundler or framework (React/Vue/Svelte). Plain HTML/CSS/JS.
- No paid APIs, no runtime dependency on any third-party service.
- No claim of surveyed or legally authoritative borders. The "schematic approximation"
  disclaimer is visible at all times.
- No post-1947 political mapping (see §11).
- No AI-generated prose shipped unreviewed as historical fact.
- **No non-commercial or share-alike data.** A single CHGIS-style file would contaminate
  the repo. If a source is NC or SA, find another source or draw it ourselves.

---

## 4. Current state

`index.html` at the repo root is a **working v1 prototype** — one self-contained file,
~62 KB, zero dependencies, clean console, works on desktop and phone.

**Already working:** timeline scrubber with play/prev/next and era ticks · 18 era snapshots ·
polity regions with hover, click-select and labels · ghost borders · place genealogy for 22
cities · 5 traveller journeys with numbered stops and a walk-the-route animation · 25 dated
events as diamond markers · a 6-round pinpoint quiz with haversine scoring · pan/zoom/pinch ·
greedy label collision avoidance · responsive light theme.

**The two real gaps:**

1. **All geography is hand-drawn by eye.** The coastline is a 50-point polygon; each kingdom
   is assembled from ~25 reusable blobs ("atoms"); rivers are 5-to-9-point polylines. It
   reads correctly at a glance but it is not real geodata. **Phase 1 replaces it.**
2. **It is roughly 15% of the reference atlas by feature count and about 9% by snapshot
   count.** The reference carries 18 periods across 198 territorial snapshots; we have 18
   snapshots total. **Phases 3–6 close that gap.**

---

## 5. Architecture and hard constraints

1. **Zero runtime dependencies.** No CDN scripts. Must work from `file://` and from any
   static host, offline, forever.
2. **No build step for viewing.** `git clone && open index.html` just works. Build scripts
   exist only to *generate* committed data, never to run the site.
3. **Plain SVG rendered by our own code.** No Leaflet, D3 or Mapbox in the app itself.
   (A Leaflet demo page that consumes our exported GeoJSON is fine and expected — see §6.)
4. **Page weight budget: under 2 MB total**, under 800 KB preferred. Terrain tiles excluded,
   lazy-loaded.
5. **Must work on a ₹10,000 Android phone on 3G.** Performance beats polish.
6. **Accessible:** keyboard navigation, ARIA on controls, text alternatives for every map
   state, never colour alone to carry meaning.

### Target structure (after Phase 2)

```
chronicles-of-india/
├── index.html                  # shell + inlined critical CSS
├── css/atlas.css
├── js/
│   ├── projection.js           # lon/lat → SVG, pan/zoom camera
│   ├── render.js               # base map, polities, labels, overlays
│   ├── timeline.js             # slider, play, snapshot snapping, rulers
│   ├── search.js               # universal search box
│   ├── panel.js                # era / place / person / quiz panel
│   ├── api.js                  # window.atlasAPI + WebMCP registration
│   └── atlas.js                # state and wiring
├── data/
│   ├── base.json               # coastline, rivers, lakes, relief
│   ├── regions.json            # reusable region geometry ("atoms")
│   ├── snapshots/index.json    # snapshot id → from/to years, dynasty
│   ├── snapshots/<id>.json     # one territorial snapshot
│   ├── rulers.json             # dynasties, rulers, reign spans, regnal eras
│   ├── divisions.json          # first-level administrative divisions
│   ├── places.json             # cities + name genealogy + lore
│   ├── events.json
│   ├── journeys.json           # person chronicles
│   ├── corridors.json          # roads, canals, sea routes, frontier works
│   └── modern.json             # modern state boundaries for the X-ray lens
├── scripts/
│   ├── build-geo.mjs           # Natural Earth → data/base.json
│   ├── build-terrain.mjs       # hillshade tiles
│   ├── export-geojson.mjs      # → geojson/ (RFC 7946)
│   ├── validate.mjs            # CI data validation
│   ├── mcp-server.mjs          # stdio MCP server, zero deps
│   └── atlas-cli.py            # headless screenshot + lookup
├── geojson/                    # generated, git-ignored, plus demo.html
├── skills/chronicles-of-india/SKILL.md
├── docs/{DATA-MODEL,SOURCES,ROADMAP,ACCURACY}.md
├── llms.txt
├── Dockerfile, docker-compose.yml, .dockerignore
└── .github/workflows/{pages,validate}.yml
```

Data loads with `fetch()` from `data/` so contributors can edit history without touching
code. **This is the single most important refactor.** Keep a `file://` fallback: ship
`data/*.js` files that assign to `window.ATLAS_DATA`, or document `python3 -m http.server`.

---

## 6. Feature parity checklist

This is the spine. Each row is a feature of the reference atlas and its India equivalent.
Work through it; do not invent features outside it until every row is green.

### 6.1 Timeline, rulers and regnal eras
- [ ] Scrub the full span; the timeline displays the **reigning ruler** (name, dynasty,
      reign span) and the **regnal/era year** alongside the calendar year.
      India has no single imperial era, so show the relevant one for the dominant polity:
      **Vikram Samvat, Shaka Samvat, Kollam Era, Hijri, Bengali San, Fasli** — and label which.
- [ ] Multiple simultaneous ruler chips when the map is genuinely multipolar (e.g. 1600:
      Akbar / the Deccan sultans / the Zamorin).
- [ ] Keyboard: `←`/`→` step between snapshots, `Shift`+arrow moves 10 years, `Space`
      plays or pauses, `Esc` closes any popup or route.
- [ ] Snapshot count target: **~200 territorial snapshots** across ~20 periods, matching the
      reference's granularity. Phases *within* a dynasty, not one map per dynasty.

### 6.2 Map features
- [x] Multi-polity display with per-polity colour and labels.
- [ ] Hovering a legend entry **highlights** that polity; clicking it **zooms to its
      bounding box**.
- [x] Ghost-boundary diff against the previous snapshot (dashed outline).
- [ ] **First-level administrative divisions on hover** — the India equivalents are:
      Maurya *pradeshas*, Gupta *bhuktis* and *vishayas*, Chola *mandalams* and *valanadus*,
      Delhi Sultanate *iqtas*, Mughal *subahs* and *sarkars*, Maratha *prants*,
      British *presidencies*, *divisions* and *districts*.
      **Draw these ourselves. Do not use CHGIS-derived data or trace a copyrighted atlas.**
- [ ] **X-ray lens** — a draggable lens that overlays present-day state boundaries on the
      historical map, so a reader can answer "where is this today?"
- [ ] **Rivers, lakes and works that change with the year** — the India equivalents are
      rich: the **Ghaggar-Hakra / Saraswati** drying, **Indus and Kosi course changes**,
      the **Rann of Kutch** shifting between sea and salt flat, **Sambhar and Chilika**,
      the **Grand Anicut** (c. 2nd century CE), Firoz Shah's and the Mughal **canals**, and
      the colonial **Ganges and Upper Bari Doab canals**. Each gets `appear` / `vanish` years.
- [ ] **Corridors layer** — **Uttarapatha** and **Dakshinapatha**, the **Grand Trunk Road**,
      the **Silk Road's** Indian branches, **maritime spice routes** to Rome and Southeast
      Asia, **pilgrimage circuits** (char dham, the Buddhist circuit), and frontier works.
- [ ] **Terrain hillshade** under everything, built from a public-domain DEM
      (SRTM/GMTED/ETOPO via AWS Terrain Tiles or equivalent) at ~1 km/px, generated by
      `scripts/build-terrain.mjs`, lazy-loaded so it never blocks first paint.

### 6.3 "Trace Place" — place genealogy
- [x] Click a city to open it; show its name through the ages.
- [ ] Also open on **double-click anywhere on the canvas** — resolve to the nearest place.
- [ ] **"Capital" badges** on the eras when the place was an imperial or regional capital.
- [ ] **Site-specific events list**, filterable, where clicking an event **jumps to its year**.
- [ ] Extend beyond cities to **passes, ports, battlefields and literary sites**: the
      Khyber, Bolan and Palghat passes, Lothal and Muziris, Panipat, Haldighati, Plassey,
      Talikota, Kurukshetra, the Ajanta and Ellora caves, Sanchi, Nalanda, Hampi.
- [ ] **Place lore** — a short cultural note per site (what was written, built or sung there).

### 6.4 "Person Chronicle" — journeys
- [x] Numbered stops, walk-the-route animation.
- [ ] Opened from the **universal search box**, not only from a list.
- [ ] Draw routes as **arcs with directional ticks** rather than straight dashes.
- [ ] Stepping through stops updates **year, ruler, regnal era and territory together**.
- [ ] Support **multiple people or event storylines on the map at once**, for comparison.
- [ ] Target roster (~25): Alexander, Megasthenes, Ashoka's dhamma tours, Faxian, Xuanzang,
      Al-Biruni, Ibn Battuta, Marco Polo's Indian coast, Adi Shankara's digvijaya,
      Guru Nanak's udasis, Vasco da Gama, Babur, Shivaji's Karnataka campaign, Tipu Sultan,
      Kalidasa's *Meghaduta* route (literary), the Buddha's wanderings, Mahavira,
      Chaitanya, Mirabai, Tagore's travels, Gandhi, Ambedkar, Subhas Chandra Bose,
      the 1947 migration corridors.

### 6.5 Universal search
- [ ] A top-left search box opened with `/` or `Cmd/Ctrl + K`.
- [ ] Searches **people, cities, rulers, dynasties, eras, landmarks, passes, events** and
      accepts the keyword `quiz`.
- [ ] Typeahead, keyboard-navigable, works with Devanagari input once Phase 7 lands.

### 6.6 Pinpoint quiz
- [x] Drop a pin; great-circle distance scoring; city labels hidden.
- [ ] **Ten rounds of increasing difficulty** (currently six, flat).
- [ ] Each round gives **dynastic and period clues** instead of only a name.
- [ ] **Confirm button** before scoring, so a mis-tap is recoverable.
- [ ] **Concentric accuracy rings** drawn on reveal.
- [ ] **Named final ranks** — use Indian historiographical titles, e.g.
      *Lekhaka* → *Akshapataladhikrita* (keeper of records) → *Mahamatya* →
      *Rajyashastri · Bhuvanachitrakara* (master cartographer). Explain each in a tooltip.

### 6.7 Deep links and embed mode
- [ ] URL parameters: `year` (negative for BCE), `place` (one name, or comma-separated for a
      multi-stop route), `person`, `polity`, `quiz`, `lang`.
- [ ] Multi-year routes pair `year[i]` with `place[i]`.
- [ ] **Embed mode** `?embed=1` for iframes: hides site chrome, shows the map, a compact
      timeline, a title chip and an "Open in Chronicles of India ↗" link.
      Embed params: `embed`, `year`, `polity`, `person`, `stop`, `trace`, `lang`, `from`,
      `to`, `lock`, `autoplay`.
- [ ] **Export the current view as PNG** (canvas render of the SVG) for worksheets and slides.

### 6.8 AI, MCP and agent integration
- [ ] **`llms.txt`** at the root — a machine-readable description of the atlas and its data.
- [ ] **MCP server** `scripts/mcp-server.mjs` — stdio, **zero npm dependencies**, exposing:
      - `inspect_place({ year, place, lang? })`
      - `inspect_person({ person, stop?, lang? })`
      - `search_atlas({ query, limit?, lang? })`
      - plus one India-specific tool: `inspect_ruler({ year, polity?, lang? })`
- [ ] **Agent skill** `skills/chronicles-of-india/SKILL.md` with install instructions for
      `~/.claude/skills`.
- [ ] **Browser API `window.atlasAPI`** with `locate`, `inspect`, `resolvePlace`,
      `openPerson`, `search`. Keep it stable and documented — tests depend on it.
- [ ] **WebMCP tools** via `navigator.modelContext`: `india_locate`, `india_inspect`,
      `india_open_person`.
- [ ] **CLI renderer** `scripts/atlas-cli.py` — one command to produce a screenshot with
      `--year`, `--place`, `--out`.

### 6.9 GeoJSON export
- [ ] `scripts/export-geojson.mjs` emitting **RFC 7946** output to `geojson/` (git-ignored):
      `snapshots/<id>.geojson` (one per snapshot), `index.json`, `corridors.geojson`,
      `settlements.geojson`, `milestones.geojson`, `neighbors.geojson`, `modern/`.
- [ ] **Point-lookup helper** `geojson/india-locate.js` — `IndiaLocate.create()` and
      `locate(lon, lat, year)` returning the polity holding that point in that year.
- [ ] **Leaflet demo** `geojson/demo.html` accepting `year`, `lon`, `lat`.
- [ ] Because our data is CC BY rather than partly non-commercial, the export needs **no
      restricted-data flag** — a deliberate advantage over the reference. Say so in the docs.

### 6.10 Deployment
- [ ] **Local:** `python3 -m http.server 8000`, no build step.
- [ ] **GitHub Pages** via the committed workflow (already present).
- [ ] **Docker Compose:** `docker compose up -d --build`, served on `8008:80`.
- [ ] **Plain Docker:** static `nginx:alpine` image. `.dockerignore` excludes `data/`
      sources, `scripts/`, `skills/`, `docs/` and Markdown.

### 6.11 Compact encoding
- [ ] Once snapshot count approaches 200, raw coordinate arrays will blow the weight budget.
      Implement **topology de-duplication with delta-and-varint encoded geometry** (shared
      boundaries stored once and referenced). Target: all 200 snapshots under 600 KB.
      Keep the decoder under 60 lines.

---

## 7. Data model

Full schemas in `docs/DATA-MODEL.md`. Conventions: years are integers, negative = BCE,
**no year 0**; coordinates are `[lon, lat]` WGS 84; ids are kebab-case; region ids are
UPPER_SNAKE_CASE; every object asserting a fact carries a `sources` array whose keys
resolve in `docs/SOURCES.md`.

```jsonc
// snapshots/<id>.json
{
  "id": "maurya-ashoka",
  "from": -261,                    // first year shown. `to` is computed from the next snapshot
  "period": "mauryan",             // groups snapshots into a named period
  "title": "Ashoka's Maurya Empire",
  "rep": "c. 261 BCE",             // the year the geometry actually depicts
  "sum": "2–4 sentences, plain English.",
  "sources": ["…"],
  "pol": [{
    "n": "Maurya Empire",
    "c": "#e76f51",                // stable across snapshots for the same power
    "atoms": ["MAGADHA", "DOAB"],  // region ids held
    "t": "One line shown on selection.",
    "capital": "pataliputra",
    "ruler": "ashoka",             // → rulers.json
    "divisions": ["avanti-rashtra", "kalinga-rashtra"]
  }]
}

// rulers.json
{
  "id": "ashoka",
  "name": "Ashoka",
  "titles": ["Devanampiya Piyadasi"],
  "dynasty": "maurya",
  "reign": [-268, -232],           // may be approximate; set "approx": true
  "era": {"system": "regnal", "epoch": -268},
  "note": "One or two sentences.",
  "sources": ["…"]
}
```

**Rule: no uncited historical claim ships.** An atlas that cannot show its working is a
picture, not a reference.

---

## 8. Phased plan

Each phase ships independently; `main` is never broken.

### Phase 1 — Real geography *(current)*
Replace every hand-drawn shape with real, permissively-licensed geodata.
- Coastline, islands, rivers, lakes from **Natural Earth** (public domain), clipped to
  roughly lon 58–98 / lat 5–38 and simplified with `mapshaper`.
- Relief for the Himalaya, Western and Eastern Ghats, Vindhyas, Aravallis, Thar.
- Terrain hillshade from a public-domain DEM.
- Redraw the region atoms against real coastlines, rivers and watersheds; raise the count
  from ~25 to **40–60** for finer control.
- `scripts/build-geo.mjs`; commit both script and output.
- Decide: keep equirectangular, or move to **Lambert conformal conic** at 23°N, 80°E.
  The conic is more honest about India's shape; only adopt it if label placement and
  hit-testing stay simple. **Flag this decision before implementing.**

### Phase 2 — Code and data separation
Split `index.html` per §5 · move all content to `data/` · `scripts/validate.mjs` in CI
(year ordering, no year 0, every atom id exists, every source key resolves, place name
lists chronological) · `dist/atlas.html` single-file build for offline use ·
`scripts/export-geojson.mjs` and the Leaflet demo.

### Phase 3 — Depth of content
Snapshots **18 → ~200** · `rulers.json` for every dynasty with reign spans and regnal eras ·
first-level administrative divisions · places **22 → 80+** · events **25 → 80** ·
journeys **5 → 25** · corridors, canals and changing rivers · compact encoding (§6.11).

Snapshot gaps that most need filling: **185 BCE–30 CE** (Indo-Greeks, Shakas, Satavahanas),
**550–750 CE**, **1200–1500 CE** (the regional sultanates deserve several snapshots),
**1750–1850 CE** (the Company's expansion deserves five, not one).

### Phase 4 — Interaction parity
Universal search (`/`, `Cmd+K`) · keyboard shortcuts · legend hover-highlight and
click-to-zoom · X-ray lens · person chronicles as arcs with directional ticks and
multi-person display · quiz upgrade to ten rounds with clues, confirm, rings and ranks.

### Phase 5 — Sharing and deployment
Deep links and multi-stop routes · embed mode · PNG export · Docker and Docker Compose ·
`sitemap.xml` and per-period landing pages for discoverability.

### Phase 6 — AI and agent integration
`llms.txt` · MCP server · agent skill · `window.atlasAPI` · WebMCP · CLI renderer.

### Phase 7 — Language and accessibility
**Hindi as a first-class second language**, then Bengali, Tamil, Telugu, Marathi.
Structure every string as `{en, hi, …}` from the start of Phase 2 so this is not a rewrite.
Regional-script place names (Thanjavur / தஞ்சாவூர், Varanasi / वाराणसी).
Full keyboard navigation · screen-reader announcements on era change ·
`prefers-reduced-motion` · `lang` URL parameter.

### Phase 8 — Exam and classroom mode
- **Syllabus mapping:** tag every snapshot, place and event against the **NCERT chapters**
  (Classes 6–12) and the **UPSC Prelims/Mains history syllabus**, so a student can filter
  the atlas down to "what I actually need for Ancient India".
- **Revision view:** a compact, printable summary per period — rulers, dates, capitals, key
  events, one map image.
- **Practice sets:** timed question sets generated from the data — match-the-capital,
  order-the-dynasties, locate-the-site, which-ruler-when. Reuse the quiz engine.
- **Teacher mode:** a scripted guided tour — a sequence of snapshots with narration that
  plays like a lesson, pausable, with teacher notes. Optional browser speech-synthesis
  narration (off by default; it must never be required).
- **Worksheets:** printable blank outline maps generated from our own geometry, with an
  answer key.
- **Classroom-safe:** everything works offline and on a projector at 1024×768.

### Phase 9 — Community and launch
- **Seed 30–50 good first issues**, one per missing snapshot or place, each with the
  source to consult and the file to edit, labelled `good-first-issue` and `history`.
- **`docs/ACCURACY.md`** — a public "How accurate is this?" page: the method, the
  uncertainty, the known weak spots, and how to report an error.
- **One-click error reporting** — a link on every era that opens a pre-filled GitHub issue
  carrying the year and snapshot id.
- **Outreach:** history teachers' groups, NCERT/Ekstep-adjacent communities, r/IndianHistory,
  r/India, Hacker News, Indian edtech newsletters, Wikipedia WikiProject India, and the
  author of the reference atlas (a courtesy note — this is a tribute, not a fork).
- **README in Hindi** alongside English.
- **A contributor ladder:** data-only contributors should never need to read JavaScript.

### Phase 10 — Offline and installable
- **PWA**: web app manifest, service worker, installable on Android and desktop.
- **Full offline use** — the whole atlas, including terrain tiles, cached on first visit.
  This is the point of the weight budget: a classroom with no connectivity is the target
  environment, not an edge case.
- **Low-end device testing** on a 2 GB Android phone; ship a "lite" mode that drops terrain
  and animation.
- **Optional APK wrapper** only if the PWA proves insufficient — do not start here.

### Running requirement — quality and trust
Not a phase; applies to every commit. `docs/SOURCES.md` grows with every claim ·
Playwright smoke tests in CI (no console errors, every snapshot renders, quiz completes) ·
page weight checked against the budget.

---

## 9. Quality bar for every change

1. Open the page, drag the slider end to end. No console errors.
2. Check 390 px (phone), 1024×768 (projector) and 1440 px (desktop).
3. No polity large enough to label is left unlabelled.
4. Every new historical claim has a key in `docs/SOURCES.md`.
5. Page weight has not regressed past the §5 budget.
6. Data changes pass `scripts/validate.mjs`.

---

## 10. Tech notes for the implementer

- The projection is currently equirectangular with a `0.93` x-factor to reduce stretch at
  Indian latitudes. See the Phase 1 note on the conic alternative.
- Polities are drawn as a union of region polygons **clipped to the coastline** via
  `<clipPath>`, so coastal regions can overshoot into the sea without producing slivers.
  **Keep this trick** — it makes the data far more forgiving to draw.
- Label collision avoidance is a greedy largest-area-first bounding-box test. It is
  adequate. Do not over-engineer it.
- `window.atlas` exposes `{st, SN, PL, EV, JR, setYear, act}` for debugging and tests.
  Phase 6 formalises this as `window.atlasAPI`. **Keep both stable.**
- Snapshot transitions are deliberate **jumps, not interpolations**. Interpolating borders
  between dated snapshots would invent history. The ghost-border diff is how change is
  communicated instead.

---

## 11. Editorial policy — binding rules

Indian history is contested, and a map is an opinionated object. These rules are not
optional and are not stylistic preferences. A contribution that breaks them gets closed,
however well-sourced.

### 11.1 Scope
- **The atlas ends at 1947.** No post-independence boundary mapping: no state
  reorganisation, no Line of Control, no Line of Actual Control, no current disputes.
  This is a deliberate limit that keeps the project an educational artefact rather than a
  participant in live disputes.
- **Jammu & Kashmir** in the 1947 snapshot: shown in a distinct neutral colour, labelled
  *disputed*, with a summary stating the facts of accession and that the status is
  disputed — and nothing further. Do not recolour it into either dominion. Do not add
  territorial claims. **Changing this requires discussion in an issue first.**
- Similarly neutral handling for any 1947 boundary that was unresolved at that date.

### 11.2 Evidence
- **Follow scholarly consensus. Where there isn't one, say so on the map, not in a
  footnote.** Use a visible "disputed" or "approximate" marker.
- Dates with no consensus — the Buddha's and Mahavira's dates, the Harappan chronology,
  Aryan migration, the historicity and dating of the Mahabharata and Ramayana, the date of
  Adi Shankara — must be shown as **ranges labelled as disputed**, or left out. Never pick
  one and present it bare.
- **Traditional and legendary dates must be labelled** as such (the prototype already does
  this for the Buddha's enlightenment; match that pattern everywhere).
- Archaeological and epigraphic evidence outranks literary and traditional sources where
  they conflict. Say when they conflict.
- **No pseudo-archaeology, no "suppressed history", no chronology revisionism**, from any
  direction, however confidently sourced on the open web.

### 11.3 Framing — worked examples

| ❌ Do not write | ✅ Write instead |
|---|---|
| "Muslim invaders destroyed…" | "Mahmud of Ghazni's raids reached Somnath in 1026; the temple was sacked and later rebuilt." |
| "Foreign rule began in 1206." | "The Delhi Sultanate was founded in 1206 by Qutb-ud-din Aibak, a commander of Turkic origin." |
| "The glorious Hindu empire of Vijayanagara" | "Vijayanagara, founded 1336, became the dominant power in the south." |
| "Aurangzeb was a bigoted tyrant." | "Aurangzeb reimposed the jizya in 1679 and ordered temple demolitions at Kashi and Mathura; he also issued grants to other temples. Historians dispute how to weigh these." |
| "The British civilised India." / "The British only looted India." | "Company and Crown rule built railways, canals and a civil service, and extracted revenue and raw materials; famine mortality rose sharply in this period." |
| "Dravidians were pushed south by Aryans." | *Omit. The migration's scale, dating and demographic effect are actively debated.* |
| "India was always one nation." / "India was never one nation." | *Omit both. Show the maps and let them speak.* |

### 11.4 Specific prohibitions
- **No communal framing.** Never colour, group or caption the map along religious lines.
  Dynasties are coloured by polity, never by the ruler's religion. A PR that recolours the
  map along religious lines will be closed without discussion.
- **No "invader vs native" framing.** State where a dynasty originated and when it
  arrived. The reader draws the conclusion.
- **No caste commentary** beyond what is strictly necessary to explain an institution, and
  then only cited and neutral.
- **Describe what rulers did** — conquered, taxed, built, patronised, destroyed — with
  dates and sources. Do not award verdicts. Document well-attested violence and
  destruction factually, without rhetoric and without euphemism. Both the sanitising and
  the inflaming of such events are failures.
- **No living or recent political figures, parties or movements.** The scope ends in 1947
  for exactly this reason.
- **No nationalist or colonial triumphalism** in any summary, in any language. Check the
  Hindi and regional translations separately — framing drifts in translation.

### 11.5 Cartographic honesty
- **Empires had frontiers, not lines.** The disclaimer is visible at all times. Prefer
  "controlled", "held tribute from", "claimed" over "ruled".
- **Zones of tribute and suzerainty** should be visually distinguishable from directly
  administered territory once Phase 3 allows it (hatching or reduced opacity).
- **Unclaimed, forested, tribal and autonomous interiors must be left unclaimed.** Do not
  fill the Indian map edge to edge to make an empire look tidy. The Gonds, Bhils, Santhals,
  the north-eastern hill peoples and many others were not anyone's subjects for most of
  this period, and the map must show that.
- **Include the south, the north-east and the interior in every period.** The commonest
  failure of Indian historical maps is a Delhi-centric view where the Deccan is a blur and
  the north-east is blank. Treat a snapshot as incomplete until those regions are populated.
- **Name places as people then named them**, with the modern name alongside — exactly what
  the place-genealogy feature exists for.

### 11.6 When in doubt
Open an issue. Do not resolve a contested framing question inside a pull request.

---

## 12. Licence

- **Code: MIT.**
- **Data, text and curated geometry in `data/`: CC BY 4.0.**
- Natural Earth is public domain; credit it in `docs/SOURCES.md` anyway.
- **Never add a file whose licence forbids commercial use or imposes share-alike.** That
  freedom is the main practical advantage this project has over the reference atlas, whose
  prefecture data is restricted; do not throw it away for one convenient dataset.
- Reference works (Schwartzberg's *Historical Atlas of South Asia*, the Cambridge
  histories, Habib's *Atlas of the Mughal Empire*) may be **consulted for facts** — facts
  are not copyrightable — but **their map artwork must never be traced or reproduced.**

---

## 13. Starting a Claude Code session

```
Read BRIEF.md and docs/ROADMAP.md.
We are on Phase 1. Start with the coastline: download Natural Earth 10m coastline and
countries, clip to the subcontinent bounding box, simplify, and write
scripts/build-geo.mjs that emits data/base.json.
Show me the rendered result before touching the kingdom regions.
```

Keep commits small and scoped to one checklist item. Open a PR per item where practical.
Tick items in `docs/ROADMAP.md` and the §6 parity checklist as they land.
