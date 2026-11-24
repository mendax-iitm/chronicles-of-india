// Build modern boundaries (international and internal states/provinces) for South Asia
// Output: data/modern.json, data/modern.js
import mapshaper from 'mapshaper';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const BBOX = [58, 5, 98, 38];
const TARGET_COUNTRIES = new Set(['IND', 'PAK', 'BGD', 'NPL', 'BTN', 'LKA']);

async function getShp(layer) {
  const dir = `.cache/ne/${layer}`;
  const file = `${dir}/${layer}.shp`;
  if (existsSync(file)) return file;
  mkdirSync(dir, { recursive: true });
  console.log(`Downloading ${layer}...`);
  const res = await fetch(`https://naciscdn.org/naturalearth/10m/cultural/${layer}.zip`);
  if (!res.ok) throw new Error(`download ${layer}: HTTP ${res.status}`);
  writeFileSync(`${dir}.zip`, Buffer.from(await res.arrayBuffer()));
  execFileSync('unzip', ['-oqj', `${dir}.zip`, '*.shp', '*.dbf', '*.shx', '*.prj', '-d', dir]);
  return file;
}

const r1 = v => Math.round(v * 10) / 10;
function cleanLine(pts) {
  const o = [];
  for (const [x, y] of pts) {
    const p = [r1(x), r1(y)], q = o[o.length - 1];
    if (!q || q[0] !== p[0] || q[1] !== p[1]) o.push(p);
  }
  return o.length >= 2 ? o : null;
}

function lineLen(pts) {
  let l = 0;
  for (let i = 1; i < pts.length; i++) l += Math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1]);
  return l;
}

function extractLines(geojson, minLen = 0.25) {
  const res = [];
  for (const f of geojson.features) {
    if (!f.geometry) continue;
    const geom = f.geometry;
    if (geom.type === 'LineString') {
      const c = cleanLine(geom.coordinates);
      if (c && lineLen(c) >= minLen) res.push(c);
    } else if (geom.type === 'MultiLineString') {
      for (const line of geom.coordinates) {
        const c = cleanLine(line);
        if (c && lineLen(c) >= minLen) res.push(c);
      }
    }
  }
  return res;
}

// 1. Admin 0 boundary lines (international borders)
const f0 = await getShp('ne_10m_admin_0_boundary_lines_land');
const out0 = await mapshaper.applyCommands(`-i ${f0} -clip bbox=${BBOX.join(',')} -simplify weighted 3% keep-shapes -o format=geojson precision=0.1 out.json`);
const g0 = JSON.parse(out0['out.json']);
const countryLines = extractLines(g0, 0.35);

// 2. Admin 1 states/provinces lines
const f1 = await getShp('ne_10m_admin_1_states_provinces_lines');
const out1 = await mapshaper.applyCommands(`-i ${f1} -clip bbox=${BBOX.join(',')} -simplify weighted 3% keep-shapes -o format=geojson precision=0.1 out.json`);
const g1 = JSON.parse(out1['out.json']);
const filteredAdmin1 = {
  ...g1,
  features: g1.features.filter(f => {
    const p = f.properties || {};
    return TARGET_COUNTRIES.has(p.ADM0_A3);
  })
};
const stateLines = extractLines(filteredAdmin1, 0.35);

// 3. Modern entity labels (states, key territories, neighbouring countries)
const MODERN_LABELS = [
  // Indian States & UTs
  { name: { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश' }, at: [79.9, 15.8], type: 'state' },
  { name: { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश' }, at: [94.5, 28.1], type: 'state' },
  { name: { en: 'Assam', hi: 'असम' }, at: [92.8, 26.2], type: 'state' },
  { name: { en: 'Bihar', hi: 'बिहार' }, at: [85.6, 25.7], type: 'state' },
  { name: { en: 'Chhattisgarh', hi: 'छत्तीसगढ़' }, at: [81.8, 21.3], type: 'state' },
  { name: { en: 'Goa', hi: 'गोवा' }, at: [74.0, 15.4], type: 'state' },
  { name: { en: 'Gujarat', hi: 'गुजरात' }, at: [71.5, 22.4], type: 'state' },
  { name: { en: 'Haryana', hi: 'हरियाणा' }, at: [76.3, 29.1], type: 'state' },
  { name: { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश' }, at: [77.2, 31.8], type: 'state' },
  { name: { en: 'Jharkhand', hi: 'झारखंड' }, at: [85.3, 23.6], type: 'state' },
  { name: { en: 'Karnataka', hi: 'कर्नाटक' }, at: [75.7, 14.8], type: 'state' },
  { name: { en: 'Kerala', hi: 'केरल' }, at: [76.5, 10.2], type: 'state' },
  { name: { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश' }, at: [77.4, 23.3], type: 'state' },
  { name: { en: 'Maharashtra', hi: 'महाराष्ट्र' }, at: [75.5, 19.3], type: 'state' },
  { name: { en: 'Manipur', hi: 'मणिपुर' }, at: [93.9, 24.8], type: 'state' },
  { name: { en: 'Meghalaya', hi: 'मेघालय' }, at: [91.3, 25.5], type: 'state' },
  { name: { en: 'Mizoram', hi: 'मिज़ोरम' }, at: [92.9, 23.2], type: 'state' },
  { name: { en: 'Nagaland', hi: 'नागालैंड' }, at: [94.3, 26.1], type: 'state' },
  { name: { en: 'Odisha', hi: 'ओडिशा' }, at: [84.4, 20.5], type: 'state' },
  { name: { en: 'Punjab', hi: 'पंजाब' }, at: [75.3, 30.9], type: 'state' },
  { name: { en: 'Rajasthan', hi: 'राजस्थान' }, at: [73.5, 26.6], type: 'state' },
  { name: { en: 'Sikkim', hi: 'सिक्किम' }, at: [88.5, 27.5], type: 'state' },
  { name: { en: 'Tamil Nadu', hi: 'तमिलनाडु' }, at: [78.4, 11.0], type: 'state' },
  { name: { en: 'Telangana', hi: 'तेलंगाना' }, at: [78.9, 17.9], type: 'state' },
  { name: { en: 'Tripura', hi: 'त्रिपुरा' }, at: [91.7, 23.8], type: 'state' },
  { name: { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश' }, at: [80.7, 27.0], type: 'state' },
  { name: { en: 'Uttarakhand', hi: 'उत्तराखंड' }, at: [79.2, 30.1], type: 'state' },
  { name: { en: 'West Bengal', hi: 'पश्चिम बंगाल' }, at: [87.9, 23.2], type: 'state' },
  { name: { en: 'Delhi', hi: 'दिल्ली' }, at: [77.1, 28.6], type: 'ut' },
  { name: { en: 'Jammu & Kashmir', hi: 'जम्मू और कश्मीर' }, at: [75.0, 33.7], type: 'ut' },
  { name: { en: 'Ladakh', hi: 'लद्दाख' }, at: [77.6, 34.2], type: 'ut' },
  // Neighbouring Sovereign Nations & Key Provinces
  { name: { en: 'Pakistan', hi: 'पाकिस्तान' }, at: [68.8, 29.8], type: 'country' },
  { name: { en: 'Bangladesh', hi: 'बांग्लादेश' }, at: [89.9, 23.7], type: 'country' },
  { name: { en: 'Nepal', hi: 'नेपाल' }, at: [84.1, 28.4], type: 'country' },
  { name: { en: 'Bhutan', hi: 'भूटान' }, at: [90.4, 27.5], type: 'country' },
  { name: { en: 'Sri Lanka', hi: 'श्रीलंका' }, at: [80.7, 7.8], type: 'country' }
];

const modernData = {
  meta: {
    description: 'Modern administrative and international boundaries of South Asia for X-Ray lens',
    source: 'Natural Earth 10m Admin-0 and Admin-1'
  },
  countryLines,
  stateLines,
  labels: MODERN_LABELS
};

const jsonStr = JSON.stringify(modernData);
writeFileSync('data/modern.json', jsonStr + '\n');
writeFileSync('data/modern.js', `window.ATLAS_MODERN=${jsonStr};\n`);

console.log(`✓ Generated data/modern.json and data/modern.js: ${countryLines.length} country lines, ${stateLines.length} state lines, ${MODERN_LABELS.length} labels (${(jsonStr.length / 1024).toFixed(1)} KB)`);
