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
    const divSys = (window.ATLAS_DIVISIONS || []).find(d => {
      return d.period && d.period[0] <= s.from && s.from <= d.period[1];
    });
    if (divSys) {
      h += `<h3>Administrative Divisions</h3><p class="small"><b>${esc(T(divSys.name))}</b></p><div class="div-list">` +
        divSys.divisions.slice(0, 8).map(dv => `<div class="div-card"><b>${esc(T(dv.name))}</b> <span class="small">(Cap: ${esc(typeof dv.capital === 'object' ? T(dv.capital) : dv.capital)})</span></div>`).join('') +
        `</div>`;
    }
    h += '<p class="small" style="margin-top:12px">Tip: tap a region or a ◆ for details. Dashed outlines show lands that changed hands since the previous era.</p>';
  } else if (st.tab === 'places') {
    const vis = PL.filter(p => nameAt(p, st.year));
    if (st.selPlace >= 0) {
      const p = PL[st.selPlace], cur = nameAt(p, st.year);
      const rawP = (window.ATLAS_PLACES || []).find(x => x.id === p.id) || p;
      h += '<button class="sec" data-a="pl:back">← All places</button>';
      if (st.selPlaces && st.selPlaces.length > 1) {
        h += `<div class="multi-trace" style="margin-top:10px;padding:8px 10px;background:#fef3c7;border:1px solid #fde68a;border-radius:6px;font-size:12px;color:#92400e;">
          <b>Multi-Site Route (${st.selPlaces.length} places):</b><br>` +
          st.selPlaces.map(idx => `<button class="cap-badge" data-a="pl:${PL[idx].id}" style="cursor:pointer;margin:4px 4px 2px 0;background:#fff;border-color:#f59e0b;color:#92400e;${idx === st.selPlace ? 'font-weight:bold;outline:2px solid #b45309;' : ''}">${esc(T(PL[idx].n[0][1]))}</button>`).join('') +
        `</div>`;
      }
      if (cur) {
        h += `<h2 style="margin-top:10px">${esc(T(cur[1]))}`;
        if (rawP.category) h += `<span class="cap-badge">${esc(T(rawP.category))}</span>`;
        h += `</h2><div class="rng">Name in ${fy(st.year)}</div><p>${esc(T(cur[2]))}</p>`;
      } else {
        h += `<h2 style="margin-top:10px">${esc(p.n[0] ? T(p.n[0][1]) : 'Place')}`;
        if (rawP.category) h += `<span class="cap-badge">${esc(T(rawP.category))}</span>`;
        h += `</h2><div class="rng">Not yet founded in ${fy(st.year)}</div>`;
      }
      if (rawP.eras_as_capital && rawP.eras_as_capital.length) {
        h += `<div style="margin-top:4px">` + rawP.eras_as_capital.map(c => `<button class="cap-badge" data-a="pl:era:${esc(c)}" style="cursor:pointer;background:#e0f2fe;color:#0369a1;border-color:#bae6fd;border-radius:4px;font-family:inherit">★ Capital: ${esc(c)}</button>`).join(' ') + `</div>`;
      }
      if (rawP.lore) {
        h += `<div class="lore-box"><b>Cultural Lore:</b> ${esc(T(rawP.lore))}</div>`;
      }
      h += '<h3>Name through the ages</h3><div class="gen">' + p.n.map(n => `<div class="${cur && n === cur ? 'cur' : ''}"><b>${fy(n[0])} · ${esc(T(n[1]))}</b><br><span class="small">${esc(T(n[2]))}</span></div>`).join('') + '</div>';
      
      // Site-specific events
      const curName = cur ? T(cur[1]) : (p.n[0] ? T(p.n[0][1]) : '');
      const siteEvs = EV.filter(e => {
        const d = Math.hypot((e.lon - p.lon) * Math.cos(p.lat * Math.PI / 180), e.lat - p.lat);
        const title = typeof e.t === 'object' ? T(e.t) : String(e.t || '');
        return d < 0.65 || (curName && title.toLowerCase().includes(curName.toLowerCase()));
      }).sort((a, b) => a.y - b.y);
      if (siteEvs.length) {
        h += `<h3>Site events</h3><ul class="l">` + siteEvs.map(e => `<li data-a="pl:ev:${e.id}"><span class="dia"></span><span><b>${fy(e.y)}</b> · ${esc(T(e.t))}<br><span class="small">${esc(T(e.d))}</span></span></li>`).join('') + `</ul>`;
      }
      
      h += `<div style="margin-top:12px"><button class="pri" data-a="pl:fly:${p.id}">Show on map</button>`;
      if (!cur) h += ` <button class="sec" data-a="pl:year:${p.id}">Jump to ${fy(p.n[0][0])}</button>`;
      h += `</div>`;
    } else {
      h += `<h2>Place genealogy</h2><p class="small">Cities change names and masters. Pick one to trace its names across the eras. Showing places existing in ${fy(st.year)}.</p><ul class="l">` + vis.map(p => {
        const n = nameAt(p, st.year);
        const rawItem = (window.ATLAS_PLACES || []).find(x => x.id === p.id);
        const catBadge = rawItem && rawItem.category ? `<span class="cap-badge">${esc(T(rawItem.category))}</span>` : '';
        return `<li data-a="pl:${p.id}"><span class="chip" style="background:#0b2a5b;border-radius:50%"></span><span><b>${esc(T(n[1]))}</b>${catBadge}${p.n.length > 1 ? `<br><span class="small">${p.n.length} names over time</span>` : ''}</span></li>`;
      }).join('') + '</ul>';
    }
  } else if (st.tab === 'journeys') {
    if (st.jr >= 0) {
      const j = JR[st.jr];
      h += `<button class="sec" data-a="jr:back">← All journeys</button><h2 style="margin-top:10px">${esc(T(j.n))}</h2><div class="rng">${esc(T(j.who))} · ${esc(T(j.yrs))}</div><p>${esc(T(j.d))}</p>`;
      
      // Multi-journey comparison selector
      h += `<div style="margin:8px 0;padding:6px 10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;font-size:12px">
        <label for="cmpJrSelect" style="font-weight:600;color:var(--navy)">Compare with route: </label>
        <select id="cmpJrSelect" style="font:inherit;border:1px solid #cbd5e1;border-radius:4px;padding:2px 4px;background:#fff;margin-left:4px">
          <option value="-1">None</option>` +
          JR.map((other, idx) => idx !== st.jr ? `<option value="${idx}" ${st.cmpJr === idx ? 'selected' : ''}>${esc(T(other.n))}</option>` : '').join('') +
        `</select>
      </div>`;
      
      h += `<button class="pri" data-a="jr:walk">${st.walk ? '■ Stop' : '▶ Walk the route'}</button><ul class="l" style="margin-top:6px">` + j.s.map((p, i) => `<li data-a="js:${i}" class="${st.year >= p[3] ? 'on' : ''}"><span class="chip" style="background:#0b2a5b;border-radius:50%;color:#fff;font:700 9px/13px system-ui;text-align:center">${i + 1}</span><span><b>${esc(T(p[0]))}</b> · ${fy(p[3])}<br><span class="small">${esc(T(p[4]))}</span></span></li>`).join('') + '</ul>';
    } else {
      h += '<h2>Journeys through time</h2><p class="small">Follow travellers across the map. Stops light up as the timeline reaches them.</p><ul class="l">' + JR.map((j, i) => `<li data-a="jr:${i}"><span class="chip" style="background:#0b2a5b"></span><span><b>${esc(T(j.n))}</b><br><span class="small">${esc(T(j.who))} · ${esc(T(j.yrs))}</span></span></li>`).join('') + '</ul>';
    }
  } else {
    const q = st.quiz;
    if (!q.on) {
      h += '<h2>Pinpoint quiz</h2><p>Ten rounds of progressive difficulty across imperial eras. Each round provides rich dynastic and geographic clues. Drop a pin and confirm to reveal concentric accuracy rings.</p><button class="pri" data-a="q:start">Start quiz (10 rounds)</button>';
    } else if (q.done) {
      const tot = Math.round(q.score);
      let rank = {
        title: 'Lekhaka (लेखक)',
        badge: 'Royal Scribe',
        desc: 'You have begun recording the annals of the realm. Explore the Places and Journeys tabs to deepen your command of Indian geography!'
      };
      if (tot > 850) {
        rank = {
          title: 'Rajyashastri · Bhuvanachitrakara (राज्यशास्त्री · भुवनचित्रकार)',
          badge: 'Master Cartographer & Surveyor of Realms',
          desc: 'Peerless mastery! You command the full historical geography of South Asia with the authority of an imperial chief surveyor.'
        };
      } else if (tot > 650) {
        rank = {
          title: 'Mahamatya (महामात्य)',
          badge: 'High Imperial Councillor',
          desc: 'Exceptional insight! You demonstrate strategic spatial acumen worthy of the imperial councils of Pataliputra and Vijayanagara.'
        };
      } else if (tot > 350) {
        rank = {
          title: 'Akshapataladhikrita (अक्षपटलाधिकृत)',
          badge: 'Superintendent of Imperial Records',
          desc: 'Commendable historical knowledge! You navigate kingdoms, passes, and ancient waterways with steady skill.'
        };
      }
      h += `<h2>Quiz Complete!</h2><div class="big">${tot} / 1000</div>`;
      h += `<div class="rank-card">
        <span class="rank-badge">${rank.badge}</span>
        <div class="rank-title">${rank.title}</div>
        <div class="rank-desc">${rank.desc}</div>
      </div>`;
      h += `<div style="margin-top:14px"><button class="pri" data-a="q:start">Play again</button> <button class="sec" data-a="q:quit">Back to the atlas</button></div>`;
    } else {
      const t = q.rounds[q.i];
      h += `<div class="rng">Round ${q.i + 1} of ${q.rounds.length} · Score ${Math.round(q.score)} / 1000</div><h2>Where was ${esc(T(t.n[0][1]))}?</h2>`;
      if (t.clue) {
        h += `<div class="quiz-clue"><b>Historical Clue:</b> ${esc(t.clue)}</div>`;
      }
      if (q.res) {
        const ringBadge = q.res.d <= 50 ? '🌟 Bullseye (≤ 50 km)!' : q.res.d <= 150 ? '🎯 Close strike (≤ 150 km)' : q.res.d <= 300 ? '📍 Regional vicinity (≤ 300 km)' : '🧭 Broad area (> 300 km)';
        h += `<div class="card"><b>${q.res.d} km away</b> · +${q.res.pts} points<br><span class="small" style="color:#0369a1;font-weight:600">${ringBadge}</span><br><span class="small">The green dot is ${esc(T(q.res.name))}. Accuracy rings indicate 50, 150, 300, and 500 km radius.</span></div><button class="pri" data-a="q:next">${q.i + 1 < q.rounds.length ? 'Next round →' : 'See final score & rank'}</button>`;
      } else if (q.guess) {
        h += `<div class="quiz-provisional">📍 <b>Pin placed on map.</b><br><span class="small">Tap another spot on the map to adjust, or confirm your answer below:</span><br><button class="pri" data-a="q:confirm" style="margin-top:8px">Confirm Guess</button></div>`;
      } else {
        h += '<p class="small">Tap anywhere on the map to drop your provisional pin.</p>';
      }
      h += '<button class="sec" data-a="q:quit" style="margin-top:6px">Quit</button>';
    }
  }
  c.innerHTML = h;
  if (soft) c.scrollTop = sc;
  if (typeof syncURL === 'function') syncURL();
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
    } else if (v === 'era') {
      const eraStr = (w || '').toLowerCase();
      const snap = SN.find(s => T(s.title).toLowerCase().includes(eraStr) || s.pol.some(p => T(p.n).toLowerCase().includes(eraStr)));
      if (snap) {
        setYear(snap.from);
        go('era');
      }
    } else if (v === 'ev') {
      const e = EV.find(x => x.id === +w) || EV[+w];
      if (e) {
        setYear(e.y);
        flyTo(e.lon, e.lat, W / 3.2);
        st.selEv = e.id;
        go('era');
        drawOv();
      }
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
      st.cmpJr = -1;
      drawRoute();
      drawOv();
      render();
    } else if (v === 'walk') {
      st.walk ? stopWalk() : startWalk();
    } else if (v === 'cmp') {
      st.cmpJr = +w;
      drawRoute();
      drawOv();
      render(true);
    } else {
      st.jr = +v;
      st.cmpJr = -1;
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
    else if (v === 'confirm') confirmGuess();
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

const QUIZ_CURATED = [
  { id: 'pataliputra', clue: 'Imperial capital under Chandragupta Maurya and Ashoka, situated at the sacred confluence of the Ganga and Son rivers.' },
  { id: 'delhi', clue: 'Historic seat of the Sultanate and Mughal throne, site of seven fortified cities from Siri to Shahjahanabad.' },
  { id: 'vijayanagara', clue: 'Legendary City of Victory along the boulder-strewn banks of the Tungabhadra, founded by Harihara and Bukka.' },
  { id: 'kannauj', clue: 'Imperial seat of Emperor Harsha and the prized imperial citadel disputed in the Tripartite Struggle.' },
  { id: 'thanjavur', clue: 'Imperial Chola capital renowned for the monumental granite Rajarajeshvara (Brihadisvara) temple of Rajaraja I.' },
  { id: 'muziris', clue: 'Legendary Sangam port on the Malabar Coast that loaded Roman fleets with black pepper and Malabar spices.' },
  { id: 'ujjayini', clue: 'Sacred prime meridian city of ancient Indian astronomers and capital of Avanti associated with King Vikramaditya.' },
  { id: 'nalanda', clue: 'Preeminent international Mahavihara and monastic university of ancient Magadha, patronized by the Guptas and Harsha.' },
  { id: 'lothal', clue: 'Bronze Age Harappan port on the Gulf of Khambhat featuring the world’s earliest engineered tidal dockyard.' },
  { id: 'taxila', clue: 'Ancient Gandharan capital and intellectual crossroads of Vedic, Persian, and Hellenistic learning along the Uttarapatha.' }
];

function startQuiz() {
  stopWalk();
  const q = st.quiz;
  q.on = true;
  q.done = false;
  q.score = 0;
  q.i = 0;
  q.guess = null;
  q.res = null;
  q.rounds = QUIZ_CURATED.map(item => {
    const p = PL.find(x => x.id === item.id) || PL[0];
    return { ...p, clue: item.clue };
  });
  st.selPol = -1;
  st.selPlace = -1;
  st.jr = -1;
  st.cmpJr = -1;
  drawRoute();
  drawPols();
  resetView();
  render();
}

function nextQ() {
  const q = st.quiz;
  q.guess = null;
  q.res = null;
  q.i++;
  if (q.i >= q.rounds.length) q.done = true;
  drawOv();
  render();
}

function quitQuiz(silent) {
  const q = st.quiz;
  q.on = false;
  q.guess = null;
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
  q.guess = { lon, lat };
  drawOv();
  render();
}

function confirmGuess() {
  const q = st.quiz;
  if (!q.on || q.done || !q.guess || q.res) return;
  const t = q.rounds[q.i];
  const d = Math.round(hav(q.guess.lon, q.guess.lat, t.lon, t.lat));
  const pts = Math.max(0, Math.round(100 * (1 - d / 800)));
  q.score += pts;
  q.res = { d, pts, gl: q.guess.lon, ga: q.guess.lat, tl: t.lon, ta: t.lat, name: t.n[0][1] };
  q.guess = null;
  drawOv();
  render();
}
