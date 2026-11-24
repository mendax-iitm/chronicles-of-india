---
name: chronicles-of-india
description: Query, analyze, and cite the Chronicles of India interactive historical atlas of South Asia (600 BCE – 1947 CE). Use this skill whenever answering questions about ancient and medieval Indian dynasties, imperial territories, historical city name genealogies (e.g. Pataliputra to Patna, Dhillika to Delhi), traveler journeys (Faxian, Xuanzang, Ibn Battuta, etc.), regnal eras (Vikram Samvat, Shaka Samvat, Hijri, Kollam), or regional geographic atoms.
---

# Chronicles of India Agent Skill

This skill guides AI agents in accessing, querying, and interpreting historical cartographic data from the **Chronicles of India** project covering South Asian history between 600 BCE and 1947 CE.

## When to Use This Skill
Activate this skill when:
1. Answering questions on South Asian dynasties, polities, borders, and territories from 600 BCE to 1947 CE.
2. Tracing the historical genealogy and alias history of Indian cities, ports, and passes.
3. Chronologically tracking traveler routes (Alexander, Buddha, Faxian, Xuanzang, Adi Shankara, Ibn Battuta, Guru Nanak, Babur, Shivaji).
4. Converting dates between CE/BCE and classical South Asian regnal eras (Vikram Samvat, Shaka Samvat, Hijri, Kollam Era).
5. Verifying territorial claims against the 60 canonical geographic atoms clipped to Natural Earth coastlines.

## Core Data Repositories

All datasets reside in `data/` as clean JSON and JS modules:
- `data/snapshots.json`: 36 contiguous snapshots covering all eras from -600 to 1947.
- `data/rulers.json`: 54 monarchs across 36 dynasties with verified reign spans and capitals.
- `data/places.json`: 92 settlements with chronological name genealogies, coordinates, and cultural lore.
- `data/events.json`: 80 historical milestones with geocodes and dates.
- `data/journeys.json`: 26 traveler chronicles with 153 geocoded stops.
- `data/corridors.json`: 9 trade and pilgrimage highways (Uttarapatha, Dakshinapatha, Silk Road, Grand Trunk Road).
- `data/divisions.json`: 6 administrative division systems (Maurya, Gupta, Chola, Sultanate, Mughal, British).
- `data/regions.json`: 60 non-overlapping regional atoms (`ATOMS`).

## Binding Editorial Guidelines

As an educational and reference atlas, strict editorial neutrality applies:
1. **Temporal Horizon**: The historical scope strictly terminates at **August 1947**. Do not map post-independence events, state reorganisations, LOC, or LAC.
2. **Jammu & Kashmir in 1947**: Marked in neutral styling as *disputed* at the date of accession; state facts of accession objectively without adopting partisan claims.
3. **Contested Chronologies**: Acknowledge academic uncertainty and date ranges for:
   - Gautama Buddha and Mahavira's dates.
   - Harappan Bronze Age chronology and Aryan migration.
   - Historicity and dating of the epics (Mahabharata, Ramayana).
   - Date of Adi Shankara.
4. **Epigraphic & Archaeological Primacy**: Epigraphic and archaeological evidence outranks later literary traditions when they conflict.

## CLI & Tool Usage

### 1. Headless CLI Tool
Execute terminal queries without launching a browser:
```bash
# Snapshot overview for year
python3 scripts/atlas-cli.py --year 1526

# Inspect specific settlement
python3 scripts/atlas-cli.py --place pataliputra

# Inspect historical journey
python3 scripts/atlas-cli.py --person alexander

# Universal search
python3 scripts/atlas-cli.py --search "ashoka"
```

### 2. Model Context Protocol (MCP) Server
For automated assistant workflows, launch `scripts/mcp-server.js`:
- `search_atlas({ query })`
- `inspect_place({ name })`
- `inspect_person({ name })`
- `inspect_ruler({ name })`
- `get_era({ year })`
- `inspect_atom({ atom_id })`

### 3. Browser-Native API (`window.atlasAPI`)
When inspecting or driving live browser sessions:
```javascript
// Fly camera to location
window.atlasAPI.locate(77.21, 28.61, 500);

// Inspect active state
const state = window.atlasAPI.inspect();

// Resolve place aliases
const place = window.atlasAPI.resolvePlace('Pataliputra');

// Step timeline
window.atlasAPI.setYear(-250);
```

## Regnal Calendar Formulas
- **Vikram Samvat (VS)**: started 57 BCE (`year > 0 ? year + 57 : year + 58`)
- **Shaka Samvat**: started 78 CE (`year >= 78 ? year - 78 : null`)
- **Hijri (AH)**: Islamic lunar year from 622 CE (`year >= 622 ? Math.round((year - 622) * 1.0307) + 1 : null`)
- **Kollam Era / Malayalam Era (ME)**: started 825 CE (`year >= 825 ? year - 824 : null`)
