# Data model

Read this before editing anything under `data/`. The validation script
(`scripts/validate.mjs`, Phase 2) enforces most of these rules in CI.

## Conventions

- **Years are integers. Negative means BCE. There is no year 0.** `-1` is 1 BCE,
  `1` is 1 CE. Any value of `0` is a bug.
- **Coordinates are `[lon, lat]` in decimal degrees, WGS 84.** Longitude first —
  the GeoJSON order, not the "lat, long" order people speak in.
- Ids are lowercase kebab-case ASCII: `pataliputra`, `delhi-sultanate`, `xuanzang`.
- Region ids ("atoms") are UPPER_SNAKE_CASE: `MAGADHA`, `PUNJAB_W`.
- Every object that asserts a historical fact carries a `sources` array of citation
  keys that must resolve to an entry in `SOURCES.md`.

## `regions.json` — the reusable geometry

An **atom** is a chunk of land that changes hands as a unit. Polities are built by
listing the atoms they hold, so the same geometry is reused across all eras. This keeps
the file small and makes borders consistent between eras — which is what makes the
ghost-border diff meaningful.

```jsonc
{
  "MAGADHA": {
    "label": "Magadha / south Bihar",
    "poly": [[83.5,25.3],[84.5,26.5], ...]     // closed ring, lon/lat
  }
}
```

Rules:
- Coastal atoms should **overshoot into the sea**. The renderer clips every polity to
  the coastline, so overshooting guarantees no white slivers along the coast.
- Atoms must not overlap on land. Gaps are acceptable (they render as unclaimed land)
  and are often historically honest.
- Keep atom count manageable (40–60 after Phase 1). Each one you add has to be drawn once
  and then pays for itself across 30 eras.

## `eras.json`

```jsonc
[{
  "from": -261,
  "title": "Ashoka's Maurya Empire",
  "rep": "c. 261 BCE",
  "sum": "Two to four sentences, plain English, no jargon.",
  "sources": ["ncert-ancient-ch8"],
  "pol": [{
    "n": "Maurya Empire",
    "c": "#e76f51",
    "atoms": ["MAGADHA","DOAB","KALINGA"],
    "t": "One line shown when the polity is selected.",
    "capital": "pataliputra"
  }]
}]
```

Rules:
- The array is sorted by `from` ascending. `to` is **computed** as the next era's
  `from - 1`; never store it.
- `rep` is the year the geometry actually depicts. An era spanning 1450–1579 whose
  geometry shows c. 1500 must say so — honesty about the snapshot matters.
- Order `pol` by importance, not alphabetically. The panel renders in this order.
- Colours: keep a polity's colour **stable across eras** where it is the same power
  (the Mughals are always `#2a9d8f`). This is what lets the eye track continuity.
  Never rely on colour alone to convey meaning — labels do the work.

## `places.json`

```jsonc
[{
  "id": "pataliputra",
  "lon": 85.14, "lat": 25.61,
  "n": [
    [-490, "Pataliputra", "Founded as a fort by Udayin…"],
    [1541, "Patna", "Sher Shah Suri rebuilds the city; the name Patna comes into use."]
  ],
  "sources": ["…"]
}]
```

Rules:
- `n` is **chronological ascending**. Entry `[year, name, note]` means: *from this year
  onward the place is called this.* Before the first entry's year, the place does not
  appear on the map at all.
- A place that is abandoned gets an entry like `[450, "Taxila (ruins)", "Declines after…"]`.
  Do not delete it — the ruin is part of the story.
- Use the name as used **at that time**, transliterated. The modern name appears later
  in the chain.

## `events.json`

```jsonc
[{ "y": 1526, "lon": 76.97, "lat": 29.39,
   "t": "First Battle of Panipat",
   "d": "Babur defeats Ibrahim Lodi, founding the Mughal empire.",
   "sources": ["…"] }]
```

`t` is a headline (under 45 characters). `d` is one or two sentences. Events render as ◆
markers within ±30 years of the current year.

## `journeys.json`

```jsonc
[{
  "id": "xuanzang",
  "n": "Xuanzang's journey",
  "who": "Xuanzang, Chinese monk and scholar",
  "yrs": "630–643 CE",
  "d": "One or two sentences of context.",
  "s": [["Peshawar", 71.6, 34, 630, "Enters the subcontinent."]]
}]
```

Stops are `[name, lon, lat, year, note]`, in travel order. A stop lights up once the
timeline reaches its year. Where a date is uncertain, use the conventional one and say so
in the note.

## `base.json` (Phase 1)

```jsonc
{
  "coast":  [[lon,lat], ...],          // one simplified ring for the mainland
  "islands": [{"name":"Sri Lanka","poly":[...]}, ...],
  "rivers": [{"name":"Ganga","rank":1,"line":[[lon,lat],...],"label":[lon,lat]}],
  "relief": [{"name":"Himalaya","poly":[...]}],
  "sea":    [{"name":"Bay of Bengal","at":[lon,lat]}]
}
```

`rank` 1 = major river (thicker stroke), 0 = secondary. `label` is where the river name
is drawn, chosen by hand because automatic placement along a polyline looks bad.

## Precision budget

Coordinates are stored to **2 decimal places** (about 1 km). More is wasted bytes at the
zoom levels this atlas supports. The build script should round on output.
