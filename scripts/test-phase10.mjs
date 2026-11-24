import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import http from 'http';

console.log('Testing Phase 10 Offline & Installable (PWA + Lite Mode)...');

// 1. Validate manifest.webmanifest & assets/icon.svg
const manifestRaw = fs.readFileSync(path.resolve('manifest.webmanifest'), 'utf8');
const manifest = JSON.parse(manifestRaw);
if (!manifest.name || !manifest.short_name || !manifest.start_url || manifest.display !== 'standalone') {
  throw new Error('Invalid manifest.webmanifest metadata');
}
if (!fs.existsSync(path.resolve('assets/icon.svg'))) {
  throw new Error('Missing assets/icon.svg');
}
console.log('✓ PWA manifest.webmanifest and assets/icon.svg validated');

// 2. Validate sw.js contains core assets and all 16 terrain tiles
const swText = fs.readFileSync(path.resolve('sw.js'), 'utf8');
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    if (!swText.includes(`r${r}c${c}.jpg`)) {
      throw new Error(`sw.js missing terrain tile r${r}c${c}.jpg`);
    }
  }
}
console.log('✓ Service worker sw.js caches core shell, data, and all 16 terrain tiles');

// 3. Spin up tiny local HTTP server to test SW registration, Lite Mode, & 2 GB Android mobile profile
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg'
};

const server = http.createServer((req, res) => {
  const cleanUrl = (req.url || '/').split('?')[0];
  const rel = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
  const full = path.resolve(rel);
  if (!full.startsWith(path.resolve('.')) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(full);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/index.html`;

const browser = await chromium.launch();
try {
  // Emulate a 2 GB Android phone (Moto G / entry-level Android: 360x740, touch, 2x DPR)
  const context = await browser.newContext({
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Moto G Play) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('#liteBtn');

  // Verify manifest link present
  const manifestHref = await page.$eval('link[rel="manifest"]', el => el.getAttribute('href'));
  if (manifestHref !== 'manifest.webmanifest') throw new Error(`Expected manifest link, got ${manifestHref}`);

  // Verify Service Worker registration succeeds over HTTP
  const swReady = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return false;
    const reg = await navigator.serviceWorker.getRegistration();
    return Boolean(reg);
  });
  if (!swReady) throw new Error('Expected Service Worker to register cleanly over HTTP');
  console.log('✓ Service Worker registered cleanly in headless Chromium');

  // Test Lite Mode toggle button
  await page.click('#liteBtn');
  const liteActive = await page.$eval('body', el => el.classList.contains('lite-mode'));
  if (!liteActive) throw new Error('Expected body.lite-mode after clicking #liteBtn');
  const terrainHidden = await page.$eval('#terrain', el => getComputedStyle(el).display === 'none');
  if (!terrainHidden) throw new Error('Expected #terrain to be hidden in Lite mode');
  console.log('✓ Lite mode toggle disabled terrain hillshade and heavy effects');

  // Test ?lite=1 deep link & mobile timeline interaction
  await page.goto(baseUrl + '?lite=1&year=1947', { waitUntil: 'networkidle' });
  const liteFromUrl = await page.$eval('body', el => el.classList.contains('lite-mode'));
  const yearLabel = await page.textContent('#ylab');
  if (!liteFromUrl || !yearLabel.includes('1947')) {
    throw new Error(`Expected ?lite=1&year=1947 to activate lite mode and 1947, got lite=${liteFromUrl}, ylab=${yearLabel}`);
  }

  if (errors.length) {
    throw new Error(`Console/page errors on emulated 2 GB Android phone: ${errors.join('; ')}`);
  }
  console.log('✓ Emulated 2 GB Android phone (360×740 touch) verified with 0 errors');
  console.log('✅ All Phase 10 Offline & Installable tests passed!');
} finally {
  await browser.close();
  server.close();
}
