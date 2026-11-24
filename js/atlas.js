"use strict";

/* ---------- State & Data Initialization ---------- */
const st = {
  year: -261,
  tab: 'era',
  si: 0,
  selPol: -1,
  selPlace: -1,
  selPlaces: [],
  selEv: -1,
  jr: -1,
  cmpJr: -1,
  ghost: true,
  corridors: true,
  xray: false,
  play: false,
  walk: null,
  quiz: { on: false, rounds: [], i: 0, score: 0, res: null, guess: null, done: false },
  embed: false,
  lang: 'en'
};

const svg = $('#map');
const vb = { x: 0, y: 0, w: W, h: H };
let drag = null;

// Base map
const B = window.ATLAS_BASE || { coast: [], islands: [], rivers: [], lakes: [], relief: [], sea: [] };

// Regions / Atoms
const REG = window.ATLAS_REGIONS || { atoms: {}, migration: {} };
const ATOMS = REG.atoms;
const AP = {};
for (const k in ATOMS) AP[k] = ptsStr(ATOMS[k]);

// Geographic labels
const GEO = [
  ...B.sea.map(g => [g.name, g.at[0], g.at[1]]),
  ...[...new Set(B.relief.map(r => r.name))].map(n => {
    const c = B.relief.filter(r => r.name === n).map(r => cen(r.poly)).sort((a, b) => b.a - a.a)[0];
    return [n === 'Thar' ? 'Thar Desert' : n, c.x, c.y, ['Vindhya', 'Satpura', 'Aravalli'].includes(n) ? 1.6 : 0];
  })
];

// Snapshots Adapter
const rawSN = window.ATLAS_SNAPSHOTS || [];
const SN = rawSN.map(s => {
  const pol = (s.polities || s.pol || []).map(p => ({
    n: p.name || p.n,
    c: p.color || p.c,
    atoms: p.atoms,
    t: p.note || p.t || ''
  }));
  return {
    id: s.id,
    from: s.from,
    to: s.to,
    title: s.title,
    rep: s.representative || s.rep,
    sum: s.summary || s.sum,
    period: s.period,
    syllabus: s.syllabus,
    teacher_notes: s.teacher_notes,
    pol
  };
});

SN.forEach(s => {
  s.pol.forEach(p => {
    let a = 0, x = 0, y = 0;
    p.atoms.forEach(k => {
      const poly = ATOMS[k];
      if (poly) {
        const c = cen(poly);
        a += c.a;
        x += c.x * c.a;
        y += c.y * c.a;
      }
    });
    p.area = a;
    p.lon = a ? x / a : 78;
    p.lat = a ? y / a : 22;
  });
  s.owner = {};
  s.pol.forEach(p => p.atoms.forEach(k => { s.owner[k] = T(p.n); }));
});

// Places Adapter
const rawPL = window.ATLAS_PLACES || [];
const PL = rawPL.map(p => ({
  id: p.id,
  lon: p.lon,
  lat: p.lat,
  n: (p.names || p.n || []).map(n => (Array.isArray(n) ? n : [n.year, n.name, n.note]))
}));

// Events Adapter
const rawEV = window.ATLAS_EVENTS || [];
const EV = rawEV.map(e => ({
  id: e.id,
  y: e.year != null ? e.year : e.y,
  lon: e.lon,
  lat: e.lat,
  t: e.title || e.t,
  d: e.description || e.d
}));

// Journeys Adapter
const rawJR = window.ATLAS_JOURNEYS || [];
const JR = rawJR.map(j => ({
  n: j.title || j.n,
  who: j.who,
  yrs: j.years || j.yrs,
  d: j.description || j.d,
  s: (j.stops || j.s || []).map(st => (Array.isArray(st) ? st : [st.name, st.lon, st.lat, st.year, st.note]))
}));

// Corridors Adapter
const rawCOR = window.ATLAS_CORRIDORS || [];
const COR = rawCOR;

// Rulers & Divisions
const RULERS = window.ATLAS_RULERS || [];
const DIVISIONS = window.ATLAS_DIVISIONS || [];

/* ---------- Viewport Camera ---------- */
const scl = () => svg.clientWidth / vb.w;

function applyVB() {
  const r = svg.getBoundingClientRect();
  vb.h = vb.w * r.height / r.width;
  const lo = -W * 0.3, hi = W * 1.3;
  vb.x = Math.min(Math.max(vb.x, lo), Math.max(lo, hi - vb.w));
  vb.y = Math.min(Math.max(vb.y, -H * 0.3), Math.max(-H * 0.3, H * 1.3 - vb.h));
  svg.setAttribute('viewBox', `${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`);
  drawOv();
}

function resetView() {
  const r = svg.getBoundingClientRect();
  vb.w = Math.max(W * 0.82, H * 0.86 * r.width / r.height);
  vb.h = vb.w * r.height / r.width;
  vb.x = W * 0.5 - vb.w / 2;
  vb.y = H * 0.47 - vb.h / 2;
  applyVB();
}

function zoomAt(f, fx, fy) {
  const nw = Math.min(Math.max(vb.w * f, W / 18), W * 1.4);
  const wx = vb.x + fx * vb.w, wy = vb.y + fy * vb.h;
  const hh = vb.h / vb.w;
  vb.x = wx - fx * nw;
  vb.y = wy - fy * nw * hh;
  vb.w = nw;
  applyVB();
}

function flyTo(lon, lat, w) {
  const r = svg.getBoundingClientRect();
  w = Math.max(W / 18, Math.min(w || vb.w, W * 1.4));
  const h = w * r.height / r.width;
  const t = { x: px(lon, lat) - w / 2, y: py(lon, lat) - h / 2, w };

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    vb.x = t.x;
    vb.y = t.y;
    vb.w = t.w;
    applyVB();
    return;
  }

  const s = { x: vb.x, y: vb.y, w: vb.w };
  const t0 = performance.now();
  (function f(now) {
    const k = Math.min(1, (now - t0) / 450);
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    vb.x = s.x + (t.x - s.x) * e;
    vb.y = s.y + (t.y - s.y) * e;
    vb.w = s.w + (t.w - s.w) * e;
    applyVB();
    if (k < 1) requestAnimationFrame(f);
  })(t0);
}

/* ---------- Pointer & Gesture Interactions ---------- */
const ptrs = new Map();
let pinch = 0;

svg.addEventListener('pointerdown', e => {
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 1) {
    drag = { sx: e.clientX, sy: e.clientY, vx: vb.x, vy: vb.y, moved: false, t: e.target };
  } else {
    const [a, b] = [...ptrs.values()];
    pinch = Math.hypot(a.x - b.x, a.y - b.y);
    if (drag) drag.moved = true;
  }
});

svg.addEventListener('pointermove', e => {
  if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size === 2) {
    const [a, b] = [...ptrs.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (pinch) {
      const r = svg.getBoundingClientRect();
      zoomAt(pinch / d, ((a.x + b.x) / 2 - r.left) / r.width, ((a.y + b.y) / 2 - r.top) / r.height);
    }
    pinch = d;
    return;
  }
  if (drag && ptrs.size === 1) {
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) > 5) {
      drag.moved = true;
      svg.classList.add('drag');
      tip();
    }
    if (drag.moved) {
      const s = scl();
      vb.x = drag.vx - dx / s;
      vb.y = drag.vy - dy / s;
      applyVB();
    }
    return;
  }
  hover(e);
});

let lastUpTime = 0, lastUpX = 0, lastUpY = 0;

function handleDblClick(e) {
  if (st.quiz.on) return;
  const [lo, la] = toLonLat(e.clientX, e.clientY);
  let best = -1, minD = Infinity;
  PL.forEach((p, idx) => {
    const d = Math.hypot((p.lon - lo) * Math.cos(la * Math.PI / 180), p.lat - la);
    if (d < minD) { minD = d; best = idx; }
  });
  if (best >= 0 && minD < 4.5) {
    st.selPlace = best;
    go('places');
    drawOv();
    flyTo(PL[best].lon, PL[best].lat, Math.min(vb.w, W / 2));
  }
}

function end(e) {
  ptrs.delete(e.pointerId);
  pinch = 0;
  svg.classList.remove('drag');
  if (drag && !drag.moved && ptrs.size === 0 && e.type === 'pointerup') {
    const now = performance.now();
    if (!st.quiz.on && now - lastUpTime < 350 && Math.hypot(e.clientX - lastUpX, e.clientY - lastUpY) < 25) {
      handleDblClick(e);
      lastUpTime = 0;
    } else {
      lastUpTime = now;
      lastUpX = e.clientX;
      lastUpY = e.clientY;
      clickAt(e, drag.t);
    }
  }
  if (ptrs.size === 0) drag = null;
}

svg.addEventListener('pointerup', end);
svg.addEventListener('pointercancel', end);
svg.addEventListener('pointerleave', () => { tip(); setHov(-1); });
svg.addEventListener('dblclick', handleDblClick);
svg.addEventListener('wheel', e => {
  e.preventDefault();
  const r = svg.getBoundingClientRect();
  zoomAt(Math.exp(e.deltaY * 0.0015), (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
}, { passive: false });

function clickAt(e, t) {
  if (st.quiz.on) {
    const [lo, la] = toLonLat(e.clientX, e.clientY);
    guess(lo, la);
    return;
  }
  const kEl = t.closest && t.closest('[data-k]');
  if (kEl) {
    const [k, v] = kEl.dataset.k.split(':');
    if (k === 'p') {
      st.selPlace = +v;
      go('places');
      drawOv();
    } else if (k === 'e') {
      st.selEv = +v;
      go('era');
      drawOv();
      render(true);
    } else if (k === 'j') {
      const p = JR[st.jr].s[+v];
      setYear(p[3]);
      st.tab = 'journeys';
      render(true);
    } else if (k === 'cj') {
      const p = JR[st.cmpJr].s[+v];
      setYear(p[3]);
      st.tab = 'journeys';
      render(true);
    }
    return;
  }
  const pEl = t.closest && t.closest('[data-pi]');
  if (pEl) {
    const next = st.selPol == +pEl.dataset.pi ? -1 : +pEl.dataset.pi;
    st.selPol = next;
    drawPols();
    st.tab = 'era';
    render(true);
    if (next >= 0) zoomToPol(next);
    return;
  }
  if (st.selPol >= 0) {
    st.selPol = -1;
    drawPols();
    render(true);
  }
}

function hover(e) {
  if (st.quiz.on) { tip(); return; }
  const t = e.target, k = t.closest && t.closest('[data-k]'), p = t.closest && t.closest('[data-pi]');
  if (k) {
    const [a, v] = k.dataset.k.split(':');
    let s = '';
    if (a === 'p') {
      const n = nameAt(PL[+v], st.year);
      s = `<b>${esc(T(n[1]))}</b>`;
    } else if (a === 'e') {
      const ev = EV[+v];
      s = `<b>${fy(ev.y)}</b> · ${esc(T(ev.t))}`;
    } else if (a === 'j') {
      const q = JR[st.jr].s[+v];
      s = `<b>${+v + 1}. ${esc(T(q[0]))}</b> · ${fy(q[3])}`;
    } else if (a === 'cj') {
      const q = JR[st.cmpJr].s[+v];
      s = `<b>[Alt] ${+v + 1}. ${esc(T(q[0]))}</b> · ${fy(q[3])}`;
    }
    setHov(-1);
    tip(s, e);
  } else if (p) {
    const i = +p.dataset.pi;
    setHov(i);
    tip(`<b>${esc(T(SN[st.si].pol[i].n))}</b>`, e);
  } else {
    setHov(-1);
    tip();
  }
}

/* ---------- Universal Search Engine ---------- */
const SEARCH_ITEMS = [];
let searchActiveIdx = 0;
let filteredSearch = [];

function initSearch() {
  SEARCH_ITEMS.length = 0;
  PL.forEach((p, idx) => {
    const rawP = (window.ATLAS_PLACES || []).find(x => x.id === p.id) || p;
    const names = p.n.map(n => [T(n[1]), n[1]?.hi || '']).flat().filter(Boolean);
    if (rawP.regional) names.push(rawP.regional.name);
    const primaryName = p.n[0] ? T(p.n[0][1]) : p.id;
    const catName = rawP.category ? (tUI('cat' + rawP.category.charAt(0).toUpperCase() + rawP.category.slice(1)) || rawP.category) : '';
    SEARCH_ITEMS.push({
      type: 'place',
      badge: tUI('badgePlace'),
      title: primaryName,
      desc: catName || (p.n.length > 1 ? `${p.n.length} ${tUI('namesOverTime')}` : 'Settlement'),
      matchStr: (names.join(' ') + ' ' + (rawP.regional?.name || '') + ' ' + (rawP.lore ? T(rawP.lore) : '') + ' ' + (rawP.category || '')).toLowerCase(),
      action: () => {
        st.selPlace = idx;
        go('places');
        drawOv();
        flyTo(p.lon, p.lat, Math.min(vb.w, W / 2));
      }
    });
  });

  (window.ATLAS_RULERS || []).forEach(r => {
    SEARCH_ITEMS.push({
      type: 'ruler',
      badge: tUI('badgeRuler'),
      title: T(r.name),
      desc: `${T(r.dynasty_name || r.dynasty)} (${fy(r.reign[0])}–${fy(r.reign[1])})`,
      matchStr: `${T(r.name)} ${r.name?.hi || ''} ${T(r.dynasty_name || r.dynasty)}`.toLowerCase(),
      action: () => {
        setYear(r.reign[0]);
        go('era');
      }
    });
  });

  SN.forEach((s) => {
    const polNames = s.pol.map(p => T(p.n)).join(' ');
    SEARCH_ITEMS.push({
      type: 'era',
      badge: tUI('badgeEra'),
      title: T(s.title),
      desc: rg(s),
      matchStr: `${T(s.title)} ${s.title?.hi || ''} ${polNames} ${rg(s)}`.toLowerCase(),
      action: () => {
        setYear(s.from);
        go('era');
      }
    });
  });

  EV.forEach(e => {
    SEARCH_ITEMS.push({
      type: 'event',
      badge: tUI('badgeEvent'),
      title: T(e.t),
      desc: `${fy(e.y)} · ${esc(T(e.d)).slice(0, 50)}...`,
      matchStr: `${T(e.t)} ${e.t?.hi || ''} ${T(e.d)} ${fy(e.y)}`.toLowerCase(),
      action: () => {
        act('ev:' + e.id);
      }
    });
  });

  JR.forEach((j, idx) => {
    SEARCH_ITEMS.push({
      type: 'journey',
      badge: tUI('badgePerson'),
      title: T(j.n),
      desc: `${T(j.who)} (${T(j.yrs)})`,
      matchStr: `${T(j.n)} ${j.n?.hi || ''} ${T(j.who)} ${T(j.d)}`.toLowerCase(),
      action: () => {
        act('jr:' + idx);
      }
    });
  });

  SEARCH_ITEMS.push({
    type: 'quiz',
    badge: tUI('badgeQuiz'),
    title: tUI('quizTitle'),
    desc: tUI('startQuiz'),
    matchStr: 'quiz game test trivia pinpoint exam practice प्रश्नोत्तरी खेल परीक्षा',
    action: () => {
      go('quiz');
      act('q:start');
    }
  });
}

function openSearch() {
  const m = $('#search-modal');
  if (!m) return;
  m.style.display = 'flex';
  const inp = $('#searchInput');
  if (inp) {
    inp.value = '';
    inp.focus();
    renderSearch('');
  }
}

function closeSearch() {
  const m = $('#search-modal');
  if (m) m.style.display = 'none';
  const inp = $('#searchInput');
  if (inp) inp.blur();
}

function updateActiveSearchItem() {
  const items = document.querySelectorAll('#searchResults .search-item');
  items.forEach((it, i) => {
    const isAct = i === searchActiveIdx;
    it.classList.toggle('active', isAct);
    if (isAct) it.scrollIntoView({ block: 'nearest' });
  });
}

function renderSearch(q) {
  const resultsEl = $('#searchResults');
  if (!resultsEl) return;
  q = (q || '').trim().toLowerCase();
  if (!q) {
    filteredSearch = SEARCH_ITEMS.slice(0, 8);
  } else {
    filteredSearch = SEARCH_ITEMS.filter(item => item.matchStr.includes(q)).slice(0, 10);
  }
  searchActiveIdx = 0;
  if (!filteredSearch.length) {
    resultsEl.innerHTML = '<div style="padding:16px;text-align:center;color:var(--mut);font-size:13px">No results found for "' + esc(q) + '".</div>';
    return;
  }
  resultsEl.innerHTML = filteredSearch.map((item, idx) => `
    <div class="search-item ${idx === 0 ? 'active' : ''}" data-sidx="${idx}" role="option">
      <span class="search-badge ${item.type}">${item.badge}</span>
      <span class="search-title">${esc(item.title)}</span>
      <span class="search-desc">${esc(item.desc)}</span>
    </div>
  `).join('');
}

function selectSearchResult(idx) {
  const item = filteredSearch[idx];
  if (item && item.action) {
    closeSearch();
    item.action();
  }
}

/* ---------- UI Wiring ---------- */
$('#zi').onclick = () => zoomAt(0.7, 0.5, 0.5);
$('#zo').onclick = () => zoomAt(1.45, 0.5, 0.5);
$('#zr').onclick = resetView;
$('#tgGhost').onclick = e => {
  st.ghost = !st.ghost;
  e.target.classList.toggle('on', st.ghost);
  drawPols();
};
$('#tabs').onclick = e => {
  const b = e.target.closest('button');
  if (b) go(b.dataset.t);
};
$('#content').onclick = e => {
  const li = e.target.closest('[data-a]');
  if (li) act(li.dataset.a);
};
$('#content').addEventListener('change', e => {
  if (e.target.id === 'cmpJrSelect') act('jr:cmp:' + e.target.value);
});
$('#content').addEventListener('pointerover', e => {
  const li = e.target.closest && e.target.closest('[data-a]');
  if (li && li.dataset.a.startsWith('pol:')) setHov(+li.dataset.a.split(':')[1]);
});
$('#content').addEventListener('pointerout', e => {
  const li = e.target.closest && e.target.closest('[data-a]');
  if (li && li.dataset.a.startsWith('pol:')) setHov(-1);
});

// Search modal listeners
const searchBtn = $('#searchBtn');
if (searchBtn) searchBtn.onclick = openSearch;
const searchClose = $('#searchClose');
if (searchClose) searchClose.onclick = closeSearch;
const searchModal = $('#search-modal');
if (searchModal) {
  searchModal.onclick = e => {
    if (e.target.id === 'search-modal') closeSearch();
  };
}
const searchInput = $('#searchInput');
if (searchInput) {
  searchInput.oninput = e => renderSearch(e.target.value);
}
const searchResults = $('#searchResults');
if (searchResults) {
  searchResults.onclick = e => {
    const item = e.target.closest('[data-sidx]');
    if (item) selectSearchResult(+item.dataset.sidx);
  };
}

document.addEventListener('keydown', e => {
  const modalOpen = searchModal && searchModal.style.display !== 'none';
  if (modalOpen) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      searchActiveIdx = Math.min(filteredSearch.length - 1, searchActiveIdx + 1);
      updateActiveSearchItem();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      searchActiveIdx = Math.max(0, searchActiveIdx - 1);
      updateActiveSearchItem();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectSearchResult(searchActiveIdx);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSearch();
    }
    return;
  }

  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
    e.preventDefault();
    openSearch();
  } else if (e.key.toLowerCase() === 'l') {
    if (typeof setLanguage === 'function') {
      setLanguage(CURRENT_LANG === 'hi' ? 'en' : 'hi');
    }
  } else if (e.key === '1') {
    go('era');
  } else if (e.key === '2') {
    go('places');
  } else if (e.key === '3') {
    go('journeys');
  } else if (e.key === '4') {
    go('quiz');
  } else if (e.key.toLowerCase() === 'x') {
    $('#tgXray')?.click();
  } else if (e.key.toLowerCase() === 'c') {
    $('#tgCorridors')?.click();
  } else if (e.key.toLowerCase() === 'g') {
    $('#tgGhost')?.click();
  } else if (e.key === 'ArrowRight') {
    if (e.shiftKey) setYear(st.year + 10);
    else $('#next').click();
  } else if (e.key === 'ArrowLeft') {
    if (e.shiftKey) setYear(st.year - 10);
    else $('#prev').click();
  } else if (e.key === ' ') {
    e.preventDefault();
    $('#play').click();
  } else if (e.key === 'Escape') {
    if (st.quiz.on) quitQuiz();
    else if (st.jr >= 0) act('jr:back');
    else if (st.selPlace >= 0) act('pl:back');
    else if (st.selPol >= 0) {
      st.selPol = -1;
      drawPols();
      render(true);
    }
  }
});

// Tablist keyboard navigation
const tabBtns = [...document.querySelectorAll('#tabs button')];
tabBtns.forEach((btn, idx) => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nxt = tabBtns[(idx + 1) % tabBtns.length];
      nxt.focus();
      nxt.click();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prv = tabBtns[(idx - 1 + tabBtns.length) % tabBtns.length];
      prv.focus();
      prv.click();
    }
  });
});

// Language button
const langBtn = $('#langBtn');
if (langBtn) {
  langBtn.onclick = () => {
    if (typeof setLanguage === 'function') {
      setLanguage(CURRENT_LANG === 'hi' ? 'en' : 'hi');
    }
  };
}

new ResizeObserver(() => applyVB()).observe(svg);

// Startup sequence
initStaticLayers();
initTimeline();
initSearch();
if (typeof initShare === 'function') initShare();
drawPols();
if (!window.location.search || !window.location.search.includes('year=')) {
  setYear(-261);
}
if (st.lang === 'hi' && typeof setLanguage === 'function') {
  setLanguage('hi');
}
resetView();
render();
if (typeof initExamPhase === 'function') initExamPhase();
if (window.atlasAPI) {
  window.atlasAPI.setSyllabus = (typeof setSyllabus === 'function') ? setSyllabus : null;
  window.atlasAPI.toggleTeacherMode = (typeof toggleTeacherMode === 'function') ? toggleTeacherMode : null;
  window.atlasAPI.openExamModal = (typeof openExamModal === 'function') ? openExamModal : null;
}

// Contract export
window.atlas = { st, SN, PL, EV, JR, setYear, act };
window.setLanguage = setLanguage;
