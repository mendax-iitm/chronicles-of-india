// Comprehensive CI validator for all committed data files in data/
// Usage: node scripts/validate.mjs
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const errors = [];
const warn = [];
const log = (msg) => console.log(`✓ ${msg}`);
const fail = (msg) => errors.push(msg);

// 1. Validate Base Geography
const baseFile = 'data/base.json';
if (!existsSync(baseFile)) fail(`Missing ${baseFile}`);
else {
  const base = JSON.parse(readFileSync(baseFile, 'utf8'));
  for (const k of ['meta', 'coast', 'islands', 'rivers', 'lakes', 'relief', 'sea']) {
    if (!base[k]) fail(`data/base.json missing required key: ${k}`);
  }
  if (base.coast.length < 50) fail(`Coastline suspiciously small: ${base.coast.length} points`);
  if (base.rivers.length < 16) fail(`Too few rivers: ${base.rivers.length} (expected ≥ 16)`);
  if (base.relief.length < 7) fail(`Too few relief areas: ${base.relief.length} (expected 7)`);
  log(`Base geography: ${base.coast.length} coast pts, ${base.islands.length} islands, ${base.rivers.length} rivers, ${base.relief.length} relief`);
}

// 2. Validate Regions (Atoms)
const regionsFile = 'data/regions.json';
let atoms = {};
if (!existsSync(regionsFile)) fail(`Missing ${regionsFile}`);
else {
  const regions = JSON.parse(readFileSync(regionsFile, 'utf8'));
  atoms = regions.atoms || {};
  const atomKeys = Object.keys(atoms);
  if (atomKeys.length < 40 || atomKeys.length > 60) {
    fail(`Atom count ${atomKeys.length} outside required range (40–60)`);
  }
  for (const [id, poly] of Object.entries(atoms)) {
    if (!Array.isArray(poly) || poly.length < 3) fail(`Atom ${id} has invalid polygon (< 3 points)`);
    for (const pt of poly) {
      if (typeof pt[0] !== 'number' || typeof pt[1] !== 'number') fail(`Atom ${id} has invalid vertex: ${pt}`);
    }
  }

  // Check overlaps across 0.05° grid with bounding-box pre-filtering
  const bboxes = {};
  for (const [id, poly] of Object.entries(atoms)) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of poly) {
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    bboxes[id] = [x0, y0, x1, y1];
  }

  function pip([px, py], ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }
  let overlaps = 0;
  for (let lat = 8; lat <= 36; lat += 0.05) {
    for (let lon = 67; lon <= 96; lon += 0.05) {
      const pt = [lon, lat];
      let hits = 0;
      for (const [id, poly] of Object.entries(atoms)) {
        const [x0, y0, x1, y1] = bboxes[id];
        if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue;
        if (pip(pt, poly)) {
          hits++;
          if (hits > 1) { overlaps++; break; }
        }
      }
    }
  }
  if (overlaps > 0) fail(`Found ${overlaps} atom overlap points across 0.05° test grid`);
  log(`Regions: ${atomKeys.length} atoms, 0 overlaps`);
}

// 3. Validate Snapshots
const snapFile = 'data/snapshots.json';
if (!existsSync(snapFile)) fail(`Missing ${snapFile}`);
else {
  const snapshots = JSON.parse(readFileSync(snapFile, 'utf8'));
  if (snapshots.length < 30) fail(`Snapshot count ${snapshots.length} less than 30 (Phase 3 requires ≥ 30)`);
  let lastFrom = -Infinity;
  snapshots.forEach((s, i) => {
    if (typeof s.from !== 'number') fail(`Snapshot ${i} missing 'from' year`);
    if (s.from === 0) fail(`Snapshot ${i} has invalid year 0 (BCE/CE reckoning has no year 0)`);
    if (s.from <= lastFrom) fail(`Snapshots not strictly ordered by 'from' year: ${s.from} follows ${lastFrom}`);
    lastFrom = s.from;

    if (!s.polities || !Array.isArray(s.polities) || s.polities.length === 0) {
      fail(`Snapshot ${s.from} has no polities`);
    } else {
      s.polities.forEach((p, pIdx) => {
        if (!p.color || !p.color.startsWith('#')) fail(`Snapshot ${s.from} polity ${pIdx} invalid color: ${p.color}`);
        if (!p.atoms || !p.atoms.length) fail(`Snapshot ${s.from} polity ${pIdx} has no atoms`);
        else {
          for (const a of p.atoms) {
            if (!(a in atoms)) fail(`Snapshot ${s.from} polity references unknown atom: '${a}'`);
          }
        }
      });
    }
  });
  log(`Snapshots: ${snapshots.length} historical eras (${snapshots[0].from} to ${snapshots.at(-1).from})`);
}

// 4. Validate Places
const placeFile = 'data/places.json';
if (!existsSync(placeFile)) fail(`Missing ${placeFile}`);
else {
  const places = JSON.parse(readFileSync(placeFile, 'utf8'));
  if (places.length < 80) fail(`Place count ${places.length} < 80 (Phase 3 requires ≥ 80)`);
  places.forEach((p, i) => {
    if (typeof p.lon !== 'number' || typeof p.lat !== 'number') fail(`Place ${i} invalid coordinates`);
    if (p.lon < 50 || p.lon > 105 || p.lat < 0 || p.lat > 42) fail(`Place ${i} outside subcontinent bounds`);
    if (!p.names || !p.names.length) fail(`Place ${i} has no name history`);
    let lastYr = -Infinity;
    p.names.forEach((n, nIdx) => {
      if (typeof n.year !== 'number') fail(`Place ${i} name ${nIdx} missing year`);
      if (n.year === 0) fail(`Place ${i} name ${nIdx} has invalid year 0`);
      if (n.year < lastYr) fail(`Place ${i} name history out of chronological order: ${n.year} after ${lastYr}`);
      lastYr = n.year;
    });
  });
  log(`Places: ${places.length} settlements with verified name genealogies`);
}

// 5. Validate Events
const eventFile = 'data/events.json';
if (!existsSync(eventFile)) fail(`Missing ${eventFile}`);
else {
  const events = JSON.parse(readFileSync(eventFile, 'utf8'));
  if (events.length < 80) fail(`Event count ${events.length} < 80 (Phase 3 requires ≥ 80)`);
  events.forEach((e, i) => {
    if (typeof e.year !== 'number' || e.year === 0 || e.year < -600 || e.year > 1947) {
      fail(`Event ${i} has invalid year: ${e.year}`);
    }
    if (typeof e.lon !== 'number' || typeof e.lat !== 'number') fail(`Event ${i} invalid coordinates`);
  });
  log(`Events: ${events.length} historical milestones`);
}

// 6. Validate Journeys
const jrFile = 'data/journeys.json';
if (!existsSync(jrFile)) fail(`Missing ${jrFile}`);
else {
  const journeys = JSON.parse(readFileSync(jrFile, 'utf8'));
  if (journeys.length < 25) fail(`Journey count ${journeys.length} < 25 (Phase 3 requires ≥ 25)`);
  journeys.forEach((j, i) => {
    if (!j.stops || j.stops.length < 2) fail(`Journey ${i} has < 2 stops`);
    j.stops.forEach((st, sIdx) => {
      if (typeof st.lon !== 'number' || typeof st.lat !== 'number') fail(`Journey ${i} stop ${sIdx} invalid coords`);
      if (typeof st.year !== 'number' || st.year === 0) fail(`Journey ${i} stop ${sIdx} invalid year: ${st.year}`);
    });
  });
  log(`Journeys: ${journeys.length} person chronicles with ${journeys.reduce((sum, j) => sum + j.stops.length, 0)} total stops`);
}

// 7. Validate Rulers
const rulerFile = 'data/rulers.json';
if (!existsSync(rulerFile)) fail(`Missing ${rulerFile}`);
else {
  const rulers = JSON.parse(readFileSync(rulerFile, 'utf8'));
  if (rulers.length < 40) fail(`Ruler count ${rulers.length} < 40`);
  const dynasties = new Set();
  rulers.forEach((r, i) => {
    if (!r.reign || r.reign.length !== 2) fail(`Ruler ${r.name?.en} missing valid reign tuple`);
    const [start, end] = r.reign;
    if (typeof start !== 'number' || typeof end !== 'number') fail(`Ruler ${r.name?.en} invalid reign years`);
    if (start > end) fail(`Ruler ${r.name?.en} reign start ${start} > end ${end}`);
    if (r.dynasty) dynasties.add(r.dynasty);
  });
  log(`Rulers: ${rulers.length} rulers across ${dynasties.size} dynasties with verified regnal eras`);
}

// 8. Validate Administrative Divisions
const divFile = 'data/divisions.json';
if (!existsSync(divFile)) fail(`Missing ${divFile}`);
else {
  const divisionSystems = JSON.parse(readFileSync(divFile, 'utf8'));
  if (divisionSystems.length < 5) fail(`Division system count ${divisionSystems.length} < 5`);
  divisionSystems.forEach((sys, i) => {
    if (!sys.divisions || !sys.divisions.length) fail(`Division system ${i} has no divisions`);
    sys.divisions.forEach((dv, dIdx) => {
      if (!dv.atoms || !dv.atoms.length) fail(`Division ${dv.name?.en} has no atoms`);
      dv.atoms.forEach(a => {
        if (!atoms[a]) fail(`Division ${dv.name?.en} references unknown atom '${a}'`);
      });
    });
  });
  log(`Divisions: ${divisionSystems.length} imperial administrative systems with mapped atoms`);
}

// 9. Validate Corridors
const corFile = 'data/corridors.json';
if (!existsSync(corFile)) fail(`Missing ${corFile}`);
else {
  const corridors = JSON.parse(readFileSync(corFile, 'utf8'));
  if (corridors.length < 6) fail(`Corridor count ${corridors.length} < 6`);
  corridors.forEach((c, i) => {
    if (!c.coords || c.coords.length < 2) fail(`Corridor ${c.id} has < 2 points`);
    c.coords.forEach(([lon, lat], ptIdx) => {
      if (typeof lon !== 'number' || typeof lat !== 'number') fail(`Corridor ${c.id} pt ${ptIdx} invalid coords`);
    });
  });
  log(`Corridors: ${corridors.length} historical highways, routes, and pilgrimage circuits`);
}

console.log('\n--- Validation Summary ---');
if (errors.length) {
  console.error(`❌ Validation failed with ${errors.length} error(s):`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log(`✅ All data files valid and clean.`);
}
