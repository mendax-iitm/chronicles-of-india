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

function renderEraCard(s, si, y) {
  const rulers = getActiveRulers(y);
  const erasStr = getRegnalEras(y);
  const mapShownStr = typeof tUI === 'function' ? tUI('mapShownAt', { rep: esc(T(s.rep)) }) : `map shown at ${esc(T(s.rep))}`;
  let cardHtml = `<div class="ec-head"><b>${esc(T(s.title))}</b><span class="ec-stage">${si + 1}/${SN.length}</span></div><span>${rg(s)} · ${mapShownStr}</span>`;
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
  if (ec) ec.innerHTML = cardHtml;
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

let playSpeed = 1;

function stopPlay() {
  if (st.play) {
    clearInterval(st.play);
    st.play = null;
    $('#play').textContent = '▶';
  }
}

function startPlay() {
  if (st.play) {
    stopPlay();
    return;
  }
  $('#play').textContent = '❚❚';
  if (st.year >= 1940) setYear(-600);
  const stepMs = Math.round(120 / playSpeed);
  st.play = setInterval(() => {
    if (st.year >= 1947) {
      stopPlay();
      return;
    }
    setYear(st.year + (st.year < 0 && st.year + 8 >= 0 ? 9 : 8));
  }, stepMs);
}

function initEraSegments() {
  const segEl = $('#era-segments');
  if (!segEl) return;
  const segs = [
    { from: -600, to: -322, label: '600 BCE', color: '#7c5a46' },
    { from: -322, to: -185, label: 'Maurya', color: '#4f7755' },
    { from: -185, to: 320, label: 'Shunga–Kushan', color: '#8e6540' },
    { from: 320, to: 550, label: 'Gupta', color: '#c27d2c' },
    { from: 550, to: 1000, label: 'Post-Gupta', color: '#7e6491' },
    { from: 1000, to: 1206, label: 'Chola–Rajput', color: '#4a7d8a' },
    { from: 1206, to: 1526, label: 'Sultanate', color: '#4e678f' },
    { from: 1526, to: 1757, label: 'Mughal–Maratha', color: '#9e483c' },
    { from: 1757, to: 1947, label: 'British–1947', color: '#6e5645' }
  ];
  segEl.innerHTML = segs.map(sg => {
    const w = ((sg.to - sg.from) / 2547 * 100).toFixed(2);
    return `<div class="era-seg" style="width:${w}%;background:${sg.color}" title="${sg.label}">${sg.label}</div>`;
  }).join('');
}

function initTimeline() {
  initEraSegments();
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
      playSpeed = playSpeed === 1 ? 2 : playSpeed === 2 ? 0.5 : 1;
      spBtn.textContent = playSpeed + '×';
      if (st.play) {
        stopPlay();
        startPlay();
      }
    };
  }
}
