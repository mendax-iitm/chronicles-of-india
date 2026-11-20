"use strict";

window.atlasAPI = {
  locate: (lon, lat, width) => {
    flyTo(lon, lat, width || W / 3);
  },
  inspect: () => {
    const s = SN[st.si];
    return {
      year: st.year,
      era: T(s.title),
      from: s.from,
      to: s.to,
      polities: s.pol.map(p => ({
        name: T(p.n),
        color: p.c,
        area: p.area,
        atoms: p.atoms
      }))
    };
  },
  resolvePlace: (name) => {
    const query = String(name || '').toLowerCase();
    for (const p of PL) {
      for (const n of p.n) {
        if (T(n[1]).toLowerCase() === query || (n[1].en && n[1].en.toLowerCase() === query)) {
          return { id: p.id, lon: p.lon, lat: p.lat, currentName: T(n[1]), allNames: p.n };
        }
      }
    }
    return null;
  },
  openPerson: (name) => {
    const query = String(name || '').toLowerCase();
    for (let i = 0; i < JR.length; i++) {
      const j = JR[i];
      if (T(j.n).toLowerCase().includes(query) || T(j.who).toLowerCase().includes(query)) {
        go('journeys');
        act('jr:' + i);
        return true;
      }
    }
    return false;
  },
  setYear: (y) => {
    setYear(y);
  },
  search: (query) => {
    const q = String(query || '').toLowerCase().trim();
    if (!q) return [];
    const results = [];
    // Search places
    PL.forEach(p => {
      p.n.forEach(n => {
        if (T(n[1]).toLowerCase().includes(q)) {
          results.push({ type: 'place', id: p.id, name: T(n[1]), year: n[0], lon: p.lon, lat: p.lat });
        }
      });
    });
    // Search events
    EV.forEach(e => {
      if (T(e.t).toLowerCase().includes(q) || T(e.d).toLowerCase().includes(q)) {
        results.push({ type: 'event', id: e.id, title: T(e.t), year: e.y, lon: e.lon, lat: e.lat });
      }
    });
    // Search polities
    SN.forEach(s => {
      s.pol.forEach((p, idx) => {
        if (T(p.n).toLowerCase().includes(q)) {
          results.push({ type: 'polity', era: T(s.title), year: s.from, name: T(p.n), color: p.c });
        }
      });
    });
    // Search journeys
    JR.forEach((j, idx) => {
      if (T(j.n).toLowerCase().includes(q) || T(j.who).toLowerCase().includes(q)) {
        results.push({ type: 'journey', id: idx, title: T(j.n), who: T(j.who), years: T(j.yrs) });
      }
    });
    return results;
  }
};
