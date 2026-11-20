// Atom check: 40–60 atoms, and no point of land inside two atoms.
// Usage: npm run check
// ponytail: grid sampling at 0.05° (~5 km); misses slivers thinner than that. Shared-node borders
// (scripts/build-atoms.mjs) make real slivers unlikely; upgrade to exact polygon intersection if one shows.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

let atoms;
if (existsSync('data/regions.json')) {
  atoms = JSON.parse(readFileSync('data/regions.json', 'utf8')).atoms;
} else {
  const html = readFileSync('index.html', 'utf8');
  const m = html.match(/const ATOMS=(\{.*?\});\n/);
  if (!m) { console.error('check-atoms: ATOMS block not found in index.html or data/regions.json'); process.exit(1); }
  atoms = JSON.parse(m[1]);
}
const base = JSON.parse(readFileSync('data/base.json', 'utf8'));
const land = [base.coast, ...base.islands.map(i => i.poly)];

const bbox = r => r.reduce((b, [x, y]) => [Math.min(b[0], x), Math.min(b[1], y), Math.max(b[2], x), Math.max(b[3], y)], [Infinity, Infinity, -Infinity, -Infinity]);
const withBox = r => ({ r, b: bbox(r) });
function inside([x, y], { r, b }) {
  if (x < b[0] || x > b[2] || y < b[1] || y > b[3]) return false;
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

const ids = Object.keys(atoms), A = ids.map(k => withBox(atoms[k])), L = land.map(withBox);
const overlaps = new Map();
for (let x = 58; x <= 100; x += 0.05) for (let y = 4; y <= 39; y += 0.05) {
  const p = [x, y];
  const hits = A.flatMap((a, i) => (inside(p, a) ? [i] : []));
  if (hits.length < 2 || !L.some(l => inside(p, l))) continue;
  const key = hits.map(i => ids[i]).join(' × ');
  overlaps.set(key, (overlaps.get(key) || 0) + 1);
}

const n = ids.length, okCount = n >= 40 && n <= 60;
console.log(`${n} atoms${okCount ? '' : ' (expected 40–60)'} · ${overlaps.size} overlaps`);
for (const [k, c] of overlaps) console.log(`  overlap ${k}: ${c} samples`);
if (!okCount || overlaps.size) process.exit(1);
