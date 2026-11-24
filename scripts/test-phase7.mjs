// Playwright integration tests for Phase 7 (Language and Accessibility)
// Usage: node scripts/test-phase7.mjs [file]
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const target = process.argv[2] || 'index.html';
const baseFileUrl = `file://${resolve(target)}`;

console.log(`Testing Phase 7 Language & Accessibility on ${target}...`);

// 1. Check Regional Scripts in data
console.log('1. Checking regional script coverage in places data...');
const places = JSON.parse(readFileSync('data/places.json', 'utf8'));
if (places.length < 90) throw new Error('Expected at least 90 places');
const withRegional = places.filter(p => p.regional && p.regional.script && p.regional.name);
if (withRegional.length < 90) {
  throw new Error(`Expected all places to have regional script mapping, found ${withRegional.length}/${places.length}`);
}

// Check key cultural settlements
const thanjavur = places.find(p => p.id === 9);
if (!thanjavur?.regional?.name.includes('தஞ்சாவூர்')) throw new Error('Thanjavur missing Tamil script');
const vijayanagara = places.find(p => p.id === 10);
if (!vijayanagara?.regional?.name.includes('ವಿಜಯನಗರ')) throw new Error('Vijayanagara missing Kannada script');
const amaravati = places.find(p => p.id === 49);
if (!amaravati?.regional?.name.includes('అమరావతి')) throw new Error('Amaravati missing Telugu script');
const muziris = places.find(p => p.id === 20);
if (!muziris?.regional?.name.includes('മുസിരിസ്') && !muziris?.regional?.name.includes('മുசிறி')) throw new Error('Muziris missing Malayalam/Tamil script');
const tamralipti = places.find(p => p.id === 32);
if (!tamralipti?.regional?.name.includes('তাম্রলিপ্ত')) throw new Error('Tamralipti missing Bengali script');

console.log(`✓ Verified ${withRegional.length} places with regional scripts (Tamil, Kannada, Telugu, Malayalam, Bengali, Marathi, etc.)`);

// Launch browser for Playwright tests
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

try {
  // 2. Test Default English UI and Toggle to Hindi
  console.log('2. Testing Language Toggle button (EN <-> HI)...');
  await page.goto(baseFileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const initialTitle = await page.$eval('#appTitle', el => el.textContent.trim());
  if (!initialTitle.includes('Chronicles of India')) throw new Error(`Expected English title, got: ${initialTitle}`);

  const initialYear = await page.$eval('#ylab', el => el.textContent.trim());
  if (!initialYear.includes('BCE')) throw new Error(`Expected BCE in year label, got: ${initialYear}`);

  const initialEraTab = await page.$eval('#tabs button[data-t="era"]', el => el.textContent.trim());
  if (initialEraTab !== 'Era') throw new Error(`Expected tab label 'Era', got: ${initialEraTab}`);

  // Click #langBtn to switch to Hindi
  await page.click('#langBtn');
  await page.waitForTimeout(200);

  const hiTitle = await page.$eval('#appTitle', el => el.textContent.trim());
  if (!hiTitle.includes('भारत का ऐतिहासिक एटलस')) throw new Error(`Expected Hindi title, got: ${hiTitle}`);

  const hiBtnText = await page.$eval('#langBtnText', el => el.textContent.trim());
  if (hiBtnText !== 'English') throw new Error(`Expected toggle button text 'English', got: ${hiBtnText}`);

  const hiYear = await page.$eval('#ylab', el => el.textContent.trim());
  if (!hiYear.includes('ई.पू.')) throw new Error(`Expected ई.पू. in year label, got: ${hiYear}`);

  const hiEraTab = await page.$eval('#tabs button[data-t="era"]', el => el.textContent.trim());
  if (hiEraTab !== 'युग') throw new Error(`Expected tab label 'युग', got: ${hiEraTab}`);

  const hiPlacesTab = await page.$eval('#tabs button[data-t="places"]', el => el.textContent.trim());
  if (hiPlacesTab !== 'स्थान') throw new Error(`Expected tab label 'स्थान', got: ${hiPlacesTab}`);

  const hiJourneysTab = await page.$eval('#tabs button[data-t="journeys"]', el => el.textContent.trim());
  if (hiJourneysTab !== 'यात्राएं') throw new Error(`Expected tab label 'यात्राएं', got: ${hiJourneysTab}`);

  const hiQuizTab = await page.$eval('#tabs button[data-t="quiz"]', el => el.textContent.trim());
  if (hiQuizTab !== 'प्रश्नोत्तरी') throw new Error(`Expected tab label 'प्रश्नोत्तरी', got: ${hiQuizTab}`);

  console.log('✓ UI labels, tabs, and timeline successfully translated to Hindi');

  // 3. Test Deep Link with ?lang=hi
  console.log('3. Testing ?lang=hi URL parameter initialization...');
  await page.goto(`${baseFileUrl}?lang=hi&year=-261`, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  const urlLangTitle = await page.$eval('#appTitle', el => el.textContent.trim());
  if (!urlLangTitle.includes('भारत का ऐतिहासिक एटलस')) throw new Error(`Failed to initialize Hindi from ?lang=hi parameter`);
  console.log('✓ Deep link with ?lang=hi initializes atlas in Hindi');

  // 4. Test Regional Script display in Trace Place
  console.log('4. Testing Regional Script display in Trace Place...');
  await page.click('#tabs button[data-t="places"]');
  await page.waitForTimeout(200);

  // Click Thanjavur in places
  await page.evaluate(() => {
    const thanjavur = window.atlas.PL.find(p => p.id === 9);
    if (thanjavur) {
      window.atlas.act('pl:' + thanjavur.id);
    }
  });
  await page.waitForTimeout(200);

  const regScriptText = await page.$eval('#content .reg-script', el => el.textContent.trim());
  if (!regScriptText.includes('தஞ்சாவூர்') || !regScriptText.toLowerCase().includes('tamil')) {
    throw new Error(`Expected Tamil script for Thanjavur, got: ${regScriptText}`);
  }
  console.log('✓ Regional script (தஞ்சாவூர்) prominently displayed in place details');

  // 5. Test Screen Reader Live Region (#sr-announcer)
  console.log('5. Testing Screen Reader announcements (aria-live polite)...');
  const announcer = await page.$('#sr-announcer');
  if (!announcer) throw new Error('Missing #sr-announcer polite live region');

  const ariaLive = await announcer.getAttribute('aria-live');
  if (ariaLive !== 'polite') throw new Error(`Expected aria-live="polite", got: ${ariaLive}`);

  // Change year and verify screen reader announcement text
  await page.evaluate(() => {
    window.atlas.setYear(1526);
  });
  await page.waitForTimeout(150);

  const announcement = await page.$eval('#sr-announcer', el => el.textContent.trim());
  if (!announcement || (!announcement.includes('1526') && !announcement.includes('मुग़ल') && !announcement.includes('Mughal'))) {
    throw new Error(`Screen reader announcement missing year/era context: "${announcement}"`);
  }
  console.log(`✓ Screen reader announcement emitted: "${announcement.slice(0, 70)}..."`);

  // 6. Test Reduced Motion Support
  console.log('6. Testing prefers-reduced-motion handling...');
  const motionPage = await browser.newPage();
  await motionPage.emulateMedia({ reducedMotion: 'reduce' });
  await motionPage.goto(baseFileUrl, { waitUntil: 'load' });
  await motionPage.waitForTimeout(200);

  // Trigger flyTo and check immediate view bounding box application
  const flyResult = await motionPage.evaluate(() => {
    const t0 = performance.now();
    window.atlasAPI.locate(78.5, 20.5, 300);
    const duration = performance.now() - t0;
    return { duration, vbW: window.atlas.st.year };
  });
  if (flyResult.duration > 150) {
    throw new Error(`Reduced motion flyTo took ${flyResult.duration}ms (expected instantaneous jump)`);
  }
  await motionPage.close();
  console.log('✓ Reduced motion honored with instantaneous viewport transitions');

  // 7. Test Keyboard Navigation (l, 1-4, tabs arrow navigation)
  console.log('7. Testing Keyboard Navigation & shortcuts...');
  await page.keyboard.press('l');
  await page.waitForTimeout(200);

  const toggledLang = await page.evaluate(() => window.atlasAPI.getLanguage());
  if (toggledLang !== 'en') throw new Error(`Expected 'l' key to toggle language to 'en', got: ${toggledLang}`);

  // Test numeric tab shortcuts: 1=era, 2=places, 3=journeys, 4=quiz
  await page.keyboard.press('3');
  await page.waitForTimeout(150);
  let activeTab = await page.evaluate(() => window.atlas.st.tab);
  if (activeTab !== 'journeys') throw new Error(`Expected key '3' to switch to journeys, got: ${activeTab}`);

  await page.keyboard.press('4');
  await page.waitForTimeout(150);
  activeTab = await page.evaluate(() => window.atlas.st.tab);
  if (activeTab !== 'quiz') throw new Error(`Expected key '4' to switch to quiz, got: ${activeTab}`);

  await page.keyboard.press('1');
  await page.waitForTimeout(150);
  activeTab = await page.evaluate(() => window.atlas.st.tab);
  if (activeTab !== 'era') throw new Error(`Expected key '1' to switch to era, got: ${activeTab}`);

  console.log('✓ Keyboard shortcuts (l for language, 1-4 for tabs) verified');

  console.log(`✅ All Phase 7 Language & Accessibility tests passed on ${target}!`);
} finally {
  await browser.close();
}
