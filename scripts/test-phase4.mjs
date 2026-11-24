// Playwright integration tests for Phase 4 interactive features
// Usage: node scripts/test-phase4.mjs [file]
import { chromium } from 'playwright';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const target = process.argv[2] || 'index.html';
const url = `file://${resolve(target)}`;

console.log(`Testing Phase 4 interactions on ${target}...`);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

page.on('pageerror', err => {
  console.error('Page error:', err);
  process.exit(1);
});

await page.goto(url, { waitUntil: 'load' });

// 1. Test Universal Search
console.log('1. Testing Universal Search (/ and Cmd+K)...');
await page.keyboard.press('/');
await page.waitForSelector('#search-modal', { state: 'visible' });
await page.fill('#searchInput', 'patali');
await page.waitForSelector('.search-item');
const searchItemText = await page.textContent('.search-item .search-title');
if (!searchItemText.toLowerCase().includes('patali')) {
  throw new Error(`Expected Pataliputra in search results, got: ${searchItemText}`);
}
// Select with Enter
await page.keyboard.press('Enter');
await page.waitForSelector('#search-modal', { state: 'hidden' });
const panelTitle = await page.textContent('#content h2');
if (!panelTitle.toLowerCase().includes('patali')) {
  throw new Error(`Expected place panel for Pataliputra, got: ${panelTitle}`);
}
console.log('✓ Universal search opened, searched, and navigated correctly');

// 2. Test Modern Boundaries (X-Ray lens)
console.log('2. Testing Modern Boundaries (X-Ray lens)...');
let modernContent = await page.innerHTML('#modern');
if (modernContent.trim() !== '') throw new Error('Modern layer should be empty when X-ray is off');

// Toggle via keyboard shortcut 'x'
await page.keyboard.press('x');
const xrayOn = await page.$eval('#tgXray', el => el.classList.contains('on'));
if (!xrayOn) throw new Error('#tgXray should have class .on after pressing x');

const countryCount = await page.$$eval('#modern .modern-country', els => els.length);
const stateCount = await page.$$eval('#modern .modern-state', els => els.length);
const labelCount = await page.$$eval('#modern .modern-label', els => els.length);

if (countryCount < 30 || stateCount < 100 || labelCount < 20) {
  throw new Error(`Unexpected modern element counts: ${countryCount} countries, ${stateCount} states, ${labelCount} labels`);
}
console.log(`✓ X-Ray lens active: ${countryCount} country paths, ${stateCount} state paths, ${labelCount} labels`);

// 3. Test Keyboard Shortcuts (Arrows, Shift+Arrows, Space, G, C)
console.log('3. Testing Keyboard navigation...');
const yearBefore = await page.$eval('#yr', el => +el.value);
await page.keyboard.press('ArrowRight');
const yearAfterRight = await page.$eval('#yr', el => +el.value);
if (yearAfterRight <= yearBefore) throw new Error(`ArrowRight did not advance year: ${yearBefore} -> ${yearAfterRight}`);

await page.keyboard.down('Shift');
await page.keyboard.press('ArrowRight');
await page.keyboard.up('Shift');
const yearAfterShift = await page.$eval('#yr', el => +el.value);
if (yearAfterShift !== yearAfterRight + 10) throw new Error(`Shift+ArrowRight did not add 10 years: ${yearAfterRight} -> ${yearAfterShift}`);

// Toggle corridors with 'c'
await page.keyboard.press('c');
const corOff = await page.$eval('#tgCorridors', el => !el.classList.contains('on'));
if (!corOff) throw new Error('#tgCorridors should toggle off with key c');
await page.keyboard.press('c'); // toggle back on

// Toggle ghost with 'g'
await page.keyboard.press('g');
const ghostOff = await page.$eval('#tgGhost', el => !el.classList.contains('on'));
if (!ghostOff) throw new Error('#tgGhost should toggle off with key g');
await page.keyboard.press('g'); // toggle back on

console.log('✓ Keyboard shortcuts (arrows, Shift+arrow, c, g) working');

// 4. Test Canvas Double-Click (Trace Place)
console.log('4. Testing Canvas Double-Click resolving to nearest place...');
// Double click near Ujjayini (roughly center of map)
const mapBBox = await page.$eval('#map', el => el.getBoundingClientRect());
await page.mouse.dblclick(mapBBox.x + mapBBox.width * 0.45, mapBBox.y + mapBBox.height * 0.5);
await page.waitForTimeout(300);
const placeActive = await page.$eval('#tabs button[data-t="places"]', el => el.classList.contains('on'));
if (!placeActive) throw new Error('Double click did not activate Places tab');
console.log('✓ Canvas double-click resolved and opened Places tab');

// 5. Test Person Chronicles (Directional Arcs & Multi-journey)
console.log('5. Testing Person Chronicles with directional arcs and ticks...');
await page.click('#tabs button[data-t="journeys"]');
await page.click('#content li[data-a="jr:0"]'); // Open Alexander's journey
await page.waitForSelector('#route .route-arc');
const arcCount = await page.$$eval('#route .route-arc', els => els.length);
const tickCount = await page.$$eval('#route .route-tick', els => els.length);
if (arcCount < 2 || tickCount < 2) {
  throw new Error(`Expected curved arcs and directional ticks, found: ${arcCount} arcs, ${tickCount} ticks`);
}

// Select a secondary comparison journey
await page.selectOption('#cmpJrSelect', '1'); // Compare with Buddha
await page.waitForSelector('#route .route-arc.secondary');
const secArcCount = await page.$$eval('#route .route-arc.secondary', els => els.length);
if (secArcCount < 2) throw new Error('Expected secondary route arcs for comparison journey');
console.log(`✓ Person Chronicles: ${arcCount} primary arcs + ${secArcCount} comparison arcs rendered with chevrons`);

// 6. Test Pinpoint Quiz (10 rounds, clues, provisional guess, confirm button, accuracy rings, ranks)
console.log('6. Testing Pinpoint Quiz (10 rounds, confirm, rings, ranks)...');
await page.click('#tabs button[data-t="quiz"]');
await page.click('#content button[data-a="q:start"]');
await page.waitForSelector('.quiz-clue');
const clueText = await page.textContent('.quiz-clue');
if (!clueText.includes('Historical Clue')) throw new Error('Expected historical clue in quiz round');

// Click map to drop provisional pin
await page.mouse.click(mapBBox.x + mapBBox.width * 0.5, mapBBox.y + mapBBox.height * 0.5);
await page.waitForSelector('.quiz-provisional');
await page.waitForSelector('button[data-a="q:confirm"]');

// Confirm guess
await page.click('button[data-a="q:confirm"]');
await page.waitForSelector('.accuracy-ring.r50');
await page.waitForSelector('.accuracy-ring.r150');
await page.waitForSelector('.accuracy-ring.r300');
await page.waitForSelector('.accuracy-ring.r500');

// Play through remaining 9 rounds to verify 10-round syllabus and rank
for (let round = 1; round < 10; round++) {
  await page.click('button[data-a="q:next"]');
  await page.waitForSelector('.quiz-clue');
  // Click and confirm
  await page.mouse.click(mapBBox.x + mapBBox.width * (0.4 + round * 0.02), mapBBox.y + mapBBox.height * (0.4 + round * 0.02));
  await page.waitForSelector('button[data-a="q:confirm"]');
  await page.click('button[data-a="q:confirm"]');
}

// Click to see final rank
await page.click('button[data-a="q:next"]');
await page.waitForSelector('.rank-card');
const rankTitle = await page.textContent('.rank-title');
const rankBadge = await page.textContent('.rank-badge');
console.log(`✓ Quiz completed: Awarded rank "${rankTitle}" (${rankBadge})`);

await browser.close();
console.log('✅ All Phase 4 interaction tests passed successfully!');
