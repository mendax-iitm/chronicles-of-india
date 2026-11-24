# Chronicles of India

[हिन्दी README](README.hi.md) · [Historical Accuracy](docs/ACCURACY.md) · [Sources](docs/SOURCES.md) · [Good First Issues](docs/GOOD-FIRST-ISSUES.md)

**An interactive historical atlas of the Indian subcontinent, 600 BCE – 1947 CE.**

Drag a timeline and watch the map of India change: empires rise and fall, borders shift,
cities change their names. Click anything to find out what it was and who ruled it.

> ⚠️ **Boundaries are schematic approximations for learning, not surveyed borders.**
> Empires had frontiers, not lines. See [docs/ACCURACY.md](docs/ACCURACY.md),
> [docs/SOURCES.md](docs/SOURCES.md), and the editorial policy in
> [BRIEF.md](BRIEF.md#10-editorial-policy--read-this-carefully).

## Features

- **Timeline** — 36 era snapshots (600 BCE – 1947 CE) with a colored era scrubber, playback speed controls, and NCERT/UPSC syllabus filter.
- **Ghost borders** — dashed outlines show which lands changed hands since the last era.
- **Place genealogy** — trace 92 cities across the centuries with native regional scripts: Pataliputra → Patna, Dhillika → Delhi → Shahjahanabad → New Delhi, தஞ்சாவூர் (Thanjavur).
- **Journeys** — follow 26 travellers and campaigns (Alexander, Faxian, Xuanzang, Ibn Battuta, Guru Nanak, Shivaji, Gandhi) with directional arcs and route comparison.
- **Events & Map Balloons** — 82 dated turning points from the Kalinga War to 1947 Independence & Integration.
- **Exam & Classroom Mode** — Teacher Tour with optional voice narration, printable Period Revision Sheets, and Blank Outline Map Worksheets with Answer Key.
- **Pinpoint Quiz & Practice** — Pinpoint Map Quiz (10 curated rounds), Match the Capital, Order the Dynasties, and Which Ruler When.
- **AI & Developer Ready** — `llms.txt`, MCP server (`scripts/mcp-server.js`), `window.atlasAPI`, WebMCP, Python CLI, and RFC 7946 GeoJSON export.
- **Real geography** — coastline, islands, 36 waterways and mountain relief from Natural Earth, terrain hillshade from SRTM/ETOPO1, and 60 region atoms with 0 overlaps.

**Next up** (see [docs/ROADMAP.md](docs/ROADMAP.md)): Phase 10 — Offline PWA manifest, service worker, and low-end device "Lite" mode.

## Run it

No build step, no dependencies. The generated map data in `data/` is committed, so you never
need to run the scripts in `scripts/` just to view the atlas.

```bash
git clone https://github.com/<your-username>/chronicles-of-india.git
cd chronicles-of-india
open index.html          # macOS. Or just double-click the file.
```

For development with JSON data loading, serve it:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Contributing

History corrections are the most valuable contribution. See [CONTRIBUTING.md](CONTRIBUTING.md).
Every factual claim needs a source. If you spot a wrong border, a wrong date or a
missing kingdom, please open an issue.

## Project plan

New here? [HANDOVER.md](HANDOVER.md) gets you from zero to a working session.
Read [BRIEF.md](BRIEF.md) — it is the single source of truth for scope, architecture,
data model, the phased plan and the editorial policy.

## Credits and licence

A tribute to [Chronicles of the Realm (`jiangshan-map`)](https://github.com/DeanChensj/jiangshan-map),
an interactive historical atlas of China, whose feature set this project aims to match for
India. It reuses that project's *ideas* only — all code and data here are original, so
none of its GPL-3.0 or non-commercial data terms apply, and everything here stays free for
commercial reuse too.

- Code: [MIT](LICENSE)
- Data, text and curated geometry in `data/`: CC BY 4.0
- Base geography: [Natural Earth](https://www.naturalearthdata.com/) (public domain)
