// SEO, Sitemap, and Per-Period Static Landing Pages Generator
// Usage: node scripts/build-seo.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const BASE_URL = 'https://mendax-iitm.github.io/chronicles-of-india';

const snapshots = JSON.parse(readFileSync('data/snapshots.json', 'utf8'));
const places = JSON.parse(readFileSync('data/places.json', 'utf8'));
const events = JSON.parse(readFileSync('data/events.json', 'utf8'));
const rulers = JSON.parse(readFileSync('data/rulers.json', 'utf8'));
const journeys = JSON.parse(readFileSync('data/journeys.json', 'utf8'));

mkdirSync('periods', { recursive: true });

function fy(y) {
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 1. Generate Per-Period Landing Pages
const periodLinks = [];

snapshots.forEach(s => {
  const titleEn = s.title?.en || s.title;
  const titleHi = s.title?.hi || '';
  const repEn = s.representative?.en || s.representative || `${fy(s.from)}–${fy(s.to)}`;
  const summaryEn = s.summary?.en || s.summary || '';
  const summaryHi = s.summary?.hi || '';
  
  // Find rulers active in this snapshot
  const activeRulers = rulers.filter(r => r.reign && r.reign[0] <= s.to && r.reign[1] >= s.from);
  
  // Find events in this snapshot range
  const eraEvents = events.filter(e => e.y >= s.from && e.y <= s.to).sort((a, b) => a.y - b.y);

  // Polities list
  const politiesList = (s.polities || []).map(p => {
    const pName = p.name?.en || p.name;
    const pNote = p.note?.en || p.note || '';
    return `<li><b>${esc(pName)}</b>: ${esc(pNote)}</li>`;
  }).join('\n      ');

  const rulersList = activeRulers.slice(0, 10).map(r => {
    const rName = r.name?.en || r.name;
    const rDyn = r.dynasty_name?.en || r.dynasty;
    return `<li><b>${esc(rName)}</b> (${esc(rDyn)}) · <i>${fy(r.reign[0])}–${fy(r.reign[1])}</i></li>`;
  }).join('\n      ');

  const eventsList = eraEvents.slice(0, 8).map(e => {
    const eTitle = e.t?.en || e.t;
    const eDesc = e.d?.en || e.d;
    return `<li><b>${fy(e.y)}</b> — <b>${esc(eTitle)}</b>: ${esc(eDesc)}</li>`;
  }).join('\n      ');

  const pageHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titleEn)} (${esc(repEn)}) — Chronicles of India Historical Atlas</title>
<meta name="description" content="${esc(summaryEn)}">
<link rel="canonical" href="${BASE_URL}/periods/${s.id}.html">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="article">
<meta property="og:url" content="${BASE_URL}/periods/${s.id}.html">
<meta property="og:title" content="${esc(titleEn)} (${esc(repEn)}) — Chronicles of India">
<meta property="og:description" content="${esc(summaryEn)}">
<meta property="og:site_name" content="Chronicles of India">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titleEn)} (${esc(repEn)})">
<meta name="twitter:description" content="${esc(summaryEn)}">

<!-- Structured Data (JSON-LD) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HistoricalPeriod",
  "name": "${esc(titleEn)}",
  "alternateName": "${esc(titleHi)}",
  "startDate": "${s.from}",
  "endDate": "${s.to}",
  "description": "${esc(summaryEn)}"
}
</script>

<style>
  :root { --ink: #1f2937; --bg: #fdfbf7; --navy: #0b2a5b; --gold: #b45309; --line: #e2e8f0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif; line-height: 1.6; color: var(--ink); background: var(--bg); max-width: 820px; margin: 0 auto; padding: 24px 20px; }
  header { border-bottom: 2px solid var(--line); padding-bottom: 16px; margin-bottom: 24px; }
  h1 { font: 700 28px Georgia, serif; color: var(--navy); margin: 0 0 4px 0; }
  .hi-title { font-size: 20px; color: var(--gold); margin-bottom: 8px; }
  .span-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 3px 10px; border-radius: 9999px; font-weight: 600; font-size: 13px; }
  .summary { font-size: 17px; color: #334155; line-height: 1.55; margin: 18px 0; }
  .cta-box { background: #fff; border: 1.5px solid var(--gold); border-radius: 8px; padding: 18px; text-align: center; margin: 24px 0; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
  .launch-btn { display: inline-block; background: var(--navy); color: #fff; text-decoration: none; padding: 10px 22px; border-radius: 6px; font-weight: 700; font-size: 15px; }
  .launch-btn:hover { background: #173f7a; }
  h2 { font: 700 20px Georgia, serif; color: var(--navy); margin-top: 24px; border-bottom: 1px solid var(--line); padding-bottom: 6px; }
  ul { padding-left: 20px; }
  li { margin-bottom: 8px; }
  footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid var(--line); font-size: 13px; color: #64748b; }
</style>
<script>
  // Redirect human visitors to the interactive atlas at this year
  if (!window.location.search.includes('no-redirect') && !window.location.hash.includes('preview')) {
    window.location.replace('../?year=${s.from}');
  }
</script>
</head>
<body>
<header>
  <a href="../" style="text-decoration:none;font-weight:700;color:var(--navy);font-size:14px;">← Chronicles of India Atlas</a>
  <h1 style="margin-top:12px">${esc(titleEn)}</h1>
  ${titleHi ? `<div class="hi-title">${esc(titleHi)}</div>` : ''}
  <div><span class="span-badge">${esc(repEn)} · Span: ${fy(s.from)} to ${fy(s.to)}</span></div>
</header>

<div class="summary">${esc(summaryEn)}</div>

<div class="cta-box">
  <p style="margin:0 0 10px 0;font-weight:600">Explore this era with territory maps, boundaries, cities, and trade routes:</p>
  <a href="../?year=${s.from}" class="launch-btn">Open Interactive Map for ${esc(titleEn)} ➔</a>
</div>

<h2>Territorial Polities & Realms</h2>
<ul>
  ${politiesList || '<li>Data being curated from epigraphic sources.</li>'}
</ul>

${rulersList ? `<h2>Key Rulers in this Era</h2><ul>${rulersList}</ul>` : ''}

${eventsList ? `<h2>Historical Milestones</h2><ul>${eventsList}</ul>` : ''}

<footer>
  <p>Part of the <a href="${BASE_URL}/" style="color:var(--navy);font-weight:600">Chronicles of India</a> historical atlas project. CC BY-SA 4.0 license.</p>
</footer>
</body>
</html>`;

  writeFileSync(`periods/${s.id}.html`, pageHtml);
  periodLinks.push({ id: s.id, titleEn, titleHi, repEn, from: s.from, to: s.to });
});

// 2. Generate periods/index.html (Period Directory)
const periodIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chronological Eras (600 BCE – 1947 CE) — Chronicles of India</title>
<meta name="description" content="Browse all 36 historical eras in the Chronicles of India interactive atlas.">
<style>
  :root { --navy: #0b2a5b; --bg: #fdfbf7; --line: #e2e8f0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 820px; margin: 0 auto; padding: 24px 20px; background: var(--bg); color: #1e293b; }
  h1 { font: 700 26px Georgia, serif; color: var(--navy); }
  .grid { display: flex; flex-direction: column; gap: 10px; margin-top: 20px; }
  .card { background: #fff; border: 1px solid var(--line); border-radius: 8px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; text-decoration: none; color: inherit; }
  .card:hover { border-color: #3b82f6; box-shadow: 0 2px 5px rgba(0,0,0,0.06); }
  .card b { font-size: 15px; color: var(--navy); }
  .card .date { font-size: 13px; color: #64748b; font-weight: 600; }
</style>
</head>
<body>
<a href="../" style="text-decoration:none;font-weight:700;color:var(--navy);font-size:14px;">← Back to Interactive Atlas</a>
<h1>Chronological Eras & Historical Periods</h1>
<p>Browse the 36 contiguous snapshots of South Asian history mapping borders, rulers, and cities.</p>
<div class="grid">
  ${periodLinks.map(p => `
    <a class="card" href="${p.id}.html">
      <div>
        <b>${esc(p.titleEn)}</b> ${p.titleHi ? `<span style="color:#b45309">(${esc(p.titleHi)})</span>` : ''}
      </div>
      <div class="date">${esc(p.repEn)}</div>
    </a>
  `).join('')}
</div>
</body>
</html>`;
writeFileSync('periods/index.html', periodIndexHtml);

// 3. Generate sitemap.xml
const sitemapUrls = [
  { loc: `${BASE_URL}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${BASE_URL}/periods/`, priority: '0.9', changefreq: 'monthly' }
];

// Add each period landing page and deep link
periodLinks.forEach(p => {
  sitemapUrls.push({ loc: `${BASE_URL}/periods/${p.id}.html`, priority: '0.8', changefreq: 'monthly' });
  sitemapUrls.push({ loc: `${BASE_URL}/?year=${p.from}`, priority: '0.7', changefreq: 'monthly' });
});

// Add key journeys
journeys.forEach(j => {
  sitemapUrls.push({ loc: `${BASE_URL}/?person=${j.id}`, priority: '0.7', changefreq: 'monthly' });
});

// Add prominent places
places.slice(0, 30).forEach(p => {
  sitemapUrls.push({ loc: `${BASE_URL}/?place=${p.id}`, priority: '0.6', changefreq: 'monthly' });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

writeFileSync('sitemap.xml', sitemapXml);

// 4. Generate robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml
`;
writeFileSync('robots.txt', robotsTxt);

console.log(`Generated SEO assets:`);
console.log(`- 36 period landing pages in periods/`);
console.log(`- Period index in periods/index.html`);
console.log(`- sitemap.xml with ${sitemapUrls.length} URLs`);
console.log(`- robots.txt`);
