"use strict";

/* ---------- Phase 5: Sharing, Deep Linking, Embed & Image Export ---------- */

let syncTimer = null;
let isApplyingURL = false;

// 1. Parse and apply URL parameters on startup or popstate
function applyURLParams() {
  isApplyingURL = true;
  const p = new URLSearchParams(window.location.search);

  // Embed Mode
  if (p.get('embed') === '1' || p.get('embed') === 'true') {
    st.embed = true;
    document.body.classList.add('embed');
    if (!$('#embed-watermark')) {
      const wm = document.createElement('div');
      wm.id = 'embed-watermark';
      wm.className = 'embed-watermark';
      wm.innerHTML = '<a href="https://mendax-iitm.github.io/chronicles-of-india/" target="_blank" rel="noopener">Chronicles of India ↗</a>';
      $('#mapwrap')?.appendChild(wm);
    }
  }

  // Toggles
  if (p.has('corridors')) {
    st.corridors = p.get('corridors') !== '0' && p.get('corridors') !== 'false';
    $('#tgCorridors')?.classList.toggle('on', st.corridors);
    $('#corridors')?.setAttribute('display', st.corridors ? '' : 'none');
  }

  if (p.has('ghost')) {
    st.ghost = p.get('ghost') !== '0' && p.get('ghost') !== 'false';
    $('#tgGhost')?.classList.toggle('on', st.ghost);
  }

  if (p.get('xray') === '1' || p.get('xray') === 'true') {
    st.xray = true;
    $('#tgXray')?.classList.add('on');
    if (typeof drawModern === 'function') drawModern();
  }

  // Language
  if (p.get('lang') === 'hi' || p.get('lang') === 'en') {
    st.lang = p.get('lang');
  }

  // Year
  const yrParam = p.get('year');
  if (yrParam !== null) {
    const yr = parseInt(yrParam, 10);
    if (!isNaN(yr)) {
      setYear(yr);
    }
  }

  // Tab
  const tabParam = p.get('tab');
  if (['era', 'places', 'journeys', 'quiz'].includes(tabParam)) {
    st.tab = tabParam;
    if (typeof go === 'function') go(tabParam);
  }

  // Places (Single or Multi-Stop)
  const placeParam = p.get('place');
  if (placeParam) {
    const ids = placeParam.split(',').map(s => s.trim().toLowerCase());
    const matched = [];
    ids.forEach(id => {
      const idx = PL.findIndex(x => {
        if (String(x.id).toLowerCase() === id) return true;
        return x.n && x.n.some(n => {
          const nameStr = T(n[1]).toLowerCase();
          return nameStr === id || nameStr.replace(/[^a-z0-9]+/g, '-') === id || nameStr.includes(id);
        });
      });
      if (idx >= 0 && !matched.includes(idx)) matched.push(idx);
    });
    if (matched.length > 0) {
      st.selPlaces = matched;
      st.selPlace = matched[0];
      st.tab = 'places';
      if (typeof go === 'function') go('places');
      const p0 = PL[matched[0]];
      if (p0 && typeof flyTo === 'function') flyTo(p0.lon, p0.lat, Math.min(vb.w, W / 2.5));
    }
  }

  // Person / Journey
  const personParam = p.get('person') || p.get('journey');
  if (personParam) {
    const q = personParam.toLowerCase();
    const idx = JR.findIndex((j, i) => {
      if (String(j.id) === q || String(i) === q) return true;
      const nStr = T(j.n).toLowerCase();
      const whoStr = T(j.who).toLowerCase();
      return nStr.includes(q) || whoStr.includes(q) || whoStr.replace(/[^a-z0-9]+/g, '-').includes(q);
    });
    if (idx >= 0) {
      st.jr = idx;
      st.tab = 'journeys';
      if (typeof go === 'function') go('journeys');
      if (typeof act === 'function') act('jr:' + idx);
    }
  }

  // Polity
  const polityParam = p.get('polity');
  if (polityParam) {
    const q = polityParam.toLowerCase();
    const s = SN[st.si];
    if (s && s.pol) {
      const pIdx = s.pol.findIndex((pol, i) => String(i) === q || T(pol.n).toLowerCase().includes(q));
      if (pIdx >= 0) {
        st.selPol = pIdx;
        if (typeof drawPols === 'function') drawPols();
        if (typeof render === 'function') render(true);
      }
    }
  }

  // Quiz
  if (p.get('quiz') === '1' || p.get('quiz') === 'true') {
    st.tab = 'quiz';
    if (typeof go === 'function') go('quiz');
    if (typeof startQuiz === 'function') startQuiz();
  }

  isApplyingURL = false;
}

function getPlaceSlug(idx) {
  const p = PL[idx];
  if (!p) return '';
  return p.n && p.n[0] ? T(p.n[0][1]).toLowerCase().replace(/[^a-z0-9]+/g, '-') : String(p.id);
}

function getJourneySlug(idx) {
  const j = JR[idx];
  if (!j) return '';
  const who = T(j.who).toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return who || String(j.id);
}

// 2. Synchronize current state to URL query string
function syncURL() {
  if (isApplyingURL) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    try {
      const p = new URLSearchParams();
      // Year
      p.set('year', st.year);

      // Tab
      if (st.tab && st.tab !== 'era') p.set('tab', st.tab);

      // Places (Single or Multi-Stop)
      if (st.selPlaces && st.selPlaces.length > 1) {
        p.set('place', st.selPlaces.map(idx => getPlaceSlug(idx)).join(','));
      } else if (st.selPlace >= 0 && PL[st.selPlace]) {
        p.set('place', getPlaceSlug(st.selPlace));
      }

      // Person / Journey
      if (st.jr >= 0 && JR[st.jr]) {
        p.set('person', getJourneySlug(st.jr));
      }

      // Polity
      if (st.selPol >= 0) {
        const s = SN[st.si];
        if (s && s.pol[st.selPol]) {
          p.set('polity', T(s.pol[st.selPol].n));
        }
      }

      // Quiz
      if (st.quiz && st.quiz.on) p.set('quiz', '1');

      // Toggles
      if (st.xray) p.set('xray', '1');
      if (!st.corridors) p.set('corridors', '0');
      if (!st.ghost) p.set('ghost', '0');
      if (st.embed) p.set('embed', '1');
      if (st.lang && st.lang !== 'en') p.set('lang', st.lang);

      const qs = p.toString();
      const newUrl = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
      if (window.location.search !== (qs ? '?' + qs : '')) {
        window.history.replaceState({ year: st.year, tab: st.tab }, '', newUrl);
      }
    } catch {
      // Cross-origin or restricted file:// contexts
    }
  }, 150);
}

// 3. Share Modal & Link Generator
function getDeepLink() {
  const p = new URLSearchParams();
  p.set('year', st.year);
  if (st.tab && st.tab !== 'era') p.set('tab', st.tab);
  if (st.selPlaces && st.selPlaces.length > 1) {
    p.set('place', st.selPlaces.map(idx => getPlaceSlug(idx)).join(','));
  } else if (st.selPlace >= 0 && PL[st.selPlace]) {
    p.set('place', getPlaceSlug(st.selPlace));
  }
  if (st.jr >= 0 && JR[st.jr]) p.set('person', getJourneySlug(st.jr));
  if (st.selPol >= 0 && SN[st.si]?.pol[st.selPol]) p.set('polity', T(SN[st.si].pol[st.selPol].n));
  if (st.quiz?.on) p.set('quiz', '1');
  if (st.xray) p.set('xray', '1');

  const base = window.location.origin + window.location.pathname;
  return base + (p.toString() ? '?' + p.toString() : '');
}

function getEmbedCode() {
  const deep = getDeepLink();
  const embedUrl = deep + (deep.includes('?') ? '&embed=1' : '?embed=1');
  return `<iframe src="${embedUrl}" width="800" height="600" style="width:100%;max-width:960px;height:600px;border:1px solid #cbd5e1;border-radius:8px;" frameborder="0" allowfullscreen title="Chronicles of India Historical Map"></iframe>`;
}

function openShareModal() {
  const modal = $('#share-modal');
  if (!modal) return;
  const link = getDeepLink();
  const embed = getEmbedCode();

  const urlInput = $('#shareUrlInput');
  const embedInput = $('#embedCodeInput');
  if (urlInput) urlInput.value = link;
  if (embedInput) embedInput.value = embed;

  modal.style.display = 'flex';
  urlInput?.select();
}

function closeShareModal() {
  const modal = $('#share-modal');
  if (modal) modal.style.display = 'none';
}

// 4. Image Export (PNG & SVG)
function getSvgExportString() {
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', '1600');
  clone.setAttribute('height', '1200');

  // Embed essential styles for standalone SVG / canvas rendering
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .land { fill: #f3efe6; stroke: #c8b99d; stroke-width: 1px; }
    .pol { fill-rule: evenodd; stroke: #2c251d; stroke-width: 1.2px; opacity: 0.72; }
    .pol.ghost { stroke-dasharray: 4 3; opacity: 0.35; fill: none; }
    .plab { font: 700 13px system-ui, sans-serif; fill: #1e293b; paint-order: stroke; stroke: #fff; stroke-width: 2.5px; text-anchor: middle; }
    .pname { font: 600 11px system-ui, sans-serif; fill: #0f172a; paint-order: stroke; stroke: #fff; stroke-width: 2.2px; }
    .geo { font: italic 11px Georgia, serif; fill: #64748b; text-anchor: middle; }
    .corridor-path { fill: none; stroke: #c2410c; stroke-width: 1.6; stroke-dasharray: 5 3; }
    .route-arc { fill: none; stroke: #0b2a5b; stroke-width: 2.4; stroke-dasharray: 6 3; }
    .modern-country { stroke: #be123c; stroke-width: 1.4; stroke-dasharray: 4 3; fill: none; }
    .modern-state { stroke: #475569; stroke-width: 0.85; stroke-dasharray: 2 2; fill: none; }
    .modern-label { font: 600 8.5px system-ui, sans-serif; fill: #1e293b; paint-order: stroke; stroke: #fff; stroke-width: 2px; text-anchor: middle; }
  `;
  clone.insertBefore(styleEl, clone.firstChild);

  return new XMLSerializer().serializeToString(clone);
}

function exportSVG() {
  const svgStr = getSvgExportString();
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chronicles-of-india-${st.year}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportPNG() {
  const btn = $('#exportPngBtn');
  const origText = btn ? btn.innerHTML : '';
  if (btn) btn.innerHTML = '<span>⏳</span> Generating image...';

  const svgStr = getSvgExportString();
  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const w = 2400, h = 1600;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      // Ocean tint background
      ctx.fillStyle = '#d9e8f5';
      ctx.fillRect(0, 0, w, h);

      // Draw SVG map
      ctx.drawImage(img, 0, 0, w, h);

      // Header Banner Title Card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.fillRect(40, 40, 720, 150);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(40, 40, 720, 150);

      ctx.fillStyle = '#0b2a5b';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.fillText('Chronicles of India', 65, 88);

      const s = SN[st.si];
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 24px system-ui, sans-serif';
      const eraTitle = s ? T(s.title) : '';
      ctx.fillText(`${eraTitle} · ${fy(st.year)}`, 65, 128);

      ctx.fillStyle = '#64748b';
      ctx.font = '16px system-ui, sans-serif';
      let activeDetail = s ? T(s.summary).slice(0, 75) + '...' : '';
      if (st.selPlace >= 0 && PL[st.selPlace]) {
        activeDetail = `Place: ${T(PL[st.selPlace].n[0][1])} (${PL[st.selPlace].id})`;
      } else if (st.jr >= 0 && JR[st.jr]) {
        activeDetail = `Journey: ${T(JR[st.jr].n)} (${T(JR[st.jr].who)})`;
      }
      ctx.fillText(activeDetail, 65, 162);

      // Bottom Attribution & License
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      ctx.fillRect(40, h - 70, w - 80, 40);
      ctx.strokeStyle = '#e2e8f0';
      ctx.strokeRect(40, h - 70, w - 80, 40);

      ctx.fillStyle = '#475569';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Chronicles of India — Interactive Historical Atlas (600 BCE – 1947 CE) · CC BY-SA 4.0 · mendax-iitm.github.io/chronicles-of-india', 65, h - 45);

      canvas.toBlob(pngBlob => {
        if (!pngBlob) {
          exportSVG();
          return;
        }
        const pngUrl = URL.createObjectURL(pngBlob);
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `chronicles-of-india-${st.year}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
        if (btn) btn.innerHTML = origText;
      }, 'image/png');
    } catch {
      // Fallback to SVG if canvas was tainted
      exportSVG();
      if (btn) btn.innerHTML = origText;
    }
    URL.revokeObjectURL(url);
  };
  img.onerror = () => {
    exportSVG();
    URL.revokeObjectURL(url);
    if (btn) btn.innerHTML = origText;
  };
  img.src = url;
}

// 5. Initialize Share & Modal Listeners
function initShare() {
  applyURLParams();

  $('#shareBtn')?.addEventListener('click', openShareModal);
  $('#shareClose')?.addEventListener('click', closeShareModal);
  $('#share-modal')?.addEventListener('click', e => {
    if (e.target.id === 'share-modal') closeShareModal();
  });

  $('#copyShareBtn')?.addEventListener('click', () => {
    const input = $('#shareUrlInput');
    if (!input) return;
    navigator.clipboard?.writeText(input.value).then(() => {
      const btn = $('#copyShareBtn');
      const old = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = old; }, 2000);
    }).catch(() => {
      input.select();
      document.execCommand('copy');
    });
  });

  $('#copyEmbedBtn')?.addEventListener('click', () => {
    const input = $('#embedCodeInput');
    if (!input) return;
    navigator.clipboard?.writeText(input.value).then(() => {
      const btn = $('#copyEmbedBtn');
      const old = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = old; }, 2000);
    }).catch(() => {
      input.select();
      document.execCommand('copy');
    });
  });

  $('#exportPngBtn')?.addEventListener('click', exportPNG);
  $('#exportSvgBtn')?.addEventListener('click', exportSVG);

  window.addEventListener('popstate', () => {
    applyURLParams();
  });
}
