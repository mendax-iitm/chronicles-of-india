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
    h += `<h3>${tUI('powersOnMap')}</h3><ul class="l">` + s.pol.map((p, i) => chipLi(p.c, `<b>${esc(T(p.n))}</b>${i === st.selPol ? `<br><span class="small">${esc(T(p.t))}</span>` : ''}`, 'pol:' + i, i === st.selPol)).join('') + '</ul>';
    const evs = EV.filter(e => e.y >= s.from && e.y <= s.to);
    if (evs.length) {
      h += `<h3>${tUI('eventsInEra')}</h3><ul class="l">` + evs.map(e => `<li data-a="ev:${e.id}" class="${e.id === st.selEv ? 'on' : ''}"><span class="dia"></span><span><b>${fy(e.y)}</b> · ${esc(T(e.t))}${e.id === st.selEv ? `<br><span class="small">${esc(T(e.d))}</span>` : ''}</span></li>`).join('') + '</ul>';
    }
    const divSys = (window.ATLAS_DIVISIONS || []).find(d => {
      return d.period && d.period[0] <= s.from && s.from <= d.period[1];
    });
    if (divSys) {
      h += `<h3>${tUI('divisionsTitle')}</h3><p class="small"><b>${esc(T(divSys.name))}</b></p><div class="div-list">` +
        divSys.divisions.slice(0, 8).map(dv => `<div class="div-card"><b>${esc(T(dv.name))}</b> <span class="small">(${tUI('capitalBadge')}: ${esc(typeof dv.capital === 'object' ? T(dv.capital) : dv.capital)})</span></div>`).join('') +
        `</div>`;
    }
    if (s.syllabus) {
      h += `<div class="syllabus-card" style="margin:14px 0;padding:10px 12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-size:12px;color:#0369a1;">
        <div style="font-weight:700;display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span>📖</span>
          <span>NCERT Class ${s.syllabus.ncert_class}: ${esc(s.syllabus.book)}</span>
        </div>
        <div style="color:#0284c7;margin-bottom:4px;"><b>Chapter:</b> ${esc(s.syllabus.chapter)}</div>
        <div style="color:#0f172a;font-size:11.5px;"><b>UPSC Target:</b> ${esc(s.syllabus.upsc_topic)}</div>
        ${s.syllabus.tags ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">` + s.syllabus.tags.map(tg => `<span style="display:inline-block;padding:2px 6px;background:#e0f2fe;color:#0369a1;border-radius:4px;font-size:10.5px;">#${tg}</span>`).join('') + `</div>` : ''}
      </div>`;
    }
    h += `<p class="small" style="margin-top:12px">${tUI('eraTip')}</p>`;
  } else if (st.tab === 'places') {
    const vis = PL.filter(p => nameAt(p, st.year));
    if (st.selPlace >= 0) {
      const p = PL[st.selPlace], cur = nameAt(p, st.year);
      const rawP = (window.ATLAS_PLACES || []).find(x => x.id === p.id) || p;
      h += `<button class="sec" data-a="pl:back">${tUI('allPlaces')}</button>`;
      if (st.selPlaces && st.selPlaces.length > 1) {
        h += `<div class="multi-trace" style="margin-top:10px;padding:8px 10px;background:#fef3c7;border:1px solid #fde68a;border-radius:6px;font-size:12px;color:#92400e;">
          <b>${tUI('multiRoute', { n: st.selPlaces.length })}:</b><br>` +
          st.selPlaces.map(idx => `<button class="cap-badge" data-a="pl:${PL[idx].id}" style="cursor:pointer;margin:4px 4px 2px 0;background:#fff;border-color:#f59e0b;color:#92400e;${idx === st.selPlace ? 'font-weight:bold;outline:2px solid #b45309;' : ''}">${esc(T(PL[idx].n[0][1]))}</button>`).join('') +
        `</div>`;
      }
      const catName = rawP.category ? (tUI('cat' + rawP.category.charAt(0).toUpperCase() + rawP.category.slice(1)) || rawP.category) : '';
      if (cur) {
        h += `<h2 style="margin-top:10px">${esc(T(cur[1]))}`;
        if (catName) h += `<span class="cap-badge">${esc(catName)}</span>`;
        h += `</h2><div class="rng">${tUI('nameIn')} ${fy(st.year)}</div><p>${esc(T(cur[2]))}</p>`;
      } else {
        h += `<h2 style="margin-top:10px">${esc(p.n[0] ? T(p.n[0][1]) : 'Place')}`;
        if (catName) h += `<span class="cap-badge">${esc(catName)}</span>`;
        h += `</h2><div class="rng">${tUI('notFounded')} ${fy(st.year)}</div>`;
      }
      if (rawP.regional) {
        h += `<div class="reg-script" style="margin-top:4px;display:inline-flex;align-items:center;gap:6px;background:#f1f5f9;border:1px solid #cbd5e1;padding:3px 8px;border-radius:4px;font-size:13px">
          <span style="color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase">${esc(rawP.regional.script)}:</span>
          <b style="color:var(--navy);font-size:15px">${esc(rawP.regional.name)}</b>
        </div>`;
      }
      if (rawP.eras_as_capital && rawP.eras_as_capital.length) {
        h += `<div style="margin-top:6px">` + rawP.eras_as_capital.map(c => `<button class="cap-badge" data-a="pl:era:${esc(c)}" style="cursor:pointer;background:#e0f2fe;color:#0369a1;border-color:#bae6fd;border-radius:4px;font-family:inherit">★ ${tUI('capitalBadge')}: ${esc(c)}</button>`).join(' ') + `</div>`;
      }
      if (rawP.lore) {
        h += `<div class="lore-box"><b>${tUI('culturalLore')}</b> ${esc(T(rawP.lore))}</div>`;
      }
      h += `<h3>${tUI('nameHistory')}</h3><div class="gen">` + p.n.map(n => `<div class="${cur && n === cur ? 'cur' : ''}"><b>${fy(n[0])} · ${esc(T(n[1]))}</b><br><span class="small">${esc(T(n[2]))}</span></div>`).join('') + '</div>';
      
      // Site-specific events
      const curName = cur ? T(cur[1]) : (p.n[0] ? T(p.n[0][1]) : '');
      const siteEvs = EV.filter(e => {
        const d = Math.hypot((e.lon - p.lon) * Math.cos(p.lat * Math.PI / 180), e.lat - p.lat);
        const title = typeof e.t === 'object' ? T(e.t) : String(e.t || '');
        return d < 0.65 || (curName && title.toLowerCase().includes(curName.toLowerCase()));
      }).sort((a, b) => a.y - b.y);
      if (siteEvs.length) {
        h += `<h3>${tUI('siteEvents')}</h3><ul class="l">` + siteEvs.map(e => `<li data-a="pl:ev:${e.id}"><span class="dia"></span><span><b>${fy(e.y)}</b> · ${esc(T(e.t))}<br><span class="small">${esc(T(e.d))}</span></span></li>`).join('') + `</ul>`;
      }
      
      h += `<div style="margin-top:12px"><button class="pri" data-a="pl:fly:${p.id}">${tUI('showOnMap')}</button>`;
      if (!cur) h += ` <button class="sec" data-a="pl:year:${p.id}">${tUI('jumpTo')} ${fy(p.n[0][0])}</button>`;
      h += `</div>`;
    } else {
      h += `<h2>${tUI('placeGenealogy')}</h2><p class="small">${tUI('placeIntro', { year: fy(st.year) })}</p><ul class="l">` + vis.map(p => {
        const n = nameAt(p, st.year);
        const rawItem = (window.ATLAS_PLACES || []).find(x => x.id === p.id);
        const catName = rawItem && rawItem.category ? (tUI('cat' + rawItem.category.charAt(0).toUpperCase() + rawItem.category.slice(1)) || rawItem.category) : '';
        const catBadge = catName ? `<span class="cap-badge">${esc(catName)}</span>` : '';
        const regSnippet = rawItem && rawItem.regional ? ` <span class="small" style="color:#64748b">(${esc(rawItem.regional.name)})</span>` : '';
        return `<li data-a="pl:${p.id}"><span class="chip" style="background:#0b2a5b;border-radius:50%"></span><span><b>${esc(T(n[1]))}</b>${regSnippet}${catBadge}${p.n.length > 1 ? `<br><span class="small">${p.n.length} ${tUI('namesOverTime')}</span>` : ''}</span></li>`;
      }).join('') + '</ul>';
    }
  } else if (st.tab === 'journeys') {
    if (st.jr >= 0) {
      const j = JR[st.jr];
      h += `<button class="sec" data-a="jr:back">${tUI('allJourneys')}</button><h2 style="margin-top:10px">${esc(T(j.n))}</h2><div class="rng">${esc(T(j.who))} · ${esc(T(j.yrs))}</div><p>${esc(T(j.d))}</p>`;
      
      // Multi-journey comparison selector
      h += `<div style="margin:8px 0;padding:6px 10px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;font-size:12px">
        <label for="cmpJrSelect" style="font-weight:600;color:var(--navy)">${tUI('compareWithRoute')} </label>
        <select id="cmpJrSelect" style="font:inherit;border:1px solid #cbd5e1;border-radius:4px;padding:2px 4px;background:#fff;margin-left:4px">
          <option value="-1">${tUI('none')}</option>` +
          JR.map((other, idx) => idx !== st.jr ? `<option value="${idx}" ${st.cmpJr === idx ? 'selected' : ''}>${esc(T(other.n))}</option>` : '').join('') +
        `</select>
      </div>`;
      
      h += `<button class="pri" data-a="jr:walk">${st.walk ? tUI('stopRoute') : tUI('walkRoute')}</button><ul class="l" style="margin-top:6px">` + j.s.map((p, i) => `<li data-a="js:${i}" class="${st.year >= p[3] ? 'on' : ''}"><span class="chip" style="background:#0b2a5b;border-radius:50%;color:#fff;font:700 9px/13px system-ui;text-align:center">${i + 1}</span><span><b>${esc(T(p[0]))}</b> · ${fy(p[3])}<br><span class="small">${esc(T(p[4]))}</span></span></li>`).join('') + '</ul>';
    } else {
      h += `<h2>${tUI('journeysThroughTime')}</h2><p class="small">${tUI('journeysIntro')}</p><ul class="l">` + JR.map((j, i) => `<li data-a="jr:${i}"><span class="chip" style="background:#0b2a5b"></span><span><b>${esc(T(j.n))}</b><br><span class="small">${esc(T(j.who))} · ${esc(T(j.yrs))}</span></span></li>`).join('') + '</ul>';
    }
  } else {
    if (typeof renderPracticePanel === 'function') {
      renderPracticePanel();
      if (typeof syncURL === 'function') syncURL();
      return;
    }
    const q = st.quiz;
    if (!q.on) {
      h += `<h2>${tUI('quizTitle')}</h2><p>${tUI('quizIntro')}</p><button class="pri" data-a="q:start">${tUI('startQuiz')}</button>`;
    } else if (q.done) {
      const tot = Math.round(q.score);
      let rank = {
        title: tUI('rankLekhakaTitle'),
        badge: tUI('rankLekhakaBadge'),
        desc: tUI('rankLekhakaDesc')
      };
      if (tot > 850) {
        rank = {
          title: tUI('rankRajyashastriTitle'),
          badge: tUI('rankRajyashastriBadge'),
          desc: tUI('rankRajyashastriDesc')
        };
      } else if (tot > 650) {
        rank = {
          title: tUI('rankMahamatyaTitle'),
          badge: tUI('rankMahamatyaBadge'),
          desc: tUI('rankMahamatyaDesc')
        };
      }
      h += `<h2>${tUI('finalResults')}</h2><div class="big">${tot} / 1000</div>`;
      h += `<div class="rank-card">
        <span class="rank-badge">${rank.badge}</span>
        <div class="rank-title">${rank.title}</div>
        <div class="rank-desc">${rank.desc}</div>
      </div>`;
      h += `<div style="margin-top:14px"><button class="pri" data-a="q:start">${tUI('playAgain')}</button> <button class="sec" data-a="q:quit">${CURRENT_LANG === 'hi' ? 'एटलस पर लौटें' : 'Back to the atlas'}</button></div>`;
    } else {
      const t = q.rounds[q.i];
      const displayName = t.targetName ? T(t.targetName) : T(t.n[0][1]);
      const roundHeading = CURRENT_LANG === 'hi' ? `${esc(displayName)} कहाँ स्थित था?` : `Where was ${esc(displayName)}?`;
      h += `<div class="rng">${tUI('roundOf', { i: q.i + 1, n: q.rounds.length })} · ${tUI('score')} ${Math.round(q.score)} / 1000</div><h2>${roundHeading}</h2>`;
      if (t.clue) {
        const clueText = typeof t.clue === 'object' ? T(t.clue) : t.clue;
        h += `<div class="quiz-clue"><b>${tUI('clues')}</b> ${esc(clueText)}</div>`;
      }
      if (q.res) {
        const ringBadge = CURRENT_LANG === 'hi' ?
          (q.res.d <= 50 ? '🌟 सटीक प्रहार (≤ 50 किमी)!' : q.res.d <= 150 ? '🎯 निकटवर्ती प्रहार (≤ 150 किमी)' : q.res.d <= 300 ? '📍 क्षेत्रीय सीमा (≤ 300 किमी)' : '🧭 विस्तृत क्षेत्र (> 300 किमी)') :
          (q.res.d <= 50 ? '🌟 Bullseye (≤ 50 km)!' : q.res.d <= 150 ? '🎯 Close strike (≤ 150 km)' : q.res.d <= 300 ? '📍 Regional vicinity (≤ 300 km)' : '🧭 Broad area (> 300 km)');
        const distStr = q.res.d === 0 ? tUI('exactPinpoint') : tUI('offBy', { km: q.res.d });
        const ringNote = CURRENT_LANG === 'hi' ?
          `हरा बिंदु ${esc(T(q.res.name))} है। संकेंद्रीय वृत्त 50, 150, 300 और 500 किमी दूरी दर्शाते हैं।` :
          `The green dot is ${esc(T(q.res.name))}. Accuracy rings indicate 50, 150, 300, and 500 km radius.`;
        h += `<div class="card"><b>${distStr}</b> · +${q.res.pts} points<br><span class="small" style="color:#0369a1;font-weight:600">${ringBadge}</span><br><span class="small">${ringNote}</span></div><button class="pri" data-a="q:next">${q.i + 1 < q.rounds.length ? (CURRENT_LANG === 'hi' ? 'अगला स्तर →' : 'Next round →') : tUI('finalResults')}</button>`;
      } else if (q.guess) {
        const pinPlacedMsg = CURRENT_LANG === 'hi' ? '📍 <b>मानचित्र पर बिंदु चुना गया।</b><br><span class="small">बदलने के लिए दूसरा स्थान चुनें, या नीचे उत्तर की पुष्टि करें:</span>' : '📍 <b>Pin placed on map.</b><br><span class="small">Tap another spot on the map to adjust, or confirm your answer below:</span>';
        h += `<div class="quiz-provisional">${pinPlacedMsg}<br><button class="pri" data-a="q:confirm" style="margin-top:8px">${tUI('confirmGuess')}</button></div>`;
      } else {
        h += `<p class="small">${tUI('dropPin')}</p>`;
      }
      h += `<button class="sec" data-a="q:quit" style="margin-top:6px">${CURRENT_LANG === 'hi' ? 'छोड़ें' : 'Quit'}</button>`;
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
  { id: 0, slug: 'pataliputra', name: { en: 'Pataliputra (Patna)', hi: 'पाटलिपुत्र (पटना)' }, clue: { en: 'Imperial capital under Chandragupta Maurya and Ashoka, situated at the sacred confluence of the Ganga and Son rivers.', hi: 'चंद्रगुप्त मौर्य एवं अशोक की राजधानी, गंगा और सोन नदियों के पवित्र संगम पर स्थित।' } },
  { id: 1, slug: 'delhi', name: { en: 'Delhi (Dhillika)', hi: 'दिल्ली (ढिल्लिका)' }, clue: { en: 'Historic seat of the Sultanate and Mughal throne, site of seven fortified cities from Siri to Shahjahanabad.', hi: 'सल्तनत और मुग़ल तख्त की ऐतिहासिक गद्दी, सीरी से शाहजहानाबाद तक सात नगरों की भूमि।' } },
  { id: 10, slug: 'vijayanagara', name: { en: 'Vijayanagara (Hampi)', hi: 'विजयनगर (हम्पी)' }, clue: { en: 'Legendary City of Victory along the boulder-strewn banks of the Tungabhadra, founded by Harihara and Bukka.', hi: 'तुंगभद्रा के तट पर हरिहर और बुक्का द्वारा स्थापित ऐतिहासिक विजयनगर साम्राज्य की राजधानी।' } },
  { id: 6, slug: 'kannauj', name: { en: 'Kannauj (Kanyakubja)', hi: 'कन्नौज (कान्यकुब्ज)' }, clue: { en: 'Imperial seat of Emperor Harsha and the prized imperial citadel disputed in the Tripartite Struggle.', hi: 'हर्षवर्धन की राजधानी और पाल, प्रतिहार व राष्ट्रकूटों के त्रिपक्षीय संघर्ष का प्रमुख केंद्र।' } },
  { id: 9, slug: 'thanjavur', name: { en: 'Thanjavur (Tanjore)', hi: 'तंजावुर (तंज़ौर)' }, clue: { en: 'Imperial Chola capital renowned for the monumental granite Rajarajeshvara (Brihadisvara) temple of Rajaraja I.', hi: 'चोल साम्राज्य की राजधानी, राजराज प्रथम द्वारा निर्मित भव्य बृहदीश्वर मंदिर के लिए प्रसिद्ध।' } },
  { id: 20, slug: 'muziris', name: { en: 'Muziris (Kodungallur)', hi: 'मुज़िरिस (कोडंगलूर)' }, clue: { en: 'Legendary Sangam port on the Malabar Coast that loaded Roman fleets with black pepper and Malabar spices.', hi: 'मालाबार तट का संगमकालीन बंदरगाह जहाँ से रोम के लिए काली मिर्च और मसालों का निर्यात होता था।' } },
  { id: 4, slug: 'ujjayini', name: { en: 'Ujjayini (Ujjain)', hi: 'उज्जयिनी (उज्जैन)' }, clue: { en: 'Sacred prime meridian city of ancient Indian astronomers and capital of Avanti associated with King Vikramaditya.', hi: 'प्राचीन खगोलविदों की प्रधान मध्याह्न रेखा और अवंती की ऐतिहासिक राजधानी।' } },
  { id: 16, slug: 'nalanda', name: { en: 'Nalanda Mahavihara', hi: 'नालंदा महाविहार' }, clue: { en: 'Preeminent international Mahavihara and monastic university of ancient Magadha, patronized by the Guptas and Harsha.', hi: 'प्राचीन मगध का विश्वप्रसिद्ध बौद्ध महाविहार और विश्वविद्यालय, जिसे गुप्त और हर्ष का संरक्षण मिला।' } },
  { id: 28, slug: 'lothal', name: { en: 'Lothal', hi: 'लोथल' }, clue: { en: 'Bronze Age Harappan port on the Gulf of Khambhat featuring the world’s earliest engineered tidal dockyard.', hi: 'खंभात की खाड़ी पर स्थित कांस्ययुगीन हड़प्पा कालीन बंदरगाह, जहाँ विश्व की प्राचीनतम गोदी मिली है।' } },
  { id: 3, slug: 'taxila', name: { en: 'Taxila (Takshashila)', hi: 'तक्षशिला' }, clue: { en: 'Ancient Gandharan capital and intellectual crossroads of Vedic, Persian, and Hellenistic learning along the Uttarapatha.', hi: 'गांधार की प्राचीन राजधानी तथा उत्तरापथ पर वैदिक, पारसी और यूनानी ज्ञान का संगम स्थल।' } }
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
    const p = PL.find(x => x.id === item.id) ||
              PL.find(x => x.n && x.n.some(n => T(n[1]).toLowerCase().includes(item.slug))) ||
              PL[0];
    return { ...p, clue: item.clue, targetName: item.name };
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
  const displayName = t.targetName ? T(t.targetName) : T(t.n[0][1]);
  q.res = { d, pts, gl: q.guess.lon, ga: q.guess.lat, tl: t.lon, ta: t.lat, name: displayName };
  q.guess = null;
  drawOv();
  render();
}
