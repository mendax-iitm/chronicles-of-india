// Terrain hillshade: AWS Terrain Tiles (Terrarium PNG, zoom 7) → data/terrain/r{r}c{c}.jpg + manifest.
// Usage: npm run build:terrain [-- --proj lcc]     (default projection: equirect, matching index.html)
// Sources over South Asia at z7: SRTM (land) + ETOPO1 (sea), both US-government public domain.
// Output is a greyscale multiply layer: flat ground = white, shaded slopes darker.
// ponytail: the projection maths duplicates index.html's XY/LCC; if those constants change, change these too.
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const PROJ = process.argv.includes('--proj') ? process.argv[process.argv.indexOf('--proj') + 1] : 'equirect';
if (!['equirect', 'lcc'].includes(PROJ)) throw new Error(`unknown --proj ${PROJ}`);
const Z = 7, PX_PER_UNIT = 4;                 // 1 SVG unit ≈ 5 km, so 4 px/unit ≈ 1.25 km/px
const EXTENT = [-40, -20, 900, 790];          // SVG units: covers the 860×770 frame plus pan margin
const ROWS = 4, COLS = 4, QUALITY = 60;
const EXAGGERATE = 2.5, AZ = 315, ALT = 45;   // tuned by eye
const TILE_URL = (z, x, y) => `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${z}/${x}/${y}.png`;

// ---------- page projection (keep in sync with index.html) ----------
const K = 22, XF = 0.93, r = Math.PI / 180;
const t = f => Math.tan(Math.PI / 4 + f * r / 2);
const n = Math.log(Math.cos(15 * r) / Math.cos(31 * r)) / Math.log(t(31) / t(15));
const F = Math.cos(15 * r) * t(15) ** n / n, r0 = F / t(23) ** n, S = K / r, X0 = (80 - 58) * K * XF, Y0 = (39 - 23) * K;
const inv = PROJ === 'lcc'
  ? (x, y) => { const a = (x - X0) / S, b = r0 - (Y0 - y) / S, p = Math.hypot(a, b); return [80 + Math.atan2(a, b) / n / r, (2 * Math.atan((F / p) ** (1 / n)) - Math.PI / 2) / r]; }
  : (x, y) => [x / (K * XF) + 58, 39 - y / K];

// ---------- fetch tiles covering the extent ----------
const corners = [];
for (let x = EXTENT[0]; x <= EXTENT[2]; x += 20) for (let y = EXTENT[1]; y <= EXTENT[3]; y += 20) corners.push(inv(x, y));
const lonMin = Math.min(...corners.map(c => c[0])), lonMax = Math.max(...corners.map(c => c[0]));
const latMin = Math.min(...corners.map(c => c[1])), latMax = Math.max(...corners.map(c => c[1]));
const N2 = 2 ** Z;
const tx = lon => (lon + 180) / 360 * N2;
const ty = lat => (1 - Math.log(Math.tan(lat * r) + 1 / Math.cos(lat * r)) / Math.PI) / 2 * N2;
const x0 = Math.floor(tx(lonMin)), x1 = Math.floor(tx(lonMax)), y0 = Math.floor(ty(latMax)), y1 = Math.floor(ty(latMin));
const W = (x1 - x0 + 1) * 256, H = (y1 - y0 + 1) * 256;
const dem = new Float32Array(W * H);
const jobs = [];
for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) jobs.push([x, y]);
console.log(`${jobs.length} tiles z${Z} x${x0}–${x1} y${y0}–${y1} → mosaic ${W}×${H}`);

async function tile([x, y]) {
  const file = `.cache/terrain/${Z}/${x}/${y}.png`;
  if (!existsSync(file)) {
    let buf;
    for (let attempt = 1; !buf; attempt++) {           // S3 drops some parallel sockets; retry a few times
      try {
        const res = await fetch(TILE_URL(Z, x, y));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        buf = Buffer.from(await res.arrayBuffer());
      } catch (e) {
        if (attempt >= 4) throw new Error(`tile ${Z}/${x}/${y}: ${e.message}`);
        await new Promise(ok => setTimeout(ok, 500 * attempt));
      }
    }
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, buf);
  }
  const png = PNG.sync.read(readFileSync(file));
  const ox = (x - x0) * 256, oy = (y - y0) * 256;
  for (let j = 0; j < 256; j++) for (let i = 0; i < 256; i++) {
    const k = (j * 256 + i) * 4, d = png.data;
    dem[(oy + j) * W + ox + i] = d[k] * 256 + d[k + 1] + d[k + 2] / 256 - 32768;   // Terrarium decoding
  }
}
for (let i = 0; i < jobs.length; i += 8) await Promise.all(jobs.slice(i, i + 8).map(tile));

// bilinear elevation sample at lon/lat
function elev(lon, lat) {
  const fx = (tx(lon) - x0) * 256 - 0.5, fy = (ty(lat) - y0) * 256 - 0.5;
  const i = Math.max(0, Math.min(W - 2, Math.floor(fx))), j = Math.max(0, Math.min(H - 2, Math.floor(fy)));
  const u = Math.min(1, Math.max(0, fx - i)), v = Math.min(1, Math.max(0, fy - j));
  const a = dem[j * W + i], b = dem[j * W + i + 1], c = dem[(j + 1) * W + i], d = dem[(j + 1) * W + i + 1];
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

// ---------- resample into SVG space, then Horn hillshade ----------
const OW = (EXTENT[2] - EXTENT[0]) * PX_PER_UNIT, OH = (EXTENT[3] - EXTENT[1]) * PX_PER_UNIT;
const grid = new Float32Array(OW * OH), latOf = new Float32Array(OW * OH);
for (let j = 0; j < OH; j++) for (let i = 0; i < OW; i++) {
  const [lon, lat] = inv(EXTENT[0] + (i + 0.5) / PX_PER_UNIT, EXTENT[1] + (j + 0.5) / PX_PER_UNIT);
  grid[j * OW + i] = Math.max(0, elev(lon, lat));      // sea floor flattened: the map clips to land anyway
  latOf[j * OW + i] = lat;
}
const kmPerUnitY = 111.32 / K;                          // 1 SVG unit north–south
const zen = (90 - ALT) * r, az = (360 - AZ + 90) * r, flat = Math.cos(zen);
const rgba = new Uint8Array(OW * OH * 4);
for (let j = 0; j < OH; j++) for (let i = 0; i < OW; i++) {
  const g = (a, b) => grid[Math.min(OH - 1, Math.max(0, j + b)) * OW + Math.min(OW - 1, Math.max(0, i + a))];
  const lat = latOf[j * OW + i];
  const dy = kmPerUnitY * 1000 / PX_PER_UNIT;
  const dx = PROJ === 'lcc' ? dy : dy * Math.cos(lat * r) / XF;   // conic is conformal; equirect squeezes x by cos(lat)/0.93
  const dzdx = ((g(1, -1) + 2 * g(1, 0) + g(1, 1)) - (g(-1, -1) + 2 * g(-1, 0) + g(-1, 1))) / (8 * dx);
  const dzdy = ((g(-1, 1) + 2 * g(0, 1) + g(1, 1)) - (g(-1, -1) + 2 * g(0, -1) + g(1, -1))) / (8 * dy);
  const slope = Math.atan(EXAGGERATE * Math.hypot(dzdx, dzdy));
  const aspect = Math.atan2(-dzdy, -dzdx);              // image rows run south, so flip y
  const shade = Math.cos(zen) * Math.cos(slope) + Math.sin(zen) * Math.sin(slope) * Math.cos(az - aspect);
  const v = Math.max(0, Math.min(255, Math.round(255 * shade / flat)));
  const k = (j * OW + i) * 4;
  rgba[k] = rgba[k + 1] = rgba[k + 2] = v; rgba[k + 3] = 255;
}

// ---------- write tiles + manifest ----------
mkdirSync('data/terrain', { recursive: true });
const tw = Math.ceil(OW / COLS), th = Math.ceil(OH / ROWS);
let bytes = 0;
for (let rr = 0; rr < ROWS; rr++) for (let cc = 0; cc < COLS; cc++) {
  const w = Math.min(tw, OW - cc * tw), h = Math.min(th, OH - rr * th), buf = new Uint8Array(w * h * 4);
  for (let j = 0; j < h; j++) buf.set(rgba.subarray(((rr * th + j) * OW + cc * tw) * 4, ((rr * th + j) * OW + cc * tw + w) * 4), j * w * 4);
  const jpg = jpeg.encode({ data: buf, width: w, height: h }, QUALITY).data;
  writeFileSync(`data/terrain/r${rr}c${cc}.jpg`, jpg); bytes += jpg.length;
}
const manifest = { projection: PROJ, extent: EXTENT, rows: ROWS, cols: COLS, tile: 'r{r}c{c}.jpg',
  source: 'aws-terrain-tiles-z7 (SRTM, ETOPO1; public domain)', px_per_unit: PX_PER_UNIT };
writeFileSync('data/terrain/manifest.json', JSON.stringify(manifest) + '\n');
writeFileSync('data/terrain/manifest.js', `window.ATLAS_TERRAIN=${JSON.stringify(manifest)};\n`);
console.log(`${PROJ}: ${OW}×${OH} px in ${ROWS * COLS} tiles, ${(bytes / 1024).toFixed(0)} KB`);
