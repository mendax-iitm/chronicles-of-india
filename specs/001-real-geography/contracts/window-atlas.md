# Contract: `window.atlas` (must not change in Phase 1)

Shape: `window.atlas = { st, SN, PL, EV, JR, setYear, act }` (index.html, `window.atlas=` line).

Phase 1 guarantees:
- Same seven keys, same types. `SN` remains the snapshot array; after atom migration each polity's
  `atoms` lists **new** ids (expanded), which is the only observable difference.
- `setYear(y)` still accepts integer years, negative = BCE, and snaps to the snapshot in force.
- No new keys are added to `window.atlas` (new globals, if any, are `window.ATLAS_BASE` and
  `window.ATLAS_TERRAIN` — data only).

Checked by `scripts/smoke.mjs`: asserts the key set, then calls `setYear(s.from)` for every snapshot
and asserts zero console errors and every polity's atoms resolve in `ATOMS`.
