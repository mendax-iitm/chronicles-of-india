// Playwright integration tests for Phase 5 (Sharing, Deep Linking, Embed & Export)
// Usage: node scripts/test-phase5.mjs [file]
import { chromium } from 'playwright';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const target = process.argv[2] || 'index.html';
const baseFileUrl = `file://${resolve(target)}`;

console.log(`Testing Phase 5 Sharing & Deployment features on ${target}...`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

page.on('pageerror', err => {
  console.error('Page error:', err);
  process.exit(1);
});

// 1. Test Deep Linking: Year & Place
console.log('1. Testing Deep Link (?year=-250&place=pataliputra)...');
await page.goto(`${baseFileUrl}?year=-250&place=pataliputra`, { waitUntil: 'load' });
await page.waitForSelector('#content h2');

const yearVal = await page.$eval('#yr', el => +el.value);
const yearText = await page.textContent('#ylab');
if (yearVal !== -250 || !yearText.includes('250 BCE')) {
  throw new Error(`Expected year -250 (250 BCE), got ${yearVal} (${yearText})`);
}

const placesTabOn = await page.$eval('#tabs button[data-t="places"]', el => el.classList.contains('on'));
if (!placesTabOn) throw new Error('Expected places tab to be active from ?place=pataliputra');

const placeTitle = await page.textContent('#content h2');
if (!placeTitle.toLowerCase().includes('patali')) {
  throw new Error(`Expected Pataliputra details in panel, got: ${placeTitle}`);
}
console.log('✓ Deep link successfully set year and opened place');

// 2. Test Multi-Stop Place Deep Link
console.log('2. Testing Multi-Stop Place Deep Link (?place=pataliputra,delhi)...');
await page.goto(`${baseFileUrl}?place=pataliputra,delhi`, { waitUntil: 'load' });
await page.waitForSelector('.multi-trace');
const multiTraceText = await page.textContent('.multi-trace');
if (!multiTraceText.includes('2 places')) {
  throw new Error(`Expected multi-trace indicator with 2 places, got: ${multiTraceText}`);
}
console.log('✓ Multi-stop place deep link rendered multi-site trace controls');

// 3. Test Person / Journey Deep Link
console.log('3. Testing Person Journey Deep Link (?person=alexander)...');
await page.goto(`${baseFileUrl}?person=alexander`, { waitUntil: 'load' });
await page.waitForSelector('#route .route-arc');
const journeyTabOn = await page.$eval('#tabs button[data-t="journeys"]', el => el.classList.contains('on'));
if (!journeyTabOn) throw new Error('Expected journeys tab to be active from ?person=alexander');

const journeyTitle = await page.textContent('#content h2');
if (!journeyTitle.toLowerCase().includes('alexander')) {
  throw new Error(`Expected Alexander journey panel, got: ${journeyTitle}`);
}
console.log('✓ Journey deep link loaded route arcs and traveler panel');

// 4. Test Embed Mode (?embed=1)
console.log('4. Testing Embed Mode (?embed=1)...');
await page.goto(`${baseFileUrl}?embed=1&year=1526`, { waitUntil: 'load' });
const isEmbed = await page.evaluate(() => document.body.classList.contains('embed'));
if (!isEmbed) throw new Error('Expected body to have class .embed in embed mode');

const headerDisplay = await page.$eval('header', el => window.getComputedStyle(el).display);
if (headerDisplay !== 'none') throw new Error(`Expected header to be hidden in embed mode, got display: ${headerDisplay}`);

await page.waitForSelector('#embed-watermark');
const watermarkLink = await page.$eval('#embed-watermark a', el => el.getAttribute('href'));
if (!watermarkLink.includes('chronicles-of-india')) {
  throw new Error(`Invalid watermark link: ${watermarkLink}`);
}
console.log('✓ Embed mode hides header and renders interactive watermark');

// 5. Test Share Modal & Link Generator
console.log('5. Testing Share Modal and Link/Embed Code Generation...');
await page.goto(baseFileUrl, { waitUntil: 'load' });
await page.click('#shareBtn');
await page.waitForSelector('#share-modal', { state: 'visible' });

const shareUrl = await page.$eval('#shareUrlInput', el => el.value);
const embedCode = await page.$eval('#embedCodeInput', el => el.value);

if (!shareUrl.includes('year=') || !embedCode.includes('<iframe')) {
  throw new Error(`Invalid share modal content: url=${shareUrl}, embed=${embedCode}`);
}

await page.click('#shareClose');
await page.waitForSelector('#share-modal', { state: 'hidden' });
console.log('✓ Share modal displays permanent deep link and embed iframe snippet');

// 6. Test URL State Synchronization
console.log('6. Testing URL State Synchronization on user navigation...');
await page.click('#next'); // Step to next snapshot
await page.waitForTimeout(350); // Debounce wait
const currentUrl = page.url();
if (!currentUrl.includes('year=')) {
  throw new Error(`Expected URL to synchronize with year query parameter, got: ${currentUrl}`);
}
console.log(`✓ URL synchronized with state: ${currentUrl.split('/').pop()}`);

// 7. Test Image Export Serializer
console.log('7. Testing SVG & Image Export string generation...');
const svgExportStr = await page.evaluate(() => {
  return typeof getSvgExportString === 'function' ? getSvgExportString() : null;
});
if (!svgExportStr || !svgExportStr.includes('<svg') || !svgExportStr.includes('.land')) {
  throw new Error('SVG export string generation failed or missing styles');
}
console.log(`✓ Standalone SVG export serialized cleanly (${svgExportStr.length} bytes)`);

await browser.close();
console.log(`✅ All Phase 5 Sharing & Deployment tests passed on ${target}!`);
