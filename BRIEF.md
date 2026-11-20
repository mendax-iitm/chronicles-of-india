# Project Brief — Chronicles of India

> **This file is the single source of truth for what we are building.**
> Hand it to Claude Code (or any agent) at the start of a session and say:
> *"Read BRIEF.md and docs/ROADMAP.md, then start Phase 1."*

---

## 1. Objective

Build **Chronicles of India** — a free, open-source, browser-based **interactive historical
atlas of the Indian subcontinent from c. 600 BCE to 1947 CE**.

A visitor should be able to drag a single timeline slider and watch the political map of
the subcontinent change: kingdoms rise, borders shift, capitals move, cities get renamed.
They should be able to click any region or city and immediately learn who ruled it, what
it was called at that moment, and what happened there.

The project is inspired by [`DeanChensj/jiangshan-map`](https://github.com/DeanChensj/jiangshan-map)
("Chronicles of the Realm"), an interactive historical atlas of China. **We reuse the
*product ideas*, not its code or data.** That project is GPL-3.0 and some of its boundary
data is restricted to non-commercial academic use. Everything in this repository is
written from scratch so it can be MIT-licensed and freely reused.

### The one-sentence test
*"A 14-year-old student should understand the shape of Indian history in ten minutes of
dragging a slider, and a history teacher should trust it enough to project it in class."*

---

## 2. Audience and purpose

- **Primary:** school and college students in India, teachers, and curious general readers.
- **Secondary:** diaspora readers, history hobbyists, quiz and competitive-exam aspirants
  (UPSC/state PSC history syllabus overlaps heavily with this content).
- **Purpose:** free public education. Not a commercial product. No ads, no tracking,
  no sign-up, no backend.

---

## 3. Non-goals (do not build these)

- ❌ No user accounts, login, backend server, or database.
- ❌ No build step, bundler, npm install, or framework (React/Vue/Svelte). Plain HTML/CSS/JS.
- ❌ No paid APIs or any runtime dependency on a third-party service.
- ❌ No claim of surveyed or legally authoritative borders. Every view must carry a
  "schematic approximation" disclaimer.
- ❌ No post-1947 political mapping in v1 (see §10 on sensitivity).
- ❌ No AI-generated prose shipped unreviewed as historical fact.

---

## 4. Current state (what already exists)

`index.html` at the repo root is a **working v1 prototype**, built in one session. It is a
single self-contained file, ~62 KB, zero dependencies, and already implements every core
interaction. It works on desktop and mobile and has no console errors.

**Already working:**

| Feature | State |
|---|---|
| Timeline slider, play/pause, prev/next era, era tick marks | ✅ Done |
| 18 era snapshots, 600 BCE → 1947 CE | ✅ Done (data is coarse) |
| Polity regions with hover tooltips, click-to-select, labels | ✅ Done |
| "Ghost borders" — dashed outlines of land that changed hands | ✅ Done |
| Place genealogy — 22 cities with names across eras | ✅ Done |
| Journeys — 5 travellers with numbered stops + "walk the route" | ✅ Done |
| Events — 25 dated events as ◆ markers | ✅ Done |
| Pinpoint quiz — 6 rounds, haversine distance scoring | ✅ Done |
| Pan / zoom / pinch, label collision avoidance | ✅ Done |
| Responsive layout, light theme | ✅ Done |

**The known weakness — and the main job:**

> All geography in v1 is **hand-drawn by eye**. The coastline is a 50-point polygon.
> Every kingdom is assembled from ~25 reusable blobs called "atoms" (`GANDHARA`,
> `MAGADHA`, `DECCAN`…). Rivers are 5-to-9-point polylines. It *reads* correctly at a
> glance but it is not real geodata. **Phase 1 replaces this.**

---

## 5. Architecture and constraints

### Hard constraints
1. **Zero runtime dependencies.** No CDN scripts. It must work from `file://` and from
   any static host, offline, forever.
2. **No build step.** `git clone && open index.html` must just work.
3. **Everything is plain SVG** rendered by our own code. No Leaflet, no D3, no Mapbox.
4. **Total page weight target: under 2 MB** including all geodata. Under 800 KB preferred.
5. **Works on a ₹10,000 Android phone on 3G.** Performance matters more than polish.
6. **Accessible:** keyboard navigation, ARIA labels on controls, text alternatives for
   every map state, colour choices that survive colour-blindness (never colour alone).

### Target structure (after Phase 2 refactor)
```
chronicles-of-india/
├── index.html              # shell + inlined critical CSS
├── css/atlas.css
├── js/
│   ├── projection.js       # lon/lat → SVG, pan/zoom camera
│   ├── render.js           # draws base map, polities, labels, overlays
│   ├── timeline.js         # slider, play, era snapping
│   ├── panel.js            # right-hand panel: era / places / journeys / quiz
│   └── atlas.js            # state, wiring, public window.atlas API
├── data/
│   ├── base.json           # coastline, rivers, lakes, relief
│   ├── eras.json           # era metadata + which regions each polity holds
│   ├── regions.json        # the reusable region geometry ("atoms")
│   ├── places.json         # cities + name genealogy
│   ├── events.json
│   └── journeys.json
├── docs/
│   ├── BRIEF.md (this file, or kept at root)
│   ├── DATA-MODEL.md       # schemas — read before touching data/
│   ├── SOURCES.md          # every factual claim → its citation
│   └── ROADMAP.md
└── .github/workflows/pages.yml
```

Data must be loaded with `fetch()` from `data/*.json` so that contributors can edit history
without touching code — **this is the single most important refactor.** Keep a tiny inline
fallback so `file://` still works (fetch of local JSON is blocked by CORS on `file://`;
solution: ship `data/*.js` files that assign to `window.ATLAS_DATA`, or document that
contributors run `python3 -m http.server`).

---

## 6. Data model

Full schemas live in `docs/DATA-MODEL.md`. Summary:

### Era snapshot
An era is a *dated snapshot*, not a continuous animation. Between eras the map does not
interpolate — it jumps, and ghost borders show what changed.

```jsonc
{
  "from": -261,                    // first year this snapshot is shown. Negative = BCE. No year 0.
  "to": -186,                      // computed: next era's `from` minus 1
  "title": "Ashoka's Maurya Empire",
  "rep": "c. 261 BCE",             // the year the geometry actually depicts
  "sum": "2–4 sentence plain-English summary…",
  "sources": ["ncert-ancient-ch8", "schwartzberg-pl14"],
  "pol": [                         // polities on the map, largest/most important first
    {
      "n": "Maurya Empire",
      "c": "#e76f51",              // fill colour
      "atoms": ["MAGADHA", "DOAB", "..."],   // region ids it holds
      "t": "One-line detail shown when selected.",
      "capital": "pataliputra"     // optional: place id
    }
  ]
}
```

### Place (city with name genealogy)
```jsonc
{
  "id": "pataliputra",
  "lon": 85.14, "lat": 25.61,
  "n": [                           // chronological. Each entry = "from this year, called this"
    [-490, "Pataliputra", "Founded as a fort by Udayin…"],
    [1541, "Patna",       "Sher Shah Suri rebuilds the city…"]
  ],
  "sources": ["…"]
}
```

### Event
```jsonc
{ "y": 1526, "lon": 76.97, "lat": 29.39,
  "t": "First Battle of Panipat",
  "d": "Babur defeats Ibrahim Lodi, founding the Mughal empire.",
  "sources": ["…"] }
```

### Journey
```jsonc
{ "n": "Xuanzang's journey", "who": "Xuanzang, Chinese monk", "yrs": "630–643 CE",
  "d": "…",
  "s": [ ["Peshawar", 71.6, 34, 630, "Enters the subcontinent."], … ] }
```

**Rule: every `sources` entry must resolve to a citation in `docs/SOURCES.md`.**

---

## 7. Phased plan

Work in this order. Each phase ships independently — the site must never be broken on `main`.

### Phase 1 — Real geography *(highest priority)*
Replace all hand-drawn geometry with real, properly-licensed geodata.

- [ ] **Coastline + modern reference outline** from **Natural Earth** (public domain,
      `ne_10m_admin_0_countries` / `ne_10m_coastline`). Download, clip to a bounding box
      of roughly lon 58–98, lat 5–38, simplify with `mapshaper` to ~0.5 % of original
      vertices, output GeoJSON, convert to our compact format.
- [ ] **Rivers and lakes** from Natural Earth `ne_10m_rivers_lake_centerlines`.
      Keep Indus, Ganga, Yamuna, Brahmaputra, Narmada, Tapti, Godavari, Krishna, Kaveri,
      Mahanadi, Sutlej, Chenab, Jhelum, Son, Chambal, Ghaggar.
- [ ] **Relief shading** for the Himalaya, Western/Eastern Ghats, Vindhyas, Aravallis and
      the Thar Desert — a soft semi-transparent layer. Natural Earth raster is an option,
      but a hand-traced *physiographic* polygon set is acceptable here because physical
      geography is not politically contested.
- [ ] **Redraw the ~25 region "atoms"** as real polygons that follow coastlines, rivers and
      watersheds instead of straight lines. Consider raising the count to 40–60 atoms for
      finer control (e.g. split DECCAN into Telangana / Rayalaseema / Karnataka plateau).
- [ ] Write `scripts/build-geo.mjs` — a Node script that takes raw Natural Earth files and
      emits `data/base.json`. Commit both the script and its output; never require a
      contributor to run it just to view the site.

**Licensing rule for Phase 1:** only use **public domain or permissively licensed** sources.
**Natural Earth (public domain) is the default choice.** ⚠️ **Do NOT use CHGIS-derived data,
and do NOT copy boundaries by tracing a copyrighted atlas page** (Schwartzberg's *Historical
Atlas of South Asia* may be *consulted as a reference* for where borders roughly were —
facts are not copyrightable — but its specific map artwork must not be traced or reproduced).
Record in `docs/SOURCES.md` which historical authority informed each era's borders.

### Phase 2 — Code and data separation
- [ ] Split `index.html` into `css/`, `js/`, `data/` per §5.
- [ ] All historical content moves to `data/*.json`, loadable and editable without JS knowledge.
- [ ] Add a JSON-schema validation script (`scripts/validate.mjs`, Node only, no deps)
      run in CI: checks years are ordered, every `atoms` id exists, every `sources` id
      resolves, no year 0, every place's name list is chronological.
- [ ] Keep the single-file build as a generated artifact (`dist/atlas.html`) for offline use.

### Phase 3 — Depth of content
- [ ] Grow eras from 18 to ~30. The gaps that most need filling: 185 BCE–30 CE (Indo-Greeks,
      Shakas, Satavahanas), 550–750 CE, 1200–1500 CE (regional sultanates deserve 2–3 snapshots),
      and 1750–1850 CE (the Company's expansion deserves 3 snapshots, not 1).
- [ ] Grow places from 22 to 60+. Must-adds: Dholavira, Lothal, Kalibangan, Rakhigarhi
      (Harappan), Vaishali, Shravasti, Kaushambi, Sanchi, Amaravati, Nagarjunakonda,
      Badami, Ellora, Khajuraho, Konark, Somnath, Dwarka, Puri, Srirangapatna,
      Murshidabad, Surat, Goa, Pondicherry, Machilipatnam, Dhaka, Multan, Peshawar.
- [ ] Grow events from 25 to ~60.
- [ ] Add journeys: Megasthenes, Al-Biruni, Marco Polo's Indian coast, Guru Nanak's
      udasis, Adi Shankara's digvijaya, Shivaji's Karnataka campaign, Vasco da Gama,
      the Dandi March (already partly present), the 1947 migration corridors.
- [ ] **Layers toggle:** trade routes (Uttarapatha, Dakshinapatha, Grand Trunk Road,
      maritime spice routes), the spread of Buddhism/Jainism, major Ashokan edict sites,
      UNESCO World Heritage sites, Harappan sites.

### Phase 4 — Language and accessibility
- [ ] **Hindi UI and content** as a first-class second language. Structure `data/` so each
      string has an `en` and `hi` key, then add Bengali, Tamil, Telugu, Marathi.
- [ ] Place names should show their regional-language name where it matters
      (Thanjavur / தஞ்சாவூர், Varanasi / वाराणसी).
- [ ] Full keyboard navigation; screen-reader announcements when the era changes.
- [ ] `prefers-reduced-motion` support (disable the fly-to animation).

### Phase 5 — Sharing and teaching
- [ ] **URL state:** `#year=1526`, `#place=delhi`, `#journey=xuanzang`, `#era=mughal`
      so any view is linkable. (Note: artifact hosting restricts hashes — on GitHub Pages
      there is no such restriction, use full query/hash state there.)
- [ ] **Embed mode** `?embed=1` — hides the header, for iframing into blogs and school sites.
- [ ] **Export PNG** of the current map view (canvas render of the SVG) for worksheets.
- [ ] **Teacher mode:** a guided tour — a scripted sequence of eras + narration that plays
      like a lesson.
- [ ] Printable era handouts.

### Phase 6 — Quality and trust
- [ ] `docs/SOURCES.md` fully populated — every era, every place, every event cited.
- [ ] A visible **"How accurate is this?"** page explaining the method, the uncertainty,
      and how to report an error.
- [ ] A one-click "Report an error on this era" link that opens a pre-filled GitHub issue.
- [ ] Playwright smoke tests in CI: no console errors, each era renders, quiz completes.

---

## 8. Quality bar for every change

Before any commit:
1. Open `index.html` and drag the slider across the full range. No console errors.
2. Check 390 px width (phone) and 1440 px (desktop).
3. No polity should be unlabelled if it is large enough to read.
4. Any new historical claim has a source recorded in `docs/SOURCES.md`.
5. Page weight has not regressed past the budget in §5.

---

## 9. Tech notes for the implementer

- Projection is currently a plain equirectangular with a `0.93` x-factor to reduce the
  stretch at Indian latitudes. A proper **Lambert conformal conic** centred at 23°N, 80°E
  would be more honest and is worth doing in Phase 1 — but only if label placement and
  hit-testing stay simple.
- Polities are drawn as a union of region polygons clipped to the coastline via
  `<clipPath>`, which lets coastal regions overshoot into the sea without looking wrong.
  **Keep this trick** — it makes the data far more forgiving.
- Label collision avoidance is a simple greedy bounding-box test, largest-area-first.
  It is adequate; do not over-engineer it.
- `window.atlas` exposes `{st, SN, PL, EV, JR, setYear, act}` for debugging and tests.
  Keep this API stable.

---

## 10. Editorial policy — read this carefully

Indian history is contested, and a map is an opinionated object. These rules are not
optional.

1. **Scope ends at 1947.** Do not map post-independence boundary disputes.
2. **Jammu & Kashmir** in the 1947 snapshot is labelled *disputed*, shown in a neutral
   colour, and the summary states the facts of accession without taking a side. Do not
   change this without discussion.
3. **Use the scholarly consensus, and say when there isn't one.** Where dates are disputed
   (the Buddha's dates, the Aryan migration, the Mahabharata war), present the range and
   label it, or leave it out. Mark traditional/legendary dates as such.
4. **No religious or communal framing.** Describe what rulers *did* — conquered, taxed,
   built, patronised. Do not characterise entire dynasties or communities as good or bad.
   Describe destruction and violence factually where it is well-documented, without
   rhetoric, and cite it.
5. **Avoid "invader" vs "native" framing.** Say where a dynasty came from and when; let the
   reader draw conclusions.
6. **Borders of empires were frontiers, not lines.** The disclaimer must be visible at all
   times. Prefer language like "controlled", "held tribute from", "claimed".
7. **Include the south, the north-east and the tribal interior.** The commonest failure of
   Indian historical maps is a Delhi-centric view where the Deccan and the north-east are
   blank. Do not repeat it.
8. **Name things as people then named them**, with the modern name alongside — that is
   precisely what the place-genealogy feature is for.

---

## 11. Licence

- **Code: MIT.**
- **Original data, text and curated geometry in `data/`: CC BY 4.0.**
- Natural Earth data is public domain and needs no attribution, but credit it anyway in
  `docs/SOURCES.md`.
- Never add a file whose licence forbids commercial use — it would contaminate the repo.
  If a source is non-commercial or share-alike, find another source.

---

## 12. How to start a Claude Code session on this repo

```
Read BRIEF.md and docs/ROADMAP.md.
We are on Phase 1. Start with the coastline:
download Natural Earth 10m coastline + countries, clip to the subcontinent bounding box,
simplify, and write scripts/build-geo.mjs that emits data/base.json.
Show me the rendered result before touching the kingdom regions.
```

Keep commits small and scoped to one phase item. Open a PR per phase item where practical.
