"use strict";

/* ---------- State & Data Initialization ---------- */
const st = {
  year: -261,
  tab: 'era',
  si: 0,
  selPol: -1,
  selPlace: -1,
  selEv: -1,
  jr: -1,
  ghost: true,
  play: false,
  walk: null,
  quiz: { on: false, rounds: [], i: 0, score: 0, res: null, guess: null, done: false }
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

function end(e) {
  ptrs.delete(e.pointerId);
  pinch = 0;
  svg.classList.remove('drag');
  if (drag && !drag.moved && ptrs.size === 0 && e.type === 'pointerup') clickAt(e, drag.t);
  if (ptrs.size === 0) drag = null;
}

svg.addEventListener('pointerup', end);
svg.addEventListener('pointercancel', end);
svg.addEventListener('pointerleave', () => { tip(); setHov(-1); });
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
$('#content').addEventListener('pointerover', e => {
  const li = e.target.closest && e.target.closest('[data-a]');
  if (li && li.dataset.a.startsWith('pol:')) setHov(+li.dataset.a.split(':')[1]);
});
$('#content').addEventListener('pointerout', e => {
  const li = e.target.closest && e.target.closest('[data-a]');
  if (li && li.dataset.a.startsWith('pol:')) setHov(-1);
});

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight') {
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

new ResizeObserver(() => applyVB()).observe(svg);

// Startup sequence
initStaticLayers();
initTimeline();
drawPols();
setYear(-261);
resetView();
render();

// Contract export
window.atlas = { st, SN, PL, EV, JR, setYear, act };
