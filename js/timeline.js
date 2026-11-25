"use strict";

function snapAt(y) {
  let k = 0;
  SN.forEach((s, i) => { if (s.from <= y) k = i; });
  return k;
}

function getRegnalEras(y) {
  const eras = [];
  // Vikram Samvat (started 57 BCE)
  const vs = y > 0 ? y + 57 : y + 58;
  eras.push(`VS ${vs}`);
  // Shaka Samvat (started 78 CE)
  if (y >= 78) eras.push(`Shaka ${y - 78}`);
  // Hijri (Islamic lunar year, from 622 CE)
  if (y >= 622) {
    const ah = Math.round((y - 622) * 1.0307) + 1;
    eras.push(`AH ${ah}`);
  }
  // Kollam Era (Malayalam Era, from 825 CE)
  if (y >= 825) {
    eras.push(`ME ${y - 824}`);
  }
  return eras.join(' · ');
}

function getActiveRulers(y) {
  const res = [];
  (window.ATLAS_RULERS || []).forEach(r => {
    if (r.reign && r.reign[0] <= y && y <= r.reign[1]) {
      res.push({
        dynasty: r.dynasty_name || r.dynasty,
        name: r.name,
        span: `${fy(r.reign[0])}–${fy(r.reign[1])}`
      });
    }
  });
  return res;
}

const MACRO_ERAS = [
  { from: -600, to: -322, label: { en: '600 BCE', hi: '600 ई.पू.' }, color: '#b45309' },
  { from: -322, to: -185, label: { en: 'Maurya', hi: 'मौर्य' }, color: '#15803d' },
  { from: -185, to: 320, label: { en: 'Shunga–Kushan', hi: 'शुंग–कुषाण' }, color: '#c2410c' },
  { from: 320, to: 550, label: { en: 'Gupta', hi: 'गुप्त' }, color: '#d97706' },
  { from: 550, to: 1000, label: { en: 'Post-Gupta', hi: 'गुप्तोत्तर' }, color: '#7c3aed' },
  { from: 1000, to: 1206, label: { en: 'Chola–Rajput', hi: 'चोल–राजपूत' }, color: '#0e7490' },
  { from: 1206, to: 1526, label: { en: 'Sultanate', hi: 'सल्तनत' }, color: '#1d4ed8' },
  { from: 1526, to: 1757, label: { en: 'Mughal–Maratha', hi: 'मुगल–मराठा' }, color: '#b91c1c' },
  { from: 1757, to: 1947, label: { en: 'British–1947', hi: 'ब्रिटिश–1947' }, color: '#6d4c41' }
];

function getMacroEra(y) {
  return MACRO_ERAS.find(sg => y >= sg.from && y <= sg.to) || MACRO_ERAS[0];
}

function renderEraCard(s, si, y) {
  const rulers = getActiveRulers(y);
  const erasStr = getRegnalEras(y);
  const macro = getMacroEra(y);
  const mapShownStr = typeof tUI === 'function' ? tUI('mapShownAt', { rep: esc(T(s.rep)) }) : `map shown at ${esc(T(s.rep))}`;
  let cardHtml = `<div class="ec-head"><b>${esc(T(s.title))}</b><span class="ec-stage" style="background:${macro.color}1f;color:${macro.color};border-color:${macro.color}44">${si + 1}/${SN.length}</span></div><span>${rg(s)} · ${mapShownStr}</span>`;
  if (erasStr) cardHtml += `<div class="regnal-eras">${erasStr}</div>`;
  if (rulers.length) {
    const rChips = rulers.slice(0, 3).map(r => `<span class="ruler-chip" title="${esc(T(r.dynasty))} (${r.span})">👑 <b>${esc(T(r.name))}</b> <span class="small">(${esc(T(r.dynasty))})</span></span>`).join('');
    cardHtml += `<div class="rulers">${rChips}</div>`;
  }
  if (s.pol && s.pol.length) {
    const chips = s.pol.map((p, i) => `<button type="button" class="ec-pol-chip${i === st.selPol ? ' sel' : ''}" data-pol-idx="${i}" title="${esc(T(p.n))}"><span class="ec-swatch" style="background:${p.c}"></span>${esc(T(p.n))}</button>`).join('');
    cardHtml += `<div class="era-legend-grid">${chips}</div>`;
  }
  const ec = $('#eracard');
  if (ec) {
    ec.innerHTML = cardHtml;
    ec.style.borderTop = `3px solid ${macro.color}`;
  }
}

function setYear(y, keepView) {
  y = Math.max(-600, Math.min(1947, Math.round(y)));
  if (y === 0) y = 1;
  st.year = y;
  $('#yr').value = y;
  $('#ylab').textContent = fy(y);
  const si = snapAt(y), ch = si !== st.si;
  st.si = si;
  if (ch) {
    st.selPol = -1;
    drawPols();
    if (typeof closeEventBalloon === 'function') closeEventBalloon();
  }
  [...$('#ticks').children].forEach((t, i) => t.classList.toggle('on', i === si));
  const macro = getMacroEra(y);
  document.documentElement.style.setProperty('--era-accent', macro.color);
  document.querySelectorAll('#era-segments .era-seg').forEach((el, idx) => {
    const sg = MACRO_ERAS[idx];
    el.classList.toggle('active', sg && y >= sg.from && y <= sg.to);
  });
  const s = SN[si];
  renderEraCard(s, si, y);
  const tlTip = $('#tl-tip');
  if (tlTip) {
    const pct = Math.max(4, Math.min(96, ((y + 600) / 2547 * 100)));
    tlTip.style.left = pct.toFixed(2) + '%';
    tlTip.textContent = `${fy(y)} · ${T(s.title)}`;
  }
  if (typeof announceEraChange === 'function') {
    announceEraChange(s, y, ch);
  }
  drawWaterways();
  drawCorridors();
  drawModern();
  drawOv();
  if (st.tab === 'era' && ch) render();
  else if (st.tab === 'places' || st.tab === 'journeys') render(true);
  if (typeof syncURL === 'function') syncURL();
}

const PLAY_SPEEDS = [0.3, 0.5, 1, 1.5, 2];
let playSpeed = 1;

function stopPlay() {
  if (st.play) {
    clearInterval(st.play);
    st.play = null;
    $('#play').textContent = '▶';
    $('#play').setAttribute('aria-label', typeof tUI === 'function' ? tUI('play') : 'Play');
  }
}

function startPlay() {
  if (st.play) {
    stopPlay();
    return;
  }
  $('#play').textContent = '❚❚';
  $('#play').setAttribute('aria-label', typeof tUI === 'function' ? tUI('pause') : 'Pause');
  if (st.year >= 1940) setYear(-600);
  const yearStep = playSpeed < 1 ? 4 : 8;
  const baseMs = playSpeed < 1 ? 60 : 120;
  const stepMs = Math.round(baseMs / playSpeed);
  st.play = setInterval(() => {
    if (st.year >= 1947) {
      stopPlay();
      return;
    }
    const nextY = st.year + yearStep;
    setYear(st.year < 0 && nextY >= 0 ? nextY + 1 : nextY);
  }, stepMs);
}

function initEraSegments() {
  const segEl = $('#era-segments');
  if (!segEl) return;
  segEl.innerHTML = MACRO_ERAS.map(sg => {
    const w = ((sg.to - sg.from) / 2547 * 100).toFixed(2);
    const lbl = typeof T === 'function' ? T(sg.label) : sg.label.en;
    const isAct = st.year >= sg.from && st.year <= sg.to;
    return `<button type="button" class="era-seg${isAct ? ' active' : ''}" data-from="${sg.from}" style="width:${w}%;background:${sg.color}" title="${esc(lbl)} (${fy(sg.from)} – ${fy(sg.to)})">${esc(lbl)}</button>`;
  }).join('');
  segEl.onclick = e => {
    const seg = e.target.closest('.era-seg');
    if (seg && !st.quiz.on) {
      stopPlay();
      setYear(+seg.dataset.from);
    }
  };
}

function initEventDots() {
  const el = $('#ev-dots');
  if (!el || typeof EV === 'undefined') return;
  const show = !st.layers || st.layers.events !== false;
  el.style.display = show ? 'block' : 'none';
  if (!show) return;
  // Space dots so overlapping events within 18 years don't crowd the track
  const sorted = [...EV].sort((a, b) => a.y - b.y);
  const placed = [];
  let lastY = -9999;
  for (const e of sorted) {
    if (e.y - lastY >= 18) {
      placed.push(e);
      lastY = e.y;
    }
  }
  el.innerHTML = placed.map(e => {
    const pct = ((e.y + 600) / 2547 * 100).toFixed(2);
    return `<button type="button" class="ev-dot" style="left:${pct}%" data-ev="${e.id}" title="${fy(e.y)} · ${esc(T(e.t))}" aria-label="${fy(e.y)} ${esc(T(e.t))}"></button>`;
  }).join('');
  el.onclick = ev => {
    const dot = ev.target.closest('.ev-dot');
    if (dot && !st.quiz.on) {
      stopPlay();
      act('ev:' + dot.dataset.ev);
    }
  };
}

function initTimeline() {
  initEraSegments();
  initEventDots();
  $('#ticks').innerHTML = SN.map(s => `<i style="left:${((s.from + 600) / 2547 * 100).toFixed(2)}%" title="${esc(T(s.title))} (${fy(s.from)})" data-y="${s.from}"></i>`).join('');
  $('#ticks').onclick = e => {
    const i = e.target.closest('i');
    if (i && !st.quiz.on) {
      stopPlay();
      setYear(+i.dataset.y);
    }
  };
  $('#yr').oninput = e => {
    if (st.quiz.on) return;
    stopPlay();
    setYear(+e.target.value);
  };
  $('#prev').onclick = () => {
    if (st.quiz.on) return;
    stopPlay();
    if (typeof getFilteredSnapshots === 'function' && st.syllabus && st.syllabus !== 'all') {
      const allowed = getFilteredSnapshots(st.syllabus);
      const curIdx = allowed.findIndex(s => s.id === SN[st.si].id);
      if (curIdx > 0) {
        setYear(allowed[curIdx - 1].from);
        return;
      }
    }
    const i = st.year > SN[st.si].from ? st.si : Math.max(0, st.si - 1);
    setYear(SN[i].from);
  };
  $('#next').onclick = () => {
    if (st.quiz.on) return;
    stopPlay();
    if (typeof getFilteredSnapshots === 'function' && st.syllabus && st.syllabus !== 'all') {
      const allowed = getFilteredSnapshots(st.syllabus);
      const curIdx = allowed.findIndex(s => s.id === SN[st.si].id);
      if (curIdx >= 0 && curIdx < allowed.length - 1) {
        setYear(allowed[curIdx + 1].from);
        return;
      }
    }
    setYear(SN[Math.min(SN.length - 1, st.si + 1)].from);
  };
  $('#play').onclick = () => {
    if (st.quiz.on) return;
    startPlay();
  };
  const spBtn = $('#speedBtn');
  if (spBtn) {
    spBtn.onclick = () => {
      const idx = PLAY_SPEEDS.indexOf(playSpeed);
      playSpeed = PLAY_SPEEDS[(idx + 1) % PLAY_SPEEDS.length];
      spBtn.textContent = playSpeed + '×';
      spBtn.classList.toggle('custom-speed', playSpeed !== 1);
      if (typeof tUI === 'function') {
        spBtn.setAttribute('aria-label', tUI('speedAria', { speed: playSpeed + '×' }));
      }
      if (st.play) {
        stopPlay();
        startPlay();
      }
    };
  }
}
