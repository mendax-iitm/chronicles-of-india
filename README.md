# Chronicles of India

**An interactive historical atlas of the Indian subcontinent, 600 BCE – 1947 CE.**

Drag a timeline and watch the map of India change: empires rise and fall, borders shift,
cities change their names. Click anything to find out what it was and who ruled it.

> ⚠️ **Boundaries are schematic approximations for learning, not surveyed borders.**
> Empires had frontiers, not lines. See [docs/SOURCES.md](docs/SOURCES.md) and the
> editorial policy in [BRIEF.md](BRIEF.md#10-editorial-policy--read-this-carefully).

## Features

- **Timeline** — 18 era snapshots with a scrubber, a play button and era markers.
- **Ghost borders** — dashed outlines show which lands changed hands since the last era.
- **Place genealogy** — trace a city's names across the centuries: Pataliputra → Patna,
  Dhillika → Delhi → Shahjahanabad → New Delhi.
- **Journeys** — follow Alexander, Faxian, Xuanzang, Ibn Battuta and Gandhi across the map.
- **Events** — 25 dated turning points from the Kalinga War to Partition.
- **Pinpoint quiz** — tap where you think a historic city stood; scored by distance.

**In progress** (see [BRIEF.md §6](BRIEF.md#6-feature-parity-checklist)): reigning-ruler and
regnal-era display, administrative divisions, an X-ray lens showing modern boundaries,
trade corridors, terrain hillshade, universal search, deep links and embed mode, a GeoJSON
export, an MCP server and agent skill, Hindi and regional languages, a classroom/exam mode,
and full offline PWA use.

## Run it

No build step, no dependencies.

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
