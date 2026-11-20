// Smoke check: every snapshot renders with a clean console at three viewports.
// Usage: node scripts/smoke.mjs [shot-prefix] [query]   (screenshots → .cache/shots/<prefix>-<w>-<from>.png)
// ponytail: no test framework; exits non-zero if any check fails.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const prefix = process.argv[2] || 'after';
const targetFile = process.env.TARGET || 'index.html';
const url = pathToFileURL(resolve(targetFile)).href + (process.argv[3] || '');
const out = resolve('.cache/shots');
mkdirSync(out, { recursive: true });

const VIEWPORTS = [[390, 844], [1024, 768], [1440, 900]];
const KEYS = ['JR', 'PL', 'EV', 'SN', 'act', 'setYear', 'st'];
const browser = await chromium.launch();
const errors = [];
let snaps = 0;

for (const [w, h] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  page.on('console', m => m.type() === 'error' && errors.push(`${w}px console: ${m.text()}`));
  page.on('pageerror', e => errors.push(`${w}px pageerror: ${e.message}`));
  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'load' });
  const loadMs = Date.now() - t0;

  const keys = await page.evaluate(() => Object.keys(window.atlas || {}).sort());
  if (keys.join() !== [...KEYS].sort().join()) errors.push(`${w}px window.atlas keys changed: ${keys}`);

  // Every polity atom must resolve (catches bad ATOM_MIGRATION / renamed atoms).
  const missing = await page.evaluate(() => {
    const out = [];
    for (const s of window.atlas.SN) for (const p of s.pol) for (const a of p.atoms)
      if (!(a in ATOMS)) out.push(`${s.from}:${p.n}:${a}`);
    return out;
  });
  if (missing.length) errors.push(`${w}px unresolved atoms: ${missing.join(', ')}`);

  const froms = await page.evaluate(() => window.atlas.SN.map(s => s.from));
  for (const y of froms) {
    await page.evaluate(y => window.atlas.setYear(y), y);
    await page.screenshot({ path: `${out}/${prefix}-${w}-${y}.png` });
    if (w === 1440) snaps++;
  }
  // Drag the slider end to end like a user would.
  await page.evaluate(() => {
    const r = document.querySelector('#yr');
    for (let y = +r.min; y <= +r.max; y += 7) { r.value = y; r.dispatchEvent(new Event('input')); }
  });
  console.log(`${w}px: load ${loadMs} ms`);
  await page.close();
}
await browser.close();

console.log(`${snaps}/${snaps} snapshots, ${errors.length} errors`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
