"use strict";

/* ---------- Phase 6: Formalized Public API (window.atlasAPI) & WebMCP ---------- */

window.atlasAPI = {
  // 1. Camera & View Navigation
  locate: (lon, lat, width) => {
    if (typeof flyTo === 'function') flyTo(lon, lat, width || W / 3);
  },
  resetView: () => {
    if (typeof resetView === 'function') resetView();
  },

  // 2. Timeline & Era Inspection
  setYear: (y) => {
    if (typeof setYear === 'function') setYear(y);
  },
  setLanguage: (lang) => {
    if (typeof setLanguage === 'function') setLanguage(lang);
  },
  getLanguage: () => {
    return (typeof CURRENT_LANG !== 'undefined' ? CURRENT_LANG : (typeof st !== 'undefined' ? st.lang : 'en')) || 'en';
  },
  getTimeline: () => {
    return (window.SN || []).map((s, idx) => ({
      index: idx,
      id: s.id,
      from: s.from,
      to: s.to,
      title: T(s.title),
      representative: T(s.rep || s.representative),
      summary: T(s.summary)
    }));
  },
  inspect: () => {
    const s = SN[st.si];
    const rulers = typeof getActiveRulers === 'function' ? getActiveRulers(st.year) : [];
    const erasStr = typeof getRegnalEras === 'function' ? getRegnalEras(st.year) : '';
    return {
      year: st.year,
      era: T(s.title),
      from: s.from,
      to: s.to,
      representative: T(s.rep || s.representative),
      summary: T(s.summary),
      regnal_eras: erasStr,
      active_rulers: rulers,
      polities: (s.pol || []).map(p => ({
        name: T(p.n),
        color: p.c,
        area: p.area,
        atoms: p.atoms,
        note: T(p.note)
      }))
    };
  },
  getState: () => {
    return JSON.parse(JSON.stringify(st));
  },
  getRulers: (y) => {
    const year = y !== undefined ? y : st.year;
    return typeof getActiveRulers === 'function' ? getActiveRulers(year) : [];
  },

  // 3. Entity Resolution & Navigation
  resolvePlace: (name) => {
    const query = String(name || '').toLowerCase().trim();
    if (!query) return null;
    for (let idx = 0; idx < PL.length; idx++) {
      const p = PL[idx];
      if (String(p.id).toLowerCase() === query) {
        return { index: idx, id: p.id, lon: p.lon, lat: p.lat, currentName: T(p.n[0][1]), allNames: p.n };
      }
      for (const n of (p.n || [])) {
        const nStr = T(n[1]).toLowerCase();
        if (nStr === query || nStr.includes(query)) {
          return { index: idx, id: p.id, lon: p.lon, lat: p.lat, currentName: T(n[1]), allNames: p.n };
        }
      }
    }
    return null;
  },
  openPerson: (name) => {
    const query = String(name || '').toLowerCase().trim();
    for (let i = 0; i < JR.length; i++) {
      const j = JR[i];
      if (T(j.n).toLowerCase().includes(query) || T(j.who).toLowerCase().includes(query)) {
        if (typeof go === 'function') go('journeys');
        if (typeof act === 'function') act('jr:' + i);
        return true;
      }
    }
    return false;
  },

  // 4. Search
  search: (query) => {
    const q = String(query || '').toLowerCase().trim();
    if (!q) return [];
    const results = [];

    // Places
    PL.forEach((p, idx) => {
      (p.n || []).forEach(n => {
        if (T(n[1]).toLowerCase().includes(q)) {
          results.push({ type: 'place', id: p.id, index: idx, name: T(n[1]), year: n[0], lon: p.lon, lat: p.lat });
        }
      });
    });

    // Events
    EV.forEach(e => {
      if (T(e.t).toLowerCase().includes(q) || T(e.d).toLowerCase().includes(q)) {
        results.push({ type: 'event', id: e.id, title: T(e.t), year: e.y, lon: e.lon, lat: e.lat });
      }
    });

    // Polities
    SN.forEach(s => {
      (s.pol || []).forEach(p => {
        if (T(p.n).toLowerCase().includes(q)) {
          results.push({ type: 'polity', era: T(s.title), year: s.from, name: T(p.n), color: p.c });
        }
      });
    });

    // Journeys
    JR.forEach((j, idx) => {
      if (T(j.n).toLowerCase().includes(q) || T(j.who).toLowerCase().includes(q)) {
        results.push({ type: 'journey', id: idx, title: T(j.n), who: T(j.who), years: T(j.yrs) });
      }
    });

    return results;
  },

  // 5. Image & Vector Export
  exportImage: (format) => {
    if (format === 'svg' && typeof exportSVG === 'function') {
      exportSVG();
    } else if (typeof exportPNG === 'function') {
      exportPNG();
    }
  }
};

// WebMCP (navigator.modelContext) Tool Integration
function initWebMCP() {
  const tools = [
    {
      name: 'inspect_current_era',
      description: 'Get historical details about the era currently visible in the Chronicles of India atlas.',
      parameters: { type: 'object', properties: {} },
      execute: async () => window.atlasAPI.inspect()
    },
    {
      name: 'set_atlas_year',
      description: 'Set the historical year on the timeline (-600 to 1947 CE).',
      parameters: {
        type: 'object',
        properties: { year: { type: 'integer', description: 'Year in CE/BCE (negative for BCE)' } },
        required: ['year']
      },
      execute: async ({ year }) => {
        window.atlasAPI.setYear(year);
        return { success: true, year };
      }
    },
    {
      name: 'find_place_on_map',
      description: 'Find a place by historical, ancient, or modern name and center the camera on it.',
      parameters: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Name of settlement, port, or pass' } },
        required: ['name']
      },
      execute: async ({ name }) => {
        const res = window.atlasAPI.resolvePlace(name);
        if (res) {
          window.atlasAPI.locate(res.lon, res.lat);
          return { found: true, place: res };
        }
        return { found: false, error: `Place not found matching "${name}"` };
      }
    },
    {
      name: 'open_traveler_route',
      description: 'Display the historical journey and curved route arcs of an ancient or medieval traveler.',
      parameters: {
        type: 'object',
        properties: { name: { type: 'string', description: 'Traveler name (e.g., Xuanzang, Faxian, Alexander, Ibn Battuta)' } },
        required: ['name']
      },
      execute: async ({ name }) => {
        const ok = window.atlasAPI.openPerson(name);
        return { success: ok };
      }
    }
  ];

  // Browser standard draft navigator.modelContext
  if (typeof navigator !== 'undefined' && navigator.modelContext) {
    try {
      if (typeof navigator.modelContext.registerTools === 'function') {
        navigator.modelContext.registerTools(tools);
      } else if (typeof navigator.modelContext.provideTools === 'function') {
        navigator.modelContext.provideTools(tools);
      }
    } catch {
      // Sandboxed browser contexts
    }
  }

  // Universal in-page WebMCP interface
  window.modelContext = {
    version: '1.0.0',
    tools,
    invoke: async (name, args) => {
      const tool = tools.find(t => t.name === name);
      if (!tool) throw new Error(`Unknown WebMCP tool: ${name}`);
      return tool.execute(args || {});
    }
  };
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWebMCP);
  } else {
    initWebMCP();
  }
}
