import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

console.log('Testing Phase 9 Community & Launch deliverables...');

// 1. Check required documentation & issue templates
const requiredFiles = [
  'docs/ACCURACY.md',
  'README.hi.md',
  'docs/GOOD-FIRST-ISSUES.md',
  'docs/COURTESY-NOTE.md',
  '.github/ISSUE_TEMPLATE/inaccuracy-report.yml'
];

for (const f of requiredFiles) {
  const p = path.resolve(f);
  if (!fs.existsSync(p) || fs.statSync(p).size < 100) {
    throw new Error(`Missing or empty Phase 9 file: ${f}`);
  }
}

const gfiContent = fs.readFileSync(path.resolve('docs/GOOD-FIRST-ISSUES.md'), 'utf8');
const itemCount = (gfiContent.match(/^\d+\.\s+\*\*/gm) || []).length;
if (itemCount < 30) {
  throw new Error(`Expected >= 30 seeded good-first-issue entries, got ${itemCount}`);
}
console.log(`✓ Verified Phase 9 docs, Hindi README, issue template, and ${itemCount} good-first-issue entries`);

// 2. Test live Era Report Link & UI elements in browser
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto('file://' + path.resolve('index.html'), { waitUntil: 'networkidle' });

await page.waitForSelector('#eraReportLink');
const href261 = await page.$eval('#eraReportLink', el => el.getAttribute('href'));
if (!href261.includes('github.com/mendax-iitm/chronicles-of-india/issues/new') || !href261.includes('era-')) {
  throw new Error(`Unexpected #eraReportLink href: ${href261}`);
}

// Jump to 1947 and verify report link updates dynamically
await page.evaluate(() => window.atlas.setYear(1947));
await page.waitForTimeout(200);
const href1947 = await page.$eval('#eraReportLink', el => el.getAttribute('href'));
if (!href1947.includes('1947') || href1947 === href261) {
  throw new Error(`Expected #eraReportLink to update for 1947, got: ${href1947}`);
}
console.log('✓ One-click pre-filled GitHub issue report link verified across eras');

// Verify new square-box legend, colored era timeline, and event balloon
const segCount = await page.$$eval('#era-segments .era-seg', els => els.length);
if (segCount < 8) throw new Error(`Expected >= 8 era segments, got ${segCount}`);
const legendChips = await page.$$eval('#eracard .ec-pol-chip', els => els.length);
if (legendChips < 2) throw new Error(`Expected polity swatches in #eracard, got ${legendChips}`);
await page.click('#content li.ev-card');
await page.waitForSelector('#event-balloon', { state: 'visible' });
console.log(`✓ Verified ${segCount} era timeline segments, ${legendChips} legend swatches, and floating event balloon`);

await browser.close();
console.log('✅ All Phase 9 Community & Launch tests passed!');
