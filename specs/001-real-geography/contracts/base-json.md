# Contract: `data/base.json` and `data/base.js`

**Producer**: `scripts/build-geo.mjs`. **Consumers**: `index.html` (Phase 1), `scripts/export-geojson.mjs`
and `scripts/validate.mjs` (Phase 2), MCP server and CLI (Phase 6).

## Shape

Exactly the `BaseGeography` table in [../data-model.md](../data-model.md). Additive changes
(new optional fields, new array entries) are non-breaking. Renaming/removing a field, changing
coordinate order or precision, or changing `coast` from one ring is breaking and needs a
`docs/DATA-MODEL.md` update in the same commit.

## `data/base.js`

Byte form: `window.ATLAS_BASE=` + the exact minified contents of `base.json` + `;\n`. Nothing else.
Loaded with a plain `<script src="data/base.js"></script>` before the app script.

## Page behaviour

- If `window.ATLAS_BASE` is missing, the page logs one clear error and shows "Base map failed to
  load" in the disclaimer area rather than throwing repeatedly.
- `coast` → `#clipPoly` and `#land`; `islands` → land polygons and the same clip path; rivers drawn
  with stroke width by `rank`; lakes filled with water colour; relief under polities, above hillshade.

## Determinism

Same inputs + same pinned tool versions ⇒ byte-identical `base.json` (SC-008). Arrays sorted by
`name`; keys in schema order; numbers via `Math.round(v*100)/100`.
