"use strict";

let hovPol = -1;
const lineD = r => 'M' + ptsStr(r).replace(/ /g, 'L');
const ringsD = rs => rs.map(r => lineD(r) + 'Z').join('');

function drawWaterways() {
  const y = st.year;
  const visRivers = B.rivers.filter(r => (r.appear == null || r.appear <= y) && (r.vanish == null || y <= r.vanish));
  $('#rivers').innerHTML = visRivers.map(r => `<path class="river${r.rank ? ' big' : ''}" d="${r.line.map(lineD).join('')}"/>`).join('');
}

function drawCorridors() {
  const g = $('#corridors');
  if (!g) return;
  if (!st.corridors) {
    g.innerHTML = '';
    return;
  }
  const y = st.year;
  const vis = (window.ATLAS_CORRIDORS || []).filter(c => c.from <= y && y <= c.to);
  g.innerHTML = vis.map(c => {
    const pts = c.coords.map(pt => px(pt[0], pt[1]).toFixed(1) + ',' + py(pt[0], pt[1]).toFixed(1)).join(' ');
    const cls = `corridor ${c.type}`;
    return `<polyline class="${cls}" points="${pts}" stroke="${c.color || '#d97706'}" data-cor="${c.id}"><title>${esc(T(c.name))}</title></polyline>`;
  }).join('');
}

function drawModern() {
  const g = $('#modern');
  if (!g) return;
  if (!st.xray) {
    g.innerHTML = '';
    return;
  }
  const M = window.ATLAS_MODERN;
  if (!M) return;
  const cPaths = (M.countryLines || []).map(l => `<path class="modern-country" d="${lineD(l)}"/>`).join('');
  const sPaths = (M.stateLines || []).map(l => `<path class="modern-state" d="${lineD(l)}"/>`).join('');
  const labels = (M.labels || []).map(l => {
    return glyph(`<text class="modern-label ${l.type}">${esc(T(l.name))}</text>`, l.at[0], l.at[1], 'pointer-events="none"');
  }).join('');
  g.innerHTML = cPaths + sPaths + labels;
}

function initStaticLayers() {
  const landD = ringsD([B.coast, ...B.islands.map(i => i.poly)]);
  $('#land').setAttribute('d', landD);
  $('#clipPoly').setAttribute('d', landD);
  $('#lakes').innerHTML = B.lakes.map(l => `<path class="lake" d="${ringsD([l.poly])}"/>`).join('');
  if (!window.ATLAS_BASE) $('.note').textContent = 'Base map failed to load. ' + $('.note').textContent;
  $('#relief').innerHTML = B.relief.map(r => `<polygon class="relief${r.name === 'Thar' ? ' desert' : ''}" points="${ptsStr(r.poly)}"/>`).join('');
  drawWaterways();
  drawCorridors();
  drawModern();
  $('#pols').setAttribute('clip-path', 'url(#clipLand)');

  const tgCor = $('#tgCorridors');
  if (tgCor) {
    tgCor.onclick = () => {
      st.corridors = !st.corridors;
      tgCor.classList.toggle('on', st.corridors);
      drawCorridors();
    };
  }

  const tgXray = $('#tgXray');
  if (tgXray) {
    tgXray.onclick = () => {
      st.xray = !st.xray;
      tgXray.classList.toggle('on', st.xray);
      drawModern();
    };
  }

  // Terrain hillshade lazy load
  (window.requestIdleCallback || setTimeout)(() => {
    const basePath = location.pathname.includes('/dist/') ? '../' : '';
    const s = document.createElement('script');
    s.src = basePath + 'data/terrain/manifest.js';
    s.onload = () => {
      const m = window.ATLAS_TERRAIN;
      if (!m || m.projection !== PROJ) return;
      const [x0, y0, x1, y1] = m.extent, tw = (x1 - x0) / m.cols, th = (y1 - y0) / m.rows;
      let h = '';
      for (let r = 0; r < m.rows; r++) {
        for (let c = 0; c < m.cols; c++) {
          h += `<image href="${basePath}data/terrain/${m.tile.replace('{r}', r).replace('{c}', c)}" x="${x0 + c * tw}" y="${y0 + r * th}" width="${tw}" height="${th}" preserveAspectRatio="none" onerror="this.remove()"/>`;
        }
      }
      const g = $('#terrain');
      g.innerHTML = h;
      requestAnimationFrame(() => g.classList.add('on'));
    };
    document.head.appendChild(s);
  });

  // ?debug=atoms overlay
  if (/[?&]debug=atoms/.test(location.search)) {
    document.body.classList.add('dbg');
    const ids = Object.keys(ATOMS);
    $('#world').insertAdjacentHTML('beforeend',
      '<g clip-path="url(#clipLand)">' + ids.map((k, i) => `<polygon points="${AP[k]}" fill="hsl(${i * 137 % 360} 60% 60%)" fill-opacity=".45" stroke="#333" stroke-width=".6"/>`).join('') + '</g>' +
      ids.map(k => {
        const c = cen(ATOMS[k]);
        return `<text x="${px(c.x, c.y).toFixed(1)}" y="${py(c.x, c.y).toFixed(1)}" font-size="7" text-anchor="middle" fill="#111" style="paint-order:stroke;stroke:#fff;stroke-width:2px">${k}</text>`;
      }).join('')
    );
  }
}

function zoomToPol(i) {
  const s = SN[st.si];
  if (!s || !s.pol[i]) return;
  const p = s.pol[i];
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  p.atoms.forEach(k => {
    (ATOMS[k] || []).forEach(pt => {
      x0 = Math.min(x0, pt[0]); x1 = Math.max(x1, pt[0]);
      y0 = Math.min(y0, pt[1]); y1 = Math.max(y1, pt[1]);
    });
  });
  if (x0 <= x1 && y0 <= y1) {
    const r = svg.getBoundingClientRect();
    const w = Math.max((x1 - x0) * K * XF * 1.3, (y1 - y0) * K * 1.3 * r.width / r.height, W / 6);
    flyTo((x0 + x1) / 2, (y0 + y1) / 2, w);
  }
}

function drawPols() {
  const s = SN[st.si];
  let h = '';
  if (!st.quiz.on) {
    if (st.ghost && st.si > 0) {
      const prev = SN[st.si - 1];
      for (const k in prev.owner) {
        if (prev.owner[k] !== s.owner[k]) h += `<polygon class="ghost" points="${AP[k]}"/>`;
      }
    }
    s.pol.forEach((p, i) => p.atoms.forEach(k => {
      h += `<polygon class="pol${i === st.selPol ? ' sel' : ''}" data-pi="${i}" points="${AP[k]}" fill="${p.c}"/>`;
    }));
  }
  $('#pols').innerHTML = h;
}

function glyph(inner, lon, lat, attrs) {
  const s = scl();
  return `<g transform="translate(${px(lon, lat).toFixed(1)} ${py(lon, lat).toFixed(1)}) scale(${(1 / s).toFixed(4)})" ${attrs || ''}>${inner}</g>`;
}

function nameAt(p, y) {
  let c = null;
  for (const n of p.n) if (n[0] <= y) c = n;
  return c;
}

function wrap(n) {
  const str = String(n || '');
  if (str.length <= 13 || str.indexOf(' ') < 0) return [str];
  const m = str.length / 2;
  let b = -1, bd = 99;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ' && Math.abs(i - m) < bd) {
      bd = Math.abs(i - m);
      b = i;
    }
  }
  return [str.slice(0, b), str.slice(b + 1)];
}

function drawOv() {
  let h = '';
  const q = st.quiz, s = SN[st.si], y = st.year;
  GEO.forEach(g => {
    if (!(g[3] > scl())) {
      h += glyph(`<text class="geo">${esc(T(g[0]))}</text>`, g[1], g[2], 'pointer-events="none"');
    }
  });

  if (scl() > 1.6) {
    B.rivers.forEach(r => {
      h += glyph(`<text class="geo" style="fill:#4f86b3">${esc(T(r.name))}</text>`, r.label[0], r.label[1], 'pointer-events="none"');
    });
  }

  if (!q.on) {
    const sc = scl(), boxes = [];
    const free = (x, y, w, hh) => {
      for (const b of boxes) {
        if (x < b[0] + b[2] && x + w > b[0] && y < b[1] + b[3] && y + hh > b[1]) return false;
      }
      boxes.push([x, y, w, hh]);
      return true;
    };

    s.pol.slice().sort((a, b) => b.area - a.area).forEach(p => {
      if (p.area < 4.5) return;
      const pName = T(p.n);
      const ls = wrap(pName);
      const w = Math.max(...ls.map(t => t.length)) * 6.4 + 6, hh = ls.length * 12 + 4;
      if (!free(px(p.lon, p.lat) * sc - w / 2, py(p.lon, p.lat) * sc - hh / 2, w, hh)) return;
      h += glyph(`<text class="plab">${ls.map((t, i) => `<tspan x="0" dy="${i ? 12 : (ls.length > 1 ? -3 : 4)}">${esc(t)}</tspan>`).join('')}</text>`, p.lon, p.lat, 'pointer-events="none"');
    });

    const isPlaceActive = (p, idx) => (st.selPlace === idx) || (st.selPlaces && st.selPlaces.includes(idx));
    const pls = PL.filter(p => nameAt(p, y)).sort((a, b) => isPlaceActive(b, PL.indexOf(b)) - isPlaceActive(a, PL.indexOf(a)));
    pls.forEach(p => {
      const idx = PL.indexOf(p);
      const c = nameAt(p, y), on = isPlaceActive(p, idx);
      const cName = T(c[1]);
      const w = cName.length * 6.6 + 4;
      const lab = free(px(p.lon, p.lat) * sc + 8, py(p.lon, p.lat) * sc - 8, w, 16) || on;
      h += glyph(`<circle r="${on ? 7 : 5}" fill="${on ? '#c98a00' : '#0b2a5b'}" stroke="#fff" stroke-width="2"/>${lab ? `<text class="pname" x="9" y="4">${esc(cName)}</text>` : ''}`, p.lon, p.lat, `data-k="p:${idx}"`);
    });

    EV.forEach(e => {
      if (Math.abs(e.y - y) > 30 && e.id !== st.selEv) return;
      h += glyph('<path d="M0,-8 L8,0 L0,8 L-8,0Z" fill="#e9a400" stroke="#fff" stroke-width="2"/>', e.lon, e.lat, `data-k="e:${e.id}"`);
    });

    if (st.jr >= 0 && JR[st.jr]) {
      const j = JR[st.jr];
      j.s.forEach((p, i) => {
        const done = y >= p[3];
        h += glyph(`<circle r="10" fill="${done ? '#0b2a5b' : '#fff'}" stroke="#0b2a5b" stroke-width="2"/><text y="4" text-anchor="middle" font-size="11" font-weight="700" fill="${done ? '#fff' : '#0b2a5b'}">${i + 1}</text>`, p[1], p[2], `data-k="j:${i}"`);
      });
    }

    if (st.cmpJr >= 0 && JR[st.cmpJr]) {
      const cj = JR[st.cmpJr];
      cj.s.forEach((p, i) => {
        const done = y >= p[3];
        h += glyph(`<circle r="10" fill="${done ? '#b42318' : '#fff'}" stroke="#b42318" stroke-width="2"/><text y="4" text-anchor="middle" font-size="11" font-weight="700" fill="${done ? '#fff' : '#b42318'}">${i + 1}</text>`, p[1], p[2], `data-k="cj:${i}"`);
      });
    }
  } else {
    if (q.guess && !q.res) {
      h += glyph('<circle r="12" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 3"/><circle r="5" fill="#2563eb" stroke="#fff" stroke-width="2"/>', q.guess.lon, q.guess.lat, 'pointer-events="none"');
    }
    if (q.res) {
      const rKm = km => (km / 111.3) * K;
      h += `<circle cx="${px(q.res.tl, q.res.ta).toFixed(1)}" cy="${py(q.res.tl, q.res.ta).toFixed(1)}" r="${rKm(50).toFixed(1)}" class="accuracy-ring r50"/>`;
      h += `<circle cx="${px(q.res.tl, q.res.ta).toFixed(1)}" cy="${py(q.res.tl, q.res.ta).toFixed(1)}" r="${rKm(150).toFixed(1)}" class="accuracy-ring r150"/>`;
      h += `<circle cx="${px(q.res.tl, q.res.ta).toFixed(1)}" cy="${py(q.res.tl, q.res.ta).toFixed(1)}" r="${rKm(300).toFixed(1)}" class="accuracy-ring r300"/>`;
      h += `<circle cx="${px(q.res.tl, q.res.ta).toFixed(1)}" cy="${py(q.res.tl, q.res.ta).toFixed(1)}" r="${rKm(500).toFixed(1)}" class="accuracy-ring r500"/>`;
      h += `<line x1="${px(q.res.gl, q.res.ga).toFixed(1)}" y1="${py(q.res.gl, q.res.ga).toFixed(1)}" x2="${px(q.res.tl, q.res.ta).toFixed(1)}" y2="${py(q.res.tl, q.res.ta).toFixed(1)}" class="route" stroke="#b42318"/>`;
      h += glyph('<circle r="7" fill="#0b2a5b" stroke="#fff" stroke-width="2"/>', q.res.gl, q.res.ga, 'pointer-events="none"');
      h += glyph(`<circle r="8" fill="#1a8f4c" stroke="#fff" stroke-width="2"/><text class="pname" x="11" y="4">${esc(T(q.res.name))}</text>`, q.res.tl, q.res.ta, 'pointer-events="none"');
    }
  }
  $('#ov').innerHTML = h;
}

function renderJourneyRoute(stops, isSecondary) {
  if (!stops || stops.length < 2) return '';
  let h = '';
  for (let i = 0; i < stops.length - 1; i++) {
    const s0 = stops[i], s1 = stops[i + 1];
    const x0 = px(s0[1], s0[2]), y0 = py(s0[1], s0[2]);
    const x1 = px(s1[1], s1[2]), y1 = py(s1[1], s1[2]);
    const dx = x1 - x0, dy = y1 - y0;
    const d = Math.hypot(dx, dy);
    if (d < 1) continue;
    const nx = -dy / d, ny = dx / d;
    const bend = Math.min(22, d * 0.08);
    const cx = (x0 + x1) / 2 + nx * bend;
    const cy = (y0 + y1) / 2 + ny * bend;
    const cls = isSecondary ? 'route-arc secondary' : 'route-arc';
    h += `<path class="${cls}" d="M ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}"/>`;
    
    // Directional chevron tick at midpoint
    const mx = 0.25 * x0 + 0.5 * cx + 0.25 * x1;
    const my = 0.25 * y0 + 0.5 * cy + 0.25 * y1;
    const tx = x1 - x0, ty = y1 - y0;
    const tl = Math.hypot(tx, ty);
    const ux = tx / tl, uy = ty / tl;
    const unx = -uy, uny = ux;
    const pTip = [mx + ux * 5, my + uy * 5];
    const pL = [mx - ux * 4 + unx * 3.5, my - uy * 4 + uny * 3.5];
    const pR = [mx - ux * 4 - unx * 3.5, my - uy * 4 - uny * 3.5];
    const tickCls = isSecondary ? 'route-tick secondary' : 'route-tick';
    h += `<polygon class="${tickCls}" points="${pTip[0].toFixed(1)},${pTip[1].toFixed(1)} ${pL[0].toFixed(1)},${pL[1].toFixed(1)} ${pR[0].toFixed(1)},${pR[1].toFixed(1)}"/>`;
  }
  return h;
}

function drawRoute() {
  const g = $('#route');
  if (!g) return;
  if (st.quiz.on) { g.innerHTML = ''; return; }
  let h = '';
  if (st.jr >= 0 && JR[st.jr]) {
    h += renderJourneyRoute(JR[st.jr].s, false);
  }
  if (st.cmpJr >= 0 && JR[st.cmpJr]) {
    h += renderJourneyRoute(JR[st.cmpJr].s, true);
  }
  g.innerHTML = h;
}

function setHov(i) {
  if (i === hovPol) return;
  document.querySelectorAll('.pol.hov').forEach(n => n.classList.remove('hov'));
  document.querySelectorAll('#content li[data-a^="pol:"].hov').forEach(n => n.classList.remove('hov'));
  hovPol = i;
  if (i >= 0) {
    document.querySelectorAll(`.pol[data-pi="${i}"]`).forEach(n => n.classList.add('hov'));
    const li = document.querySelector(`#content li[data-a="pol:${i}"]`);
    if (li) li.classList.add('hov');
  }
}

function tip(t, e) {
  const el = $('#tip');
  if (!t) { el.style.display = 'none'; return; }
  const r = $('#mapwrap').getBoundingClientRect();
  el.innerHTML = t;
  el.style.display = 'block';
  el.style.left = Math.min(e.clientX - r.left + 12, r.width - el.offsetWidth - 6) + 'px';
  el.style.top = Math.max(e.clientY - r.top - el.offsetHeight - 10, 4) + 'px';
}
