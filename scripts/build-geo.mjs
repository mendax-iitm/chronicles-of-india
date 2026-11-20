// Natural Earth 10m → data/base.json + data/base.js  (schema: docs/DATA-MODEL.md, base.json section)
// Run from anywhere: `npm run build:geo`. Output is committed; viewers never run this.
// Determinism: pinned mapshaper, no timestamps, sorted arrays → byte-identical reruns.
import mapshaper from 'mapshaper';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const NE_VERSION = '5.1.1';
const BBOX = [56, 3, 102, 40];      // covers the whole map frame (lon 58–100, lat 4–39) so no clip edge shows
const SIMPLIFY = '10%';          // share of removable vertices kept (mapshaper weighted). Tuned by eye at max zoom.
const MIN_ISLAND = 0.003;        // deg² (~35 km²); smaller unnamed islets are dropped
const LAYERS = {
  land: 'physical/ne_10m_land',
  minor: 'physical/ne_10m_minor_islands',
  rivers: 'physical/ne_10m_rivers_lake_centerlines',
  lakes: 'physical/ne_10m_lakes',
  regions: 'physical/ne_10m_geography_regions_polys',
};
// Island groups named by centroid box [lon0, lat0, lon1, lat1]. Unmatched islands get "".
const ISLAND_GROUPS = [
  ['Sri Lanka', [79.4, 5.8, 82.1, 10]],
  ['Andaman Islands', [92, 10.4, 94, 14]],
  ['Nicobar Islands', [92.5, 6.5, 94.5, 9.5]],
  ['Lakshadweep', [71.5, 8, 74, 12.5]],
];
const REQUIRED_ISLANDS = ['Sri Lanka', 'Andaman Islands', 'Nicobar Islands', 'Lakshadweep'];
// Natural lakes only, matched by centroid. NE's other named "lakes" in India are post-1947 reservoirs.
const LAKES = [['Wular', 74.57, 34.37]];
// NE region name → display name. All seven are required (FR-007).
const RELIEF = {
  'HIMALAYAS': 'Himalaya', 'WESTERN GHATS': 'Western Ghats', 'EASTERN GHATS': 'Eastern Ghats',
  'Vindhya Range': 'Vindhya', 'Satpura Range': 'Satpura', 'Arvalli Ra.': 'Aravalli', 'THAR DESERT': 'Thar',
};
const SEA = [
  ['Arabian Sea', 66, 15], ['Bay of Bengal', 88, 13], ['Indian Ocean', 81, 5.4],
  ['Gulf of Mannar', 79, 8.6], ['Andaman Sea', 96, 11],
];

// ---------- download + unzip into .cache/ne/<layer>/ ----------
async function shp(path) {
  const name = path.split('/')[1], dir = `.cache/ne/${name}`, file = `${dir}/${name}.shp`;
  if (existsSync(file)) return file;
  mkdirSync('.cache/ne', { recursive: true });
  const res = await fetch(`https://naciscdn.org/naturalearth/10m/${path}.zip`);
  if (!res.ok) throw new Error(`download ${name}: HTTP ${res.status}`);
  writeFileSync(`${dir}.zip`, Buffer.from(await res.arrayBuffer()));
  execFileSync('unzip', ['-oqj', `${dir}.zip`, '*.shp', '*.dbf', '*.shx', '*.prj', '-d', dir]);
  return file;
}

async function features(key, cmds = '') {
  const out = await mapshaper.applyCommands(
    `-i ${await shp(LAYERS[key])} -clip bbox=${BBOX} ${cmds} -o format=geojson precision=0.0001 out.json`);
  return JSON.parse(out['out.json']).features.filter(f => f.geometry);
}

// ---------- geometry helpers ----------
const r2 = v => Math.round(v * 100) / 100;
function clean(pts, closed) {                       // round to 2 dp, drop repeats (and GeoJSON closing point)
  const o = [];
  for (const [x, y] of pts) {
    const p = [r2(x), r2(y)], q = o[o.length - 1];
    if (!q || q[0] !== p[0] || q[1] !== p[1]) o.push(p);
  }
  if (closed && o.length > 1 && o[0][0] === o.at(-1)[0] && o[0][1] === o.at(-1)[1]) o.pop();
  return o.length >= (closed ? 3 : 2) ? o : null;
}
const area = r => Math.abs(r.reduce((s, [x, y], i) => { const [u, v] = r[(i + 1) % r.length]; return s + x * v - u * y; }, 0) / 2);
const centroid = r => r.reduce((a, p) => [a[0] + p[0] / r.length, a[1] + p[1] / r.length], [0, 0]);
const outerRings = f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).map(p => p[0]);
const lines = f => f.geometry.type === 'LineString' ? [f.geometry.coordinates] : f.geometry.coordinates;
const inBox = ([x, y], [a, b, c, d]) => x >= a && x <= c && y >= b && y <= d;
const byName = (a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

// ---------- layers ----------
// -explode first: keep-shapes only protects one ring per feature, so multipart island groups lose atolls.
const simp = `-explode -simplify weighted ${SIMPLIFY} keep-shapes`;

// ponytail: atolls (Lakshadweep) collapse below 3 points at 2 dp; named ones become a ~2 km diamond
// at their centroid, which is honest at our 1 km precision. Unnamed collapsed islets are dropped.
const diamond = ([x, y]) => [[r2(x), r2(y + 0.01)], [r2(x + 0.01), r2(y)], [r2(x), r2(y - 0.01)], [r2(x - 0.01), r2(y)]];
const groupOf = c => (ISLAND_GROUPS.find(([, box]) => inBox(c, box)) || [''])[0];
const rawRings = [...await features('land', simp), ...await features('minor', simp)].flatMap(outerRings);
const landRings = rawRings.map(r => {
  const c = centroid(r), name = groupOf(c);
  return { name, poly: clean(r, true) || (name ? diamond(c) : null) };
}).filter(i => i.poly);
const mainIdx = landRings.reduce((m, r, i) => (area(r.poly) > area(landRings[m].poly) ? i : m), 0);
const coast = landRings[mainIdx].poly;
const islands = landRings.filter((_, i) => i !== mainIdx)
  .filter(i => i.name || area(i.poly) >= MIN_ISLAND).sort(byName);   // stable sort keeps NE order within a name

const labels = JSON.parse(readFileSync('data/river-labels.json', 'utf8'));
const riverMap = new Map();
for (const f of await features('rivers', simp)) {
  const l = labels[f.properties.name];
  if (!l) continue;
  const r = riverMap.get(l.name) || { name: l.name, rank: l.rank, line: [], label: null };
  r.label ||= l.label || null;
  r.line.push(...lines(f).map(s => clean(s, false)).filter(Boolean));
  riverMap.set(l.name, r);
}
const rivers = [...riverMap.values()].sort(byName);

const lakeFeats = (await features('lakes', simp)).filter(f => f.properties.featurecla === 'Lake');
const lakes = LAKES.map(([name, x, y]) => {
  const f = lakeFeats.find(f => outerRings(f).some(r => { const [cx, cy] = centroid(r); return Math.hypot(cx - x, cy - y) < 0.3; }));
  return f && { name, poly: clean(outerRings(f)[0], true) };
}).filter(Boolean).sort(byName);

const relief = (await features('regions', simp))
  .filter(f => RELIEF[f.properties.NAME])
  .flatMap(f => outerRings(f).map(r => ({ name: RELIEF[f.properties.NAME], poly: clean(r, true), source: 'ne' })))
  .filter(r => r.poly).sort(byName);

const sea = SEA.map(([name, x, y]) => ({ name, at: [x, y] }));

// ---------- validate (fail loudly) ----------
const fail = m => { console.error(`build-geo: ${m}`); process.exit(1); };
const allPts = [coast, ...islands.map(i => i.poly), ...rivers.flatMap(r => r.line), ...lakes.map(l => l.poly), ...relief.map(r => r.poly)].flat();
for (const [x, y] of allPts) {
  if (!inBox([x, y], BBOX)) fail(`point outside bbox: ${x},${y}`);
  if (r2(x) !== x || r2(y) !== y) fail(`more than 2 dp: ${x},${y}`);
}
for (const n of REQUIRED_ISLANDS) if (!islands.some(i => i.name === n)) fail(`missing island group ${n}`);
if (rivers.length < 16) fail(`only ${rivers.length} rivers`);
for (const r of rivers) if (!r.label) fail(`river ${r.name} has no label point`);
for (const n of new Set(Object.values(RELIEF))) if (!relief.some(r => r.name === n)) fail(`missing relief ${n}`);
const missingRivers = Object.keys(labels).filter(k => k !== '_doc' && !rivers.some(r => r.name === labels[k].name));
if (missingRivers.length) fail(`listed rivers not found in NE: ${missingRivers}`);

// ---------- write ----------
const base = {
  meta: { generator: 'scripts/build-geo.mjs', ne_version: NE_VERSION, simplify: SIMPLIFY, bbox: BBOX },
  coast, islands, rivers, lakes, relief, sea,
};
const json = JSON.stringify(base);
writeFileSync('data/base.json', json + '\n');
writeFileSync('data/base.js', `window.ATLAS_BASE=${json};\n`);
console.log(`coast ${coast.length} pts · islands ${islands.length} · rivers ${rivers.length} · lakes ${lakes.length} · relief ${relief.length} · ${(json.length / 1024).toFixed(0)} KB`);
