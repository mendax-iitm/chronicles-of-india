#!/usr/bin/env node
/**
 * Chronicles of India — Model Context Protocol (MCP) Server
 * Stdio JSON-RPC 2.0 implementation adhering to MCP Specification 2024-11-05.
 * Zero external dependencies.
 *
 * Usage:
 *   node scripts/mcp-server.js
 *
 * Tools exposed:
 *   - search_atlas(query)
 *   - inspect_place(name)
 *   - inspect_person(name)
 *   - inspect_ruler(name)
 *   - get_era(year)
 *   - inspect_atom(atom_id)
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Load datasets
const snapshots = JSON.parse(readFileSync(resolve(rootDir, 'data/snapshots.json'), 'utf8'));
const places = JSON.parse(readFileSync(resolve(rootDir, 'data/places.json'), 'utf8'));
const events = JSON.parse(readFileSync(resolve(rootDir, 'data/events.json'), 'utf8'));
const rulers = JSON.parse(readFileSync(resolve(rootDir, 'data/rulers.json'), 'utf8'));
const journeys = JSON.parse(readFileSync(resolve(rootDir, 'data/journeys.json'), 'utf8'));
const regions = JSON.parse(readFileSync(resolve(rootDir, 'data/regions.json'), 'utf8'));

function fy(y) {
  if (y === undefined || y === null) return '';
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
}

function T(obj) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj.en || obj.hi || '';
}

// Tool Definitions
const TOOLS = [
  {
    name: 'search_atlas',
    description: 'Search across all South Asian historical entities: polities, rulers, settlements, events, and traveler journeys.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search keyword (e.g., "Ashoka", "Pataliputra", "Panipat", "Chola")' }
      },
      required: ['query']
    }
  },
  {
    name: 'inspect_place',
    description: 'Retrieve full historical dossier for a place, including name genealogy across ancient/medieval/colonial eras, coordinates, cultural lore, and site events.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Settlement or landmark name/ID (e.g., "Pataliputra", "Patna", "Taxila", "Delhi", "Hampi")' }
      },
      required: ['name']
    }
  },
  {
    name: 'inspect_person',
    description: 'Retrieve traveler chronicle, full chronological itinerary with coordinates, dates, and historical significance.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Traveler or historical figure name (e.g., "Alexander", "Xuanzang", "Ibn Battuta", "Shivaji", "Buddha")' }
      },
      required: ['name']
    }
  },
  {
    name: 'inspect_ruler',
    description: 'Retrieve ruler biographical and reign details, dynasty, regnal dates, and classical regnal era conversions (Vikram Samvat, Shaka Samvat, Hijri, Kollam).',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Ruler name or dynasty (e.g., "Ashoka", "Akbar", "Rajaraja Chola", "Samudragupta")' }
      },
      required: ['name']
    }
  },
  {
    name: 'get_era',
    description: 'Get historical snapshot of South Asia for any given year (-600 to 1947), listing active territorial polities, concurrent monarchs, and events.',
    inputSchema: {
      type: 'object',
      properties: {
        year: { type: 'integer', description: 'Year in CE/BCE (negative for BCE, e.g., -250 for 250 BCE, 1526 for 1526 CE)' }
      },
      required: ['year']
    }
  },
  {
    name: 'inspect_atom',
    description: 'Inspect a regional geographic atom (base spatial building block) covering historical provinces, rivers, and modern states.',
    inputSchema: {
      type: 'object',
      properties: {
        atom_id: { type: 'string', description: 'Atom identifier (e.g., "MAGADHA", "PUNJAB_E", "CHOLA_MANDALAM", "KONKAN")' }
      },
      required: ['atom_id']
    }
  }
];

// Tool Handlers
function handleSearch({ query }) {
  const q = String(query || '').toLowerCase().trim();
  if (!q) return { results: [] };
  const matches = [];

  // Places
  places.forEach(p => {
    (p.names || []).forEach(n => {
      const en = T(n.name).toLowerCase();
      if (en.includes(q)) {
        matches.push({
          type: 'place',
          id: p.id,
          name: T(n.name),
          year: fy(n.year),
          coordinates: [p.lon, p.lat],
          category: p.category
        });
      }
    });
  });

  // Rulers
  rulers.forEach(r => {
    const rName = T(r.name).toLowerCase();
    const rDyn = (T(r.dynasty_name) || r.dynasty || '').toLowerCase();
    if (rName.includes(q) || rDyn.includes(q)) {
      matches.push({
        type: 'ruler',
        name: T(r.name),
        dynasty: T(r.dynasty_name) || r.dynasty,
        reign: `${fy(r.reign[0])}–${fy(r.reign[1])}`,
        capital: r.capital
      });
    }
  });

  // Snapshots & Polities
  snapshots.forEach(s => {
    const sTitle = T(s.title).toLowerCase();
    if (sTitle.includes(q)) {
      matches.push({
        type: 'era',
        id: s.id,
        title: T(s.title),
        span: `${fy(s.from)}–${fy(s.to)}`,
        representative: T(s.representative)
      });
    }
    (s.polities || []).forEach(p => {
      const pName = T(p.name).toLowerCase();
      if (pName.includes(q)) {
        matches.push({
          type: 'polity',
          era: T(s.title),
          year: fy(s.from),
          polity: T(p.name),
          atoms: p.atoms
        });
      }
    });
  });

  // Events
  events.forEach(e => {
    const eTitle = T(e.title).toLowerCase();
    const eDesc = T(e.description).toLowerCase();
    if (eTitle.includes(q) || eDesc.includes(q)) {
      matches.push({
        type: 'event',
        id: e.id,
        title: T(e.title),
        year: fy(e.year),
        coordinates: [e.lon, e.lat]
      });
    }
  });

  // Journeys
  journeys.forEach(j => {
    const jName = T(j.title).toLowerCase();
    const jWho = T(j.who).toLowerCase();
    if (jName.includes(q) || jWho.includes(q)) {
      matches.push({
        type: 'journey',
        id: j.id,
        title: T(j.title),
        traveler: T(j.who),
        years: T(j.years),
        stopsCount: (j.stops || []).length
      });
    }
  });

  return { query, count: matches.length, matches: matches.slice(0, 25) };
}

function handleInspectPlace({ name }) {
  const q = String(name || '').toLowerCase().trim();
  const place = places.find(p => {
    if (String(p.id).toLowerCase() === q) return true;
    return (p.names || []).some(n => {
      const en = T(n.name).toLowerCase();
      return en === q || en.includes(q);
    });
  });

  if (!place) return { error: `Place not found matching "${name}".` };

  // Collect site events
  const siteEvents = events.filter(e => {
    const d = Math.hypot((e.lon - place.lon) * Math.cos(place.lat * Math.PI / 180), e.lat - place.lat);
    const title = T(e.title).toLowerCase();
    return d < 0.65 || title.includes(q);
  }).map(e => ({
    year: fy(e.year),
    title: T(e.title),
    description: T(e.description)
  }));

  return {
    id: place.id,
    coordinates: { lon: place.lon, lat: place.lat },
    category: place.category,
    lore: T(place.lore),
    eras_as_capital: place.capitals ? place.capitals.map(y => fy(y)) : [],
    name_genealogy: (place.names || []).map(n => ({
      from_year: fy(n.year),
      name_en: n.name?.en || n.name,
      name_hi: n.name?.hi || '',
      historical_note: T(n.note)
    })),
    nearby_events: siteEvents
  };
}

function handleInspectPerson({ name }) {
  const q = String(name || '').toLowerCase().trim();
  const journey = journeys.find(j => {
    if (String(j.id).toLowerCase() === q) return true;
    const t = T(j.title).toLowerCase();
    const w = T(j.who).toLowerCase();
    return t.includes(q) || w.includes(q);
  });

  if (!journey) return { error: `Person or journey not found matching "${name}".` };

  return {
    id: journey.id,
    title: T(journey.title),
    traveler: T(journey.who),
    period: T(journey.years),
    description: T(journey.description),
    stops: (journey.stops || []).map((s, idx) => ({
      order: idx + 1,
      name: T(s.name),
      year: fy(s.year),
      coordinates: [s.lon, s.lat],
      historical_note: T(s.note)
    }))
  };
}

function handleInspectRuler({ name }) {
  const q = String(name || '').toLowerCase().trim();
  const matches = rulers.filter(r => {
    const rName = T(r.name).toLowerCase();
    const rDyn = (T(r.dynasty_name) || r.dynasty || '').toLowerCase();
    return rName.includes(q) || rDyn.includes(q);
  });

  if (!matches.length) return { error: `No ruler found matching "${name}".` };

  return {
    count: matches.length,
    rulers: matches.map(r => {
      const midYear = Math.round((r.reign[0] + r.reign[1]) / 2);
      const vs = midYear > 0 ? midYear + 57 : midYear + 58;
      const shaka = midYear >= 78 ? `Shaka ${midYear - 78}` : null;
      const hijri = midYear >= 622 ? `AH ${Math.round((midYear - 622) * 1.0307) + 1}` : null;
      const kollam = midYear >= 825 ? `ME ${midYear - 824}` : null;

      return {
        name: T(r.name),
        dynasty: T(r.dynasty_name) || r.dynasty,
        reign_ce_bce: `${fy(r.reign[0])}–${fy(r.reign[1])}`,
        capital: r.capital,
        regnal_eras_mid_reign: {
          vikram_samvat: `VS ${vs}`,
          shaka_samvat: shaka,
          hijri: hijri,
          kollam_era: kollam
        }
      };
    })
  };
}

function handleGetEra({ year }) {
  const y = parseInt(year, 10);
  if (isNaN(y)) return { error: `Invalid year: ${year}` };

  let snapIdx = 0;
  snapshots.forEach((s, i) => { if (s.from <= y) snapIdx = i; });
  const s = snapshots[snapIdx];

  const activeRulers = rulers.filter(r => r.reign && r.reign[0] <= y && y <= r.reign[1]).map(r => ({
    name: T(r.name),
    dynasty: T(r.dynasty_name) || r.dynasty,
    reign: `${fy(r.reign[0])}–${fy(r.reign[1])}`
  }));

  const activeEvents = events.filter(e => Math.abs(e.year - y) <= 25).map(e => ({
    year: fy(e.year),
    title: T(e.title),
    description: T(e.description)
  }));

  return {
    requested_year: fy(y),
    snapshot: {
      id: s.id,
      title: T(s.title),
      span: `${fy(s.from)}–${fy(s.to)}`,
      representative: T(s.representative),
      summary: T(s.summary),
      polities: (s.polities || []).map(p => ({
        name: T(p.name),
        color: p.color,
        atoms_count: (p.atoms || []).length,
        atoms: p.atoms,
        note: T(p.note)
      }))
    },
    concurrent_rulers: activeRulers,
    contemporary_events: activeEvents
  };
}

function handleInspectAtom({ atom_id }) {
  const id = String(atom_id || '').toUpperCase().trim();
  const atomPoints = regions.atoms[id];
  if (!atomPoints) {
    return {
      error: `Atom "${id}" not found. Available sample atoms: ${Object.keys(regions.atoms).slice(0, 10).join(', ')}...`
    };
  }

  const ownership = [];
  snapshots.forEach(s => {
    (s.polities || []).forEach(p => {
      if (p.atoms && p.atoms.includes(id)) {
        ownership.push({
          era: T(s.title),
          span: `${fy(s.from)}–${fy(s.to)}`,
          polity: T(p.name)
        });
      }
    });
  });

  return {
    atom_id: id,
    points_count: atomPoints.length,
    historical_rulers_and_polities: ownership
  };
}

// JSON-RPC Dispatcher
function dispatch(msg) {
  const { id, method, params } = msg;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: {
          name: 'chronicles-of-india-mcp',
          version: '1.0.0'
        }
      }
    };
  }

  if (method === 'notifications/initialized') {
    return null;
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: { tools: TOOLS }
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params || {};
    let resultData;
    switch (name) {
      case 'search_atlas':
        resultData = handleSearch(args || {});
        break;
      case 'inspect_place':
        resultData = handleInspectPlace(args || {});
        break;
      case 'inspect_person':
        resultData = handleInspectPerson(args || {});
        break;
      case 'inspect_ruler':
        resultData = handleInspectRuler(args || {});
        break;
      case 'get_era':
        resultData = handleGetEra(args || {});
        break;
      case 'inspect_atom':
        resultData = handleInspectAtom(args || {});
        break;
      default:
        return {
          jsonrpc: '2.0',
          id,
          error: { code: -32601, message: `Tool not found: ${name}` }
        };
    }
    return {
      jsonrpc: '2.0',
      id,
      result: {
        content: [
          { type: 'text', text: JSON.stringify(resultData, null, 2) }
        ]
      }
    };
  }

  if (method === 'ping') {
    return { jsonrpc: '2.0', id, result: {} };
  }

  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` }
  };
}

// Stdio Line Reader
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', line => {
  line = line.trim();
  if (!line) return;
  try {
    const req = JSON.parse(line);
    const res = dispatch(req);
    if (res) process.stdout.write(JSON.stringify(res) + '\n');
  } catch (err) {
    process.stdout.write(JSON.stringify({
      jsonrpc: '2.0',
      id: null,
      error: { code: -32700, message: 'Parse error: ' + err.message }
    }) + '\n');
  }
});
