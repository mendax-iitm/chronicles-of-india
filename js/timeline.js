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
  }
  [...$('#ticks').children].forEach((t, i) => t.classList.toggle('on', i === si));
  const s = SN[si];
  const rulers = getActiveRulers(y);
  const erasStr = getRegnalEras(y);
  let cardHtml = `<b>${esc(T(s.title))}</b><span>${rg(s)} · map shown at ${esc(T(s.rep))}</span>`;
  if (erasStr) cardHtml += `<div class="regnal-eras">${erasStr}</div>`;
  if (rulers.length) {
    const rChips = rulers.slice(0, 3).map(r => `<span class="ruler-chip" title="${esc(T(r.dynasty))} (${r.span})">👑 <b>${esc(T(r.name))}</b> <span class="small">(${esc(T(r.dynasty))})</span></span>`).join('');
    cardHtml += `<div class="rulers">${rChips}</div>`;
  }
  $('#eracard').innerHTML = cardHtml;
  drawWaterways();
  drawCorridors();
  drawModern();
  drawOv();
  if (st.tab === 'era' && ch) render();
  else if (st.tab === 'places' || st.tab === 'journeys') render(true);
}

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
  st.play = setInterval(() => {
    if (st.year >= 1947) {
      stopPlay();
      return;
    }
    setYear(st.year + (st.year < 0 && st.year + 8 >= 0 ? 9 : 8));
  }, 120);
}

function initTimeline() {
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
    const i = st.year > SN[st.si].from ? st.si : Math.max(0, st.si - 1);
    setYear(SN[i].from);
  };
  $('#next').onclick = () => {
    if (st.quiz.on) return;
    stopPlay();
    setYear(SN[Math.min(SN.length - 1, st.si + 1)].from);
  };
  $('#play').onclick = () => {
    if (st.quiz.on) return;
    startPlay();
  };
}
