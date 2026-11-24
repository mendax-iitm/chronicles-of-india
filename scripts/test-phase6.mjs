// Playwright and stdio integration tests for Phase 6 (AI and Agent Integration)
// Usage: node scripts/test-phase6.mjs [file]
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

const target = process.argv[2] || 'index.html';
const baseFileUrl = `file://${resolve(target)}`;

console.log(`Testing Phase 6 AI & Agent Integration on ${target}...`);

// 1. Test Documentation Files
console.log('1. Checking llms.txt, llms-full.txt, and SKILL.md...');
if (!existsSync('llms.txt')) throw new Error('Missing llms.txt');
if (!existsSync('llms-full.txt')) throw new Error('Missing llms-full.txt');
if (!existsSync('skills/chronicles-of-india/SKILL.md')) throw new Error('Missing skills/chronicles-of-india/SKILL.md');

const llmsTxt = readFileSync('llms.txt', 'utf8');
if (!llmsTxt.includes('Chronicles of India') || !llmsTxt.includes('atlasAPI') || !llmsTxt.includes('mcp-server.js')) {
  throw new Error('llms.txt missing key sections');
}
const skillMd = readFileSync('skills/chronicles-of-india/SKILL.md', 'utf8');
if (!skillMd.startsWith('---') || !skillMd.includes('name: chronicles-of-india')) {
  throw new Error('SKILL.md missing valid YAML frontmatter');
}
console.log('✓ AI documentation and agent skill files verified');

// 2. Test MCP Server (JSON-RPC stdio)
console.log('2. Testing MCP Server (scripts/mcp-server.js)...');
async function queryMCP(request) {
  return new Promise((resolvePromise, reject) => {
    const proc = spawn('node', ['scripts/mcp-server.js']);
    let output = '';
    let errorOutput = '';

    proc.stdout.on('data', chunk => {
      output += chunk.toString();
      if (output.includes('\n')) {
        proc.kill();
        try {
          const parsed = JSON.parse(output.trim());
          resolvePromise(parsed);
        } catch (e) {
          reject(e);
        }
      }
    });

    proc.stderr.on('data', chunk => {
      errorOutput += chunk.toString();
    });

    proc.on('close', code => {
      if (!output && errorOutput) {
        reject(new Error(errorOutput));
      }
    });

    proc.stdin.write(JSON.stringify(request) + '\n');
  });
}

// 2a. initialize
const initRes = await queryMCP({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
if (!initRes.result?.serverInfo?.name.includes('chronicles-of-india-mcp')) {
  throw new Error(`Unexpected MCP initialize response: ${JSON.stringify(initRes)}`);
}

// 2b. tools/list
const toolsRes = await queryMCP({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
const toolNames = (toolsRes.result?.tools || []).map(t => t.name);
const expectedTools = ['search_atlas', 'inspect_place', 'inspect_person', 'inspect_ruler', 'get_era', 'inspect_atom'];
for (const exp of expectedTools) {
  if (!toolNames.includes(exp)) throw new Error(`Missing expected MCP tool: ${exp}`);
}

// 2c. tools/call inspect_place
const placeRes = await queryMCP({
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: { name: 'inspect_place', arguments: { name: 'pataliputra' } }
});
const placeData = JSON.parse(placeRes.result.content[0].text);
if (!placeData.coordinates || !placeData.name_genealogy || placeData.id !== 0) {
  throw new Error(`Invalid inspect_place output: ${JSON.stringify(placeData)}`);
}

// 2d. tools/call inspect_ruler
const rulerRes = await queryMCP({
  jsonrpc: '2.0',
  id: 4,
  method: 'tools/call',
  params: { name: 'inspect_ruler', arguments: { name: 'Ashoka' } }
});
const rulerData = JSON.parse(rulerRes.result.content[0].text);
if (rulerData.count < 1 || !rulerData.rulers[0].dynasty) {
  throw new Error(`Invalid inspect_ruler output: ${JSON.stringify(rulerData)}`);
}

// 2e. tools/call get_era
const eraRes = await queryMCP({
  jsonrpc: '2.0',
  id: 5,
  method: 'tools/call',
  params: { name: 'get_era', arguments: { year: 1526 } }
});
const eraData = JSON.parse(eraRes.result.content[0].text);
if (!eraData.snapshot || !eraData.snapshot.polities.length) {
  throw new Error(`Invalid get_era output: ${JSON.stringify(eraData)}`);
}
console.log('✓ MCP Server passed all JSON-RPC tool tests (inspect_place, inspect_ruler, get_era)');

// 3. Test Headless Python CLI Tool
console.log('3. Testing Python CLI Renderer (scripts/atlas-cli.py)...');
async function runCLI(args) {
  return new Promise((resolvePromise, reject) => {
    const proc = spawn('python3', ['scripts/atlas-cli.py', ...args]);
    let stdout = '', stderr = '';
    proc.stdout.on('data', d => { stdout += d.toString(); });
    proc.stderr.on('data', d => { stderr += d.toString(); });
    proc.on('close', code => {
      if (code === 0) resolvePromise(stdout);
      else reject(new Error(`CLI exited with code ${code}: ${stderr}`));
    });
  });
}

const cliYearJson = await runCLI(['--year', '1526', '--format', 'json']);
const cliYearData = JSON.parse(cliYearJson);
if (!cliYearData.snapshot.title.includes('Sur Empire') && !cliYearData.snapshot.title.includes('Mughals')) {
  throw new Error(`Unexpected CLI snapshot output: ${cliYearData.snapshot.title}`);
}

const cliSearch = await runCLI(['--search', 'panipat']);
if (!cliSearch.includes('First Battle of Panipat') || !cliSearch.includes('Second Battle of Panipat')) {
  throw new Error(`Unexpected CLI search output: ${cliSearch}`);
}
console.log('✓ Headless Python CLI tool verified with --year, --format json, and --search');

// 4. Test Browser window.atlasAPI and WebMCP
console.log(`4. Testing window.atlasAPI & WebMCP in browser (${target})...`);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

page.on('pageerror', err => {
  console.error('Page error:', err);
  process.exit(1);
});

await page.goto(baseFileUrl, { waitUntil: 'load' });

// Test atlasAPI methods
const apiCheck = await page.evaluate(() => {
  const api = window.atlasAPI;
  if (!api) return { ok: false, error: 'window.atlasAPI missing' };

  const info = api.inspect();
  const place = api.resolvePlace('pataliputra');
  const ashokaRulers = api.getRulers(-250);
  const searchHits = api.search('maurya');

  return {
    ok: true,
    hasInspect: !!info.era,
    placeFound: place && place.id === 0,
    hasRulers: ashokaRulers.length > 0,
    searchCount: searchHits.length
  };
});

if (!apiCheck.ok || !apiCheck.hasInspect || !apiCheck.placeFound || !apiCheck.hasRulers || apiCheck.searchCount === 0) {
  throw new Error(`atlasAPI verification failed: ${JSON.stringify(apiCheck)}`);
}

// Test WebMCP in-page interface
const webMcpCheck = await page.evaluate(async () => {
  const mcp = window.modelContext;
  if (!mcp || typeof mcp.invoke !== 'function') return { ok: false, error: 'window.modelContext missing' };

  const eraRes = await mcp.invoke('inspect_current_era', {});
  await mcp.invoke('set_atlas_year', { year: 1526 });
  const newYear = window.atlas.st.year;

  return {
    ok: true,
    hasEra: !!eraRes.era,
    yearUpdated: newYear === 1526
  };
});

if (!webMcpCheck.ok || !webMcpCheck.hasEra || !webMcpCheck.yearUpdated) {
  throw new Error(`WebMCP verification failed: ${JSON.stringify(webMcpCheck)}`);
}
console.log('✓ window.atlasAPI & WebMCP verified in live browser session');

await browser.close();
console.log(`✅ All Phase 6 AI & Agent Integration tests passed on ${target}!`);
