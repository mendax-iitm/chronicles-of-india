"use strict";

const K = 22, XF = 0.93, W = 860, H = 770;
const PROJ = /[?&]proj=equirect/.test(location.search) ? 'equirect' : 'lcc';

const LCC = (() => {
  const r = Math.PI / 180;
  const t = f => Math.tan(Math.PI / 4 + f * r / 2);
  const n = Math.log(Math.cos(15 * r) / Math.cos(31 * r)) / Math.log(t(31) / t(15));
  const F = Math.cos(15 * r) * (t(15) ** n) / n;
  const r0 = F / (t(23) ** n);
  const S = K / r;
  const X0 = (80 - 58) * K * XF;
  const Y0 = (39 - 23) * K;
  return {
    fwd: (lon, lat) => {
      const p = F / (t(lat) ** n);
      const th = n * (lon - 80) * r;
      return [X0 + S * p * Math.sin(th), Y0 - S * (r0 - p * Math.cos(th))];
    },
    inv: (x, y) => {
      const a = (x - X0) / S, b = r0 - (Y0 - y) / S, p = Math.hypot(a, b);
      return [80 + Math.atan2(a, b) / n / r, (2 * Math.atan((F / p) ** (1 / n)) - Math.PI / 2) / r];
    }
  };
})();

const XY = PROJ === 'lcc' ? LCC.fwd : (lon, lat) => [(lon - 58) * K * XF, (39 - lat) * K];
const invXY = PROJ === 'lcc' ? LCC.inv : (x, y) => [58 + x / (K * XF), 39 - y / K];
const px = (lon, lat) => XY(lon, lat)[0];
const py = (lon, lat) => XY(lon, lat)[1];

function toLonLat(clientX, clientY) {
  const mapEl = typeof svg !== 'undefined' && svg ? svg : $('#map');
  const r = mapEl.getBoundingClientRect();
  const sx = vb.x + (clientX - r.left) * (vb.w / r.width);
  const sy = vb.y + (clientY - r.top) * (vb.h / r.height);
  return invXY(sx, sy);
}

const ptsStr = a => a.map(p => {
  const q = XY(p[0], p[1]);
  return q[0].toFixed(1) + ',' + q[1].toFixed(1);
}).join(' ');

function cen(poly) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[(i + 1) % poly.length], f = x0 * y1 - x1 * y0;
    a += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  a /= 2;
  return { a: Math.abs(a), x: cx / (6 * a), y: cy / (6 * a) };
}

const hav = (a, b, c, d) => {
  const R = 6371, r = Math.PI / 180, dl = (c - a) * r, dp = (d - b) * r;
  const x = Math.sin(dp / 2) ** 2 + Math.cos(b * r) * Math.cos(d * r) * Math.sin(dl / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

const $ = s => document.querySelector(s);
const fy = y => {
  if (typeof CURRENT_LANG !== 'undefined' && CURRENT_LANG === 'hi') {
    return (y < 0 ? (-y) + ' ' + (typeof tUI === 'function' ? tUI('bce') : 'ई.पू.') : y + ' ' + (typeof tUI === 'function' ? tUI('ce') : 'ईस्वी'));
  }
  return (y < 0 ? (-y) + ' BCE' : y + ' CE');
};
const rg = s => (s.from === s.to ? fy(s.from) : fy(s.from) + ' – ' + fy(s.to));
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let CURRENT_LANG = 'en';
const T = s => {
  if (!s) return '';
  if (typeof s === 'string') return s;
  return s[CURRENT_LANG] || s.en || Object.values(s)[0] || '';
};
