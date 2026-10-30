import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('public');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('index references only files that exist in the package', () => {
  const html = read('index.html');
  const refs = [...html.matchAll(/(?:src|href)="(\/[^"?#]+)"/g)].map(match => match[1]);
  for (const ref of refs) {
    const target = path.join(root, ref.replace(/^\//, ''));
    assert.equal(fs.existsSync(target), true, `Missing referenced file: ${ref}`);
  }
});

test('all static DOM ids used through $() exist in index.html', () => {
  const html = read('index.html');
  const app = read('js/app.mjs');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]));
  const used = new Set([...app.matchAll(/\$\('([^']+)'\)/g)].map(match => match[1]));
  for (const id of used) assert.equal(ids.has(id), true, `Missing DOM id #${id}`);
});

test('requested copy changes are present and explanatory copy is removed', () => {
  const html = read('index.html');
  assert.match(html, /data-i18n="drillsTitle">Drills</);
  assert.match(html, /data-i18n="roundsTitle">Rounds</);
  assert.doesNotMatch(html, /Drills com alternancia automatica/i);
  assert.doesNotMatch(html, /Configure ate 4 atletas/i);
  assert.doesNotMatch(html, /Rounds simples/i);
  assert.doesNotMatch(html, /Configure preparacao/i);
});

test('technique UI is free text only and presets are not rendered', () => {
  const html = read('index.html');
  const app = read('js/app.mjs');
  assert.doesNotMatch(html, /Escolher tecnica/i);
  assert.doesNotMatch(app, /TECHNIQUE_PRESETS/);
  assert.doesNotMatch(app, /data-tech-preset/);
  assert.match(app, /data-tech-custom/);
});

test('PT and EN language toggle is included', () => {
  const html = read('index.html');
  const app = read('js/app.mjs');
  assert.match(html, /data-lang="pt-BR"/);
  assert.match(html, /data-lang="en"/);
  assert.match(app, /'pt-BR'/);
  assert.match(app, /\ben:\s*\{/);
});

test('boxing bell choices replace the previous UI choices', () => {
  const html = read('index.html');
  assert.match(html, /value="ring"/);
  assert.match(html, /value="double"/);
  assert.match(html, /value="vintage"/);
  assert.doesNotMatch(html, /value="classic"/);
  assert.doesNotMatch(html, /value="gong"/);
  assert.doesNotMatch(html, /value="digital"/);
});

test('provided Awaken logo is used for app identity', () => {
  const html = read('index.html');
  assert.match(html, /\/assets\/icon-192\.png/);
  assert.equal(fs.existsSync(path.join(root, 'assets/logo-awaken.png')), true);
  assert.equal(fs.existsSync(path.join(root, 'assets/icon-192.png')), true);
  assert.equal(fs.existsSync(path.join(root, 'assets/icon-512.png')), true);
  assert.equal(fs.existsSync(path.join(root, 'assets/apple-touch-icon.png')), true);
});

test('manifest has installable app icons and standalone display', () => {
  const manifest = JSON.parse(read('manifest.webmanifest'));
  assert.equal(manifest.display, 'standalone');
  assert.ok(manifest.icons.some(icon => icon.sizes === '192x192'));
  assert.ok(manifest.icons.some(icon => icon.sizes === '512x512'));
  for (const icon of manifest.icons) {
    assert.equal(fs.existsSync(path.join(root, icon.src.replace(/^\//, ''))), true, `Missing manifest icon: ${icon.src}`);
  }
});

test('service worker core cache points to existing assets', () => {
  const sw = read('sw.js');
  const coreBlock = sw.match(/const CORE = \[([\s\S]*?)\];/);
  assert.ok(coreBlock, 'CORE cache array not found');
  const entries = [...coreBlock[1].matchAll(/'([^']+)'/g)].map(match => match[1]);
  for (const entry of entries) {
    if (entry === '/') continue;
    assert.equal(fs.existsSync(path.join(root, entry.replace(/^\//, ''))), true, `Missing SW asset: ${entry}`);
  }
});


test('infinite mode and fullscreen technique toggle are present', () => {
  const html = read('index.html');
  const app = read('js/app.mjs');
  assert.match(html, /data-mode="infinite"/);
  assert.match(html, />∞<\/button>/);
  assert.match(html, /id="showTechniqueFullscreen"/);
  assert.match(app, /techniqueCueSeconds: state\.settings\.showTechniqueFullscreen \? 2 : 0/);
  assert.match(app, /this\.mode === 'infinite'/);
});

test('uploaded sound effects are selectable and cached', () => {
  const html = read('index.html');
  const sw = read('sw.js');
  for (const name of ['boxing-bell.mp3', 'im-gonna-smash-your-boy.mp3', 'faaah.mp3', 'dry-fart.mp3']) {
    assert.equal(fs.existsSync(path.join(root, 'assets/audio', name)), true);
    assert.match(sw, new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(html, /value="boxing"/);
  assert.match(html, /value="smash"/);
  assert.match(html, /value="faaah"/);
  assert.match(html, /value="fart"/);
});
