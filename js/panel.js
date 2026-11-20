"use strict";

const chipLi = (c, t, a, on) => `<li data-a="${a}" class="${on ? 'on' : ''}"><span class="chip" style="background:${c}"></span><span>${t}</span></li>`;

function render(soft) {
  const c = $('#content'), sc = c.scrollTop;
  let h = '';
  document.querySelectorAll('#tabs button').forEach(b => {
    const on = b.dataset.t === st.tab;
    b.classList.toggle('on', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
  });

  if (st.tab === 'era') {
    const s = SN[st.si];
    h += `<h2>${esc(T(s.title))}</h2><div class="rng">${rg(s)}</div><p>${esc(T(s.sum))}</p>`;
    h += '<h3>Powers on the map</h3><ul class="l">' + s.pol.map((p, i) => chipLi(p.c, `<b>${esc(T(p.n))}</b>${i === st.selPol ? `<br><span class="small">${esc(T(p.t))}</span>` : ''}`, 'pol:' + i, i === st.selPol)).join('') + '</ul>';
    const evs = EV.filter(e => e.y >= s.from && e.y <= s.to);
    if (evs.length) {
      h += '<h3>Events in this era</h3><ul class="l">' + evs.map(e => `<li data-a="ev:${e.id}" class="${e.id === st.selEv ? 'on' : ''}"><span class="dia"></span><span><b>${fy(e.y)}</b> · ${esc(T(e.t))}${e.id === st.selEv ? `<br><span class="small">${esc(T(e.d))}</span>` : ''}</span></li>`).join('') + '</ul>';
    }
    h += '<p class="small" style="margin-top:12px">Tip: tap a region or a ◆ for details. Dashed outlines show lands that changed hands since the previous era.</p>';
  } else if (st.tab === 'places') {
    const vis = PL.filter(p => nameAt(p, st.year));
    if (st.selPlace >= 0) {
      const p = PL[st.selPlace], cur = nameAt(p, st.year);
      h += '<button class="sec" data-a="pl:back">← All places</button>';
      if (cur) {
        h += `<h2 style="margin-top:10px">${esc(T(cur[1]))}</h2><div class="rng">Name in ${fy(st.year)}</div><p>${esc(T(cur[2]))}</p>`;
      } else {
        h += `<h2 style="margin-top:10px">${esc(T(p.n[0][1]))}</h2><div class="rng">Not yet founded in ${fy(st.year)}</div>`;
      }
      h += '<h3>Name through the ages</h3><div class="gen">' + p.n.map(n => `<div class="${cur && n === cur ? 'cur' : ''}"><b>${fy(n[0])} · ${esc(T(n[1]))}</b><br><span class="small">${esc(T(n[2]))}</span></div>`).join('') + '</div>';
      h += `<button class="pri" data-a="pl:fly:${p.id}">Show on map</button>`;
      if (!cur) h += `<button class="sec" data-a="pl:year:${p.id}">Jump to ${fy(p.n[0][0])}</button>`;
    } else {
      h += `<h2>Place genealogy</h2><p class="small">Cities change names and masters. Pick one to trace its names across the eras. Showing places existing in ${fy(st.year)}.</p><ul class="l">` + vis.map(p => {
        const n = nameAt(p, st.year);
        return `<li data-a="pl:${p.id}"><span class="chip" style="background:#0b2a5b;border-radius:50%"></span><span><b>${esc(T(n[1]))}</b>${p.n.length > 1 ? `<br><span class="small">${p.n.length} names over time</span>` : ''}</span></li>`;
      }).join('') + '</ul>';
    }
  } else if (st.tab === 'journeys') {
    if (st.jr >= 0) {
      const j = JR[st.jr];
      h += `<button class="sec" data-a="jr:back">← All journeys</button><h2 style="margin-top:10px">${esc(T(j.n))}</h2><div class="rng">${esc(T(j.who))} · ${esc(T(j.yrs))}</div><p>${esc(T(j.d))}</p>`;
      h += `<button class="pri" data-a="jr:walk">${st.walk ? '■ Stop' : '▶ Walk the route'}</button><ul class="l" style="margin-top:6px">` + j.s.map((p, i) => `<li data-a="js:${i}" class="${st.year >= p[3] ? 'on' : ''}"><span class="chip" style="background:#0b2a5b;border-radius:50%;color:#fff;font:700 9px/13px system-ui;text-align:center">${i + 1}</span><span><b>${esc(T(p[0]))}</b> · ${fy(p[3])}<br><span class="small">${esc(T(p[4]))}</span></span></li>`).join('') + '</ul>';
    } else {
      h += '<h2>Journeys through time</h2><p class="small">Follow travellers across the map. Stops light up as the timeline reaches them.</p><ul class="l">' + JR.map((j, i) => `<li data-a="jr:${i}"><span class="chip" style="background:#0b2a5b"></span><span><b>${esc(T(j.n))}</b><br><span class="small">${esc(T(j.who))} · ${esc(T(j.yrs))}</span></span></li>`).join('') + '</ul>';
    }
  } else {
    const q = st.quiz;
    if (!q.on) {
      h += '<h2>Pinpoint quiz</h2><p>Six rounds. You’re given a historic city; tap where you think it was. Closer guesses score higher (max 100 each).</p><button class="pri" data-a="q:start">Start quiz</button>';
    } else if (q.done) {
      const tot = Math.round(q.score);
      h += `<h2>Finished!</h2><div class="big">${tot} / 600</div><p>${tot > 480 ? 'Master cartographer.' : tot > 300 ? 'Solid historian’s instinct.' : 'Keep exploring the Places tab — then try again.'}</p><button class="pri" data-a="q:start">Play again</button><button class="sec" data-a="q:quit">Back to the atlas</button>`;
    } else {
      const t = q.rounds[q.i];
      h += `<div class="rng">Round ${q.i + 1} of ${q.rounds.length} · Score ${Math.round(q.score)}</div><h2>Where was ${esc(T(t.n[0][1]))}?</h2><p class="small">${esc(T(t.n[0][2]))}</p>`;
      if (q.res) {
        h += `<div class="card"><b>${q.res.d} km away</b> · +${q.res.pts} points<br><span class="small">The green dot is ${esc(T(q.res.name))}.</span></div><button class="pri" data-a="q:next">${q.i + 1 < q.rounds.length ? 'Next' : 'See score'}</button>`;
      } else {
        h += '<p>Tap the map to place your guess.</p>';
      }
      h += '<button class="sec" data-a="q:quit">Quit</button>';
    }
  }
  c.innerHTML = h;
  if (soft) c.scrollTop = sc;
}

function go(tab) {
  if (st.quiz.on && tab !== 'quiz') quitQuiz(true);
  st.tab = tab;
  render();
}

function act(a) {
  const [k, v, w] = a.split(':');
  if (k === 'pol') {
    const next = st.selPol == +v ? -1 : +v;
    st.selPol = next;
    drawPols();
    render(true);
    if (next >= 0) zoomToPol(next);
  } else if (k === 'ev') {
    st.selEv = +v;
    const e = EV[+v];
    st.selEv = e.id;
    setYear(e.y);
    flyTo(e.lon, e.lat, W / 3.2);
    render(true);
  } else if (k === 'pl') {
    if (v === 'back') {
      st.selPlace = -1;
      drawOv();
      render();
    } else if (v === 'fly') {
      const p = PL[+w];
      flyTo(p.lon, p.lat, W / 3);
    } else if (v === 'year') {
      const p = PL[+w];
      setYear(p.n[0][0]);
      render();
    } else {
      st.selPlace = +v;
      const p = PL[+v];
      drawOv();
      render();
      flyTo(p.lon, p.lat, Math.min(vb.w, W / 2));
    }
  } else if (k === 'jr') {
    if (v === 'back') {
      stopWalk();
      st.jr = -1;
      drawRoute();
      drawOv();
      render();
    } else if (v === 'walk') {
      st.walk ? stopWalk() : startWalk();
    } else {
      st.jr = +v;
      const j = JR[+v];
      drawRoute();
      setYear(j.s[0][3]);
      render();
      flyTo(j.s[0][1], j.s[0][2], W / 2.2);
      fitJourney();
    }
  } else if (k === 'js') {
    const p = JR[st.jr].s[+v];
    setYear(p[3]);
    flyTo(p[1], p[2], W / 3.2);
    render(true);
  } else if (k === 'q') {
    if (v === 'start') startQuiz();
    else if (v === 'next') nextQ();
    else if (v === 'quit') quitQuiz();
  }
}

function fitJourney() {
  const j = JR[st.jr];
  let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity;
  j.s.forEach(p => {
    a = Math.min(a, p[1]); b = Math.max(b, p[1]);
    c = Math.min(c, p[2]); d = Math.max(d, p[2]);
  });
  const w = Math.max((b - a) * K * XF * 1.5, (d - c) * K * 1.5 * svg.clientWidth / svg.clientHeight, W / 6);
  flyTo((a + b) / 2, (c + d) / 2, w);
}

function startWalk() {
  const j = JR[st.jr];
  let i = 0;
  st.walk = setInterval(() => {
    if (i >= j.s.length) {
      stopWalk();
      return;
    }
    const p = j.s[i++];
    setYear(p[3]);
    flyTo(p[1], p[2], W / 3.2);
    render(true);
  }, 2600);
  const p = j.s[0];
  setYear(p[3]);
  flyTo(p[1], p[2], W / 3.2);
  st.walkI = 1;
  i = 1;
  render(true);
}

function stopWalk() {
  if (st.walk) {
    clearInterval(st.walk);
    st.walk = null;
    if (st.tab === 'journeys') render(true);
  }
}

function startQuiz() {
  stopWalk();
  const q = st.quiz;
  q.on = true;
  q.done = false;
  q.score = 0;
  q.i = 0;
  q.res = null;
  q.rounds = PL.slice().sort(() => Math.random() - 0.5).slice(0, 6);
  st.selPol = -1;
  st.selPlace = -1;
  st.jr = -1;
  drawRoute();
  drawPols();
  resetView();
  render();
}

function nextQ() {
  const q = st.quiz;
  q.res = null;
  q.i++;
  if (q.i >= q.rounds.length) q.done = true;
  drawOv();
  render();
}

function quitQuiz(silent) {
  const q = st.quiz;
  q.on = false;
  q.res = null;
  drawPols();
  drawOv();
  if (!silent) {
    st.tab = 'era';
    render();
  }
}

function guess(lon, lat) {
  const q = st.quiz;
  if (!q.on || q.done || q.res) return;
  const t = q.rounds[q.i];
  const d = Math.round(hav(lon, lat, t.lon, t.lat));
  const pts = Math.max(0, Math.round(100 * (1 - d / 900)));
  q.score += pts;
  q.res = { d, pts, gl: lon, ga: lat, tl: t.lon, ta: t.lat, name: t.n[0][1] };
  drawOv();
  render();
}
