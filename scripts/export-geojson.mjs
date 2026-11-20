// Export all historical atlas data to RFC 7946 compliant GeoJSON
// Usage: node scripts/export-geojson.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

mkdirSync('geojson/snapshots', { recursive: true });

const base = JSON.parse(readFileSync('data/base.json', 'utf8'));
const regions = JSON.parse(readFileSync('data/regions.json', 'utf8'));
const snapshots = JSON.parse(readFileSync('data/snapshots.json', 'utf8'));
const places = JSON.parse(readFileSync('data/places.json', 'utf8'));
const events = JSON.parse(readFileSync('data/events.json', 'utf8'));
const journeys = JSON.parse(readFileSync('data/journeys.json', 'utf8'));

const ATOMS = regions.atoms;

// RFC 7946 requires polygon rings to be closed (first coordinate equals last coordinate)
function closeRing(ring) {
  const r = ring.map(p => [Math.round(p[0] * 10000) / 10000, Math.round(p[1] * 10000) / 10000]);
  if (r.length < 3) return r;
  const first = r[0], last = r[r.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    r.push([first[0], first[1]]);
  }
  return r;
}

// 1. Export Snapshots
const snapIndex = [];
snapshots.forEach(s => {
  const features = (s.polities || []).map(p => {
    const polys = (p.atoms || []).map(k => ATOMS[k]).filter(Boolean).map(poly => [closeRing(poly)]);
    return {
      type: 'Feature',
      properties: {
        name: p.name.en || p.name,
        name_hi: p.name.hi || '',
        color: p.color,
        note: p.note ? (p.note.en || p.note) : '',
        era: s.title.en || s.title,
        year: s.from,
        atoms: p.atoms
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: polys
      }
    };
  });

  const fc = {
    type: 'FeatureCollection',
    properties: {
      id: s.id,
      from: s.from,
      to: s.to,
      title: s.title.en || s.title,
      title_hi: s.title.hi || '',
      representative: s.representative.en || s.representative,
      summary: s.summary.en || s.summary
    },
    features
  };

  const filename = `geojson/snapshots/${s.id}.geojson`;
  writeFileSync(filename, JSON.stringify(fc, null, 2) + '\n');
  snapIndex.push({
    id: s.id,
    from: s.from,
    to: s.to,
    title: s.title.en || s.title,
    path: `snapshots/${s.id}.geojson`,
    polityCount: features.length
  });
});

writeFileSync('geojson/index.json', JSON.stringify(snapIndex, null, 2) + '\n');

// 2. Export Places
const placeFeatures = places.map(p => ({
  type: 'Feature',
  properties: {
    id: p.id,
    names: p.names.map(n => ({
      year: n.year,
      name: n.name.en || n.name,
      name_hi: n.name.hi || '',
      note: n.note ? (n.note.en || n.note) : ''
    }))
  },
  geometry: {
    type: 'Point',
    coordinates: [p.lon, p.lat]
  }
}));

writeFileSync('geojson/places.geojson', JSON.stringify({
  type: 'FeatureCollection',
  features: placeFeatures
}, null, 2) + '\n');

// 3. Export Events
const eventFeatures = events.map(e => ({
  type: 'Feature',
  properties: {
    id: e.id,
    year: e.year,
    title: e.title.en || e.title,
    title_hi: e.title.hi || '',
    description: e.description ? (e.description.en || e.description) : ''
  },
  geometry: {
    type: 'Point',
    coordinates: [e.lon, e.lat]
  }
}));

writeFileSync('geojson/events.geojson', JSON.stringify({
  type: 'FeatureCollection',
  features: eventFeatures
}, null, 2) + '\n');

// 4. Export Rivers
const riverFeatures = base.rivers.map(r => ({
  type: 'Feature',
  properties: {
    name: r.name,
    rank: r.rank,
    label: r.label
  },
  geometry: {
    type: 'MultiLineString',
    coordinates: r.line.map(seg => seg.map(p => [p[0], p[1]]))
  }
}));

writeFileSync('geojson/rivers.geojson', JSON.stringify({
  type: 'FeatureCollection',
  features: riverFeatures
}, null, 2) + '\n');

// 5. Point-lookup helper module
const lookupHelper = `// Point-lookup helper for exported GeoJSON
// Usage in Node or Browser: locatePoint(lon, lat, snapshotGeoJSON)
function pip([px, py], ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

export function locatePolity(lon, lat, snapshot) {
  for (const feature of snapshot.features) {
    if (feature.geometry.type === 'MultiPolygon') {
      for (const poly of feature.geometry.coordinates) {
        if (pip([lon, lat], poly[0])) return feature.properties;
      }
    }
  }
  return null;
}
`;
writeFileSync('geojson/lookup.js', lookupHelper);

// 6. Standalone Leaflet Demo
const demoHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Chronicles of India — GeoJSON Demo</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body { height: 100%; margin: 0; font-family: system-ui, sans-serif; }
  #map { height: 100%; width: 100%; }
  #controls {
    position: absolute; top: 10px; right: 10px; z-index: 1000;
    background: white; padding: 12px 16px; border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15); max-width: 320px;
  }
  select { width: 100%; padding: 6px; font-size: 14px; margin-top: 6px; }
  h3 { margin: 0 0 6px; font-size: 16px; }
  .info { font-size: 12px; color: #555; margin-top: 6px; }
</style>
</head>
<body>
<div id="controls">
  <h3>Chronicles of India (GeoJSON)</h3>
  <label for="eraSelect">Historical Snapshot:</label>
  <select id="eraSelect"></select>
  <div id="eraInfo" class="info"></div>
</div>
<div id="map"></div>

<script>
  const map = L.map('map').setView([22.5, 79.0], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors | Chronicles of India GeoJSON'
  }).addTo(map);

  let currentLayer = null;

  async function loadSnapshot(path) {
    if (currentLayer) map.removeLayer(currentLayer);
    const res = await fetch(path);
    const data = await res.json();
    document.getElementById('eraInfo').textContent = data.properties.summary;
    currentLayer = L.geoJSON(data, {
      style: feature => ({
        color: feature.properties.color || '#3388ff',
        weight: 1.5,
        fillColor: feature.properties.color || '#3388ff',
        fillOpacity: 0.4
      }),
      onEachFeature: (feature, layer) => {
        layer.bindPopup('<b>' + feature.properties.name + '</b><br>' + (feature.properties.note || ''));
      }
    }).addTo(map);
  }

  fetch('index.json')
    .then(r => r.json())
    .then(eras => {
      const select = document.getElementById('eraSelect');
      eras.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.path;
        opt.textContent = (e.from < 0 ? (-e.from) + ' BCE' : e.from + ' CE') + ' · ' + e.title;
        select.appendChild(opt);
      });
      select.onchange = () => loadSnapshot(select.value);
      if (eras.length) loadSnapshot(eras[0].path);
    });
</script>
</body>
</html>
`;
writeFileSync('geojson/demo.html', demoHtml);

console.log(`GeoJSON export complete:
- ${snapshots.length} snapshots in geojson/snapshots/
- geojson/places.geojson (${placeFeatures.length} places)
- geojson/events.geojson (${eventFeatures.length} events)
- geojson/rivers.geojson (${riverFeatures.length} rivers)
- geojson/index.json, geojson/lookup.js, geojson/demo.html`);
