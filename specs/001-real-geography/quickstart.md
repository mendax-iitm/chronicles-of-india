# Quickstart: validate Phase 1

## View (no tooling)

```bash
open index.html                 # must work from file://, offline
```

## Regenerate data (contributors who change geography only)

```bash
npm install                     # dev deps only: mapshaper, pngjs, jpeg-js, playwright
npm run build:geo               # → data/base.json, data/base.js
npm run build:terrain           # → data/terrain/*
git diff --stat data/           # rerun with no input change ⇒ empty diff (SC-008)
```

## Checks after every change

```bash
npm run check                   # check-atoms: 40–60 atoms, zero land overlaps
npm run smoke                   # every snapshot, zero console errors, window.atlas shape,
                                # screenshots → .cache/shots/{390,1024,1440}-<snapshot>.png
du -ch index.html data/base.js | tail -1   # < 800 KB preferred, < 2 MB hard (terrain excluded)
```

Expected: `check` prints atom count and `0 overlaps`; `smoke` prints `18/18 snapshots, 0 errors`.

## Manual scenarios

1. **US1**: compare coastline against a public-domain reference map; Sri Lanka, Andamans,
   Lakshadweep visible; 16+ river labels; no colour in the sea at 261 BCE, 1526, 1947.
2. **US2**: `open 'index.html?debug=atoms'` → atom outlines + ids; compare 261 BCE / 1526 / 1947
   against `.cache/shots/before-*.png` taken before the redraw.
3. **US3**: DevTools → Network → "Slow 3G"; slider usable before any `data/terrain/*.jpg`
   request completes; block `data/terrain/*` → map still clean, console clean.
4. **US4**: `open scripts/proj-prototype.html` → both projections side by side; read
   `docs/PROJECTION.md`.
