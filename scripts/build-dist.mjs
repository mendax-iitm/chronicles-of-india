// Single-file offline build: index.html + CSS + Data + JS → dist/atlas.html
// Usage: node scripts/build-dist.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

process.chdir(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

mkdirSync('dist', { recursive: true });

const css = readFileSync('css/atlas.css', 'utf8');

const dataScripts = [
  'data/base.js',
  'data/regions.js',
  'data/snapshots.js',
  'data/rulers.js',
  'data/divisions.js',
  'data/places.js',
  'data/events.js',
  'data/journeys.js',
  'data/corridors.js',
  'data/modern.js'
].map(file => {
  const content = readFileSync(file, 'utf8');
  const eqIdx = content.indexOf('=');
  if (eqIdx > 0 && content.includes('window.ATLAS_')) {
    const prefix = content.slice(0, eqIdx + 1);
    const rest = content.slice(eqIdx + 1).trim().replace(/;$/, '');
    try {
      const parsed = JSON.parse(rest);
      return prefix + JSON.stringify(parsed) + ';';
    } catch {
      return content;
    }
  }
  return content;
}).join('\n');

const jsScripts = [
  'js/i18n.js',
  'js/projection.js',
  'js/render.js',
  'js/timeline.js',
  'js/panel.js',
  'js/share.js',
  'js/api.js',
  'js/atlas.js'
].map(file => readFileSync(file, 'utf8')).join('\n');

const html = readFileSync('index.html', 'utf8');

// Replace external CSS with inlined style
let bundled = html.replace('<link rel="stylesheet" href="css/atlas.css">', `<style>\n${css}\n</style>`);

// Replace external scripts with inlined scripts
const scriptsRegex = /<!-- Base geodata[\s\S]*?<!-- Atlas application modules[\s\S]*?<script src="js\/atlas\.js"><\/script>/;
const inlinedScripts = `<script>\n${dataScripts}\n${jsScripts}\n</script>`;

bundled = bundled.replace(scriptsRegex, inlinedScripts);

writeFileSync('dist/atlas.html', bundled);
const sizeKb = (Buffer.byteLength(bundled, 'utf8') / 1024).toFixed(1);
console.log(`Single-file offline bundle generated: dist/atlas.html (${sizeKb} KB)`);
