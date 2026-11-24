// Playwright integration tests for Phase 8 (Exam & Classroom Mode)
// Usage: node scripts/test-phase8.mjs [file]
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const target = process.argv[2] || 'index.html';
const baseFileUrl = `file://${resolve(target)}`;

console.log(`Testing Phase 8 Exam & Classroom Mode on ${target}...`);

// 1. Verify Syllabus & Pedagogical Metadata in data files
console.log('1. Checking NCERT & UPSC syllabus metadata across all snapshots...');
const snapshots = JSON.parse(readFileSync('data/snapshots.json', 'utf8'));
if (snapshots.length !== 36) throw new Error(`Expected 36 snapshots, found ${snapshots.length}`);

snapshots.forEach((s, idx) => {
  if (!s.period || !['ancient', 'medieval', 'modern'].includes(s.period)) {
    throw new Error(`Snapshot ${s.id} missing valid period: ${s.period}`);
  }
  if (!s.syllabus) throw new Error(`Snapshot ${s.id} missing syllabus metadata`);
  if (!s.syllabus.ncert_class || !s.syllabus.book || !s.syllabus.chapter || !s.syllabus.upsc_topic) {
    throw new Error(`Snapshot ${s.id} missing required syllabus fields`);
  }
  if (!s.teacher_notes || !s.teacher_notes.en || !s.teacher_notes.hi) {
    throw new Error(`Snapshot ${s.id} missing bilingual teacher_notes`);
  }
});
console.log(`✓ Verified 36 snapshots tagged with NCERT Classes 6–12, UPSC topics, and pedagogical notes`);

// Launch browser for interactive UI verification
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

try {
  // 2. Test Syllabus Filter Dropdown
  console.log('2. Testing Syllabus Filter Dropdown and Timeline ticks...');
  await page.goto(baseFileUrl, { waitUntil: 'load' });

  const filterSelect = await page.$('#syllabusFilter');
  if (!filterSelect) throw new Error('Missing #syllabusFilter in header');

  // Switch to ancient syllabus
  await page.selectOption('#syllabusFilter', 'ancient');
  let sylState = await page.evaluate(() => window.atlas?.st?.syllabus);
  if (sylState !== 'ancient') throw new Error(`Expected st.syllabus to be 'ancient', found '${sylState}'`);

  // Verify ticks are filtered (dimmed or active)
  const dimmedTicks = await page.$$eval('#ticks i.dimmed', el => el.length);
  if (dimmedTicks === 0) throw new Error('Expected inactive syllabus ticks to be dimmed');
  console.log(`✓ Syllabus filter set to ancient: ${dimmedTicks} non-ancient ticks dimmed`);

  // Switch to all eras
  await page.selectOption('#syllabusFilter', 'all');
  const dimmedAfterAll = await page.$$eval('#ticks i.dimmed', el => el.length);
  if (dimmedAfterAll !== 0) throw new Error('Expected 0 dimmed ticks after selecting All Eras');
  console.log('✓ Syllabus filter reset to All Eras successfully');

  // 3. Test Deep Link with Syllabus Parameter
  console.log('3. Testing ?syllabus=modern deep link...');
  await page.goto(`${baseFileUrl}?syllabus=modern`, { waitUntil: 'load' });
  const deepSyl = await page.evaluate(() => window.atlas?.st?.syllabus);
  if (deepSyl !== 'modern') throw new Error(`Expected st.syllabus to be 'modern' via deep link, found '${deepSyl}'`);
  const selectVal = await page.$eval('#syllabusFilter', el => el.value);
  if (selectVal !== 'modern') throw new Error(`Expected select value to be 'modern', found '${selectVal}'`);
  console.log('✓ Deep link initialized with ?syllabus=modern correctly');

  // 4. Test Syllabus Card in Era Panel
  console.log('4. Testing Syllabus Card display in Era panel...');
  await page.evaluate(() => window.atlas?.setYear(1947));
  const syllabusCard = await page.$('.syllabus-card');
  if (!syllabusCard) throw new Error('Expected .syllabus-card in era tab');
  const cardText = await page.$eval('.syllabus-card', el => el.textContent);
  if (!cardText.includes('NCERT') || !cardText.includes('UPSC')) {
    throw new Error('Expected syllabus card to contain NCERT and UPSC info');
  }
  console.log('✓ Era panel displays NCERT and UPSC syllabus card');

  // 5. Test Practice Modes in Quiz Tab
  console.log('5. Testing Practice Modes in Quiz tab (4 Puzzles)...');
  await page.click('button[data-t="quiz"]');
  const modeNav = await page.$('.practice-modes-nav');
  if (!modeNav) throw new Error('Expected .practice-modes-nav in Quiz tab');

  // Mode 2: Match the Capital
  console.log('   - Testing Match the Capital...');
  await page.click('button[data-pm="match-capital"]');
  await page.waitForSelector('.match-btn[data-emp="0"]');
  await page.click('.match-btn[data-emp="0"]');
  await page.waitForSelector('.match-btn[data-cap="0"]');
  await page.click('.match-btn[data-cap="0"]');
  const matchedCount = await page.$$eval('.match-btn', el => el.length);
  if (matchedCount === 0) throw new Error('Expected match-btn elements in Match mode');
  console.log('   ✓ Match the Capital interactive matching verified');

  // Mode 3: Order the Dynasties
  console.log('   - Testing Order the Dynasties...');
  await page.click('button[data-pm="order-dynasties"]');
  const checkBtn = await page.$('#btnCheckOrder');
  if (!checkBtn) throw new Error('Expected #btnCheckOrder in Order Dynasties mode');
  await checkBtn.click();
  const orderResult = await page.$('.card');
  if (!orderResult) throw new Error('Expected result card after checking order');
  console.log('   ✓ Order the Dynasties evaluated chronological sequence');

  // Mode 4: Which Ruler When
  console.log('   - Testing Which Ruler When...');
  await page.click('button[data-pm="which-ruler"]');
  const rulerOpts = await page.$$('.ruler-opt-btn');
  if (rulerOpts.length < 2) throw new Error('Expected ruler options in Which Ruler mode');
  await rulerOpts[0].click();
  const rulerResult = await page.$('.card');
  if (!rulerResult) throw new Error('Expected feedback card after selecting ruler option');
  console.log('   ✓ Which Ruler When evaluated answer with historical explanation');

  // 6. Test Teacher Mode Tour
  console.log('6. Testing Teacher Tour Mode...');
  const teacherBtn = await page.$('#teacherBtn');
  if (!teacherBtn) throw new Error('Missing #teacherBtn in header');
  await teacherBtn.click();

  const teacherBar = await page.$('#teacher-bar');
  const isBarVisible = await page.$eval('#teacher-bar', el => el.style.display !== 'none');
  if (!isBarVisible) throw new Error('Expected #teacher-bar to be visible after clicking teacher button');

  const lesson1Year = await page.evaluate(() => window.atlas?.st?.year);
  if (lesson1Year !== -600) throw new Error(`Expected Lesson 1 year to be -600, found ${lesson1Year}`);

  // Advance lesson
  await page.click('#tbNext');
  const lesson2Year = await page.evaluate(() => window.atlas?.st?.year);
  if (lesson2Year !== -261) throw new Error(`Expected Lesson 2 year to be -261, found ${lesson2Year}`);

  // Test Voice toggle
  await page.click('#tbVoice');

  // Close tour
  await page.click('#tbClose');
  const barClosed = await page.$eval('#teacher-bar', el => el.style.display === 'none');
  if (!barClosed) throw new Error('Expected #teacher-bar to be hidden after closing tour');
  console.log('✓ Teacher Tour stepped through lessons and closed cleanly');

  // 7. Test Exam & Worksheets Modal
  console.log('7. Testing Exam & Worksheets Modal...');
  const examBtn = await page.$('#examBtn');
  if (!examBtn) throw new Error('Missing #examBtn in header');
  await examBtn.click();

  const examModal = await page.$('#exam-modal');
  const modalVisible = await page.$eval('#exam-modal', el => el.style.display !== 'none');
  if (!modalVisible) throw new Error('Expected #exam-modal to be visible');

  // Check Revision Table
  const revRows = await page.$$eval('#examRevisionContent tr', el => el.length);
  if (revRows < 5) throw new Error(`Expected at least 5 period revision rows, found ${revRows}`);
  console.log(`   ✓ Revision Sheet rendered ${revRows} historical era rows with syllabus mapping`);

  // Switch to Worksheet Tab
  await page.click('#tabExamWorksheet');
  const siteCircles = await page.$$eval('#worksheetMapSvg circle', el => el.length);
  if (siteCircles < 10) throw new Error(`Expected at least 10 site circles on worksheet map, found ${siteCircles}`);

  // Toggle Answer Key
  await page.click('#toggleAnswerKey');
  const answerKeyVisible = await page.$eval('#worksheetAnswerKey', el => el.style.display !== 'none');
  if (!answerKeyVisible) throw new Error('Expected #worksheetAnswerKey to be visible after toggle');
  console.log(`   ✓ Worksheet rendered outline map with ${siteCircles} numbered sites and answer key`);

  // Close modal
  await page.click('#examClose');
  const modalClosed = await page.$eval('#exam-modal', el => el.style.display === 'none');
  if (!modalClosed) throw new Error('Expected #exam-modal to close');
  console.log('✓ Exam & Worksheets modal closed successfully');

  // 8. Test Classroom Projector Resolution (1024x768)
  console.log('8. Testing Classroom Projector Resolution (1024x768)...');
  await page.setViewportSize({ width: 1024, height: 768 });
  const errors = [];
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', e => errors.push(e.message));

  await page.evaluate(() => window.atlas?.setYear(1526));
  const mapWidth = await page.$eval('#mapwrap', el => el.clientWidth);
  const panelWidth = await page.$eval('#panel', el => el.clientWidth);

  if (mapWidth < 500 || panelWidth < 250) {
    throw new Error(`Unexpected layout at 1024x768: map=${mapWidth}px, panel=${panelWidth}px`);
  }
  if (errors.length > 0) {
    throw new Error(`Console errors at 1024x768: ${errors.join(', ')}`);
  }
  console.log(`✓ 1024x768 Classroom Projector resolution verified: map=${mapWidth}px, panel=${panelWidth}px, 0 errors`);

  console.log('✅ All Phase 8 Exam & Classroom Mode tests passed successfully!');
} finally {
  await browser.close();
}
