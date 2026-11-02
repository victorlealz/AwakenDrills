import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const app = fs.readFileSync(new URL('../public/js/app.mjs', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../public/index.html', import.meta.url), 'utf8');
const sw = fs.readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');

test('drill uses a fixed two-second technique cue', () => {
  assert.match(app, /techniqueCueSeconds:\s*2/);
});

test('timer waits for immersive/fullscreen before starting the runner', () => {
  const block = app.match(/async function startPreparedTimer\([\s\S]*?\n\}/)?.[0] || '';
  assert.ok(block.includes('prepareTimer(plan, mode)'));
  assert.ok(block.includes('await enterImmersive()'));
  assert.ok(block.includes('runner.play()'));
  assert.ok(block.indexOf('await enterImmersive()') < block.indexOf('runner.play()'));
});

test('original sound choices are present in UI and mapped to their source clips', () => {
  for (const value of ['boxing', 'smash', 'faaah', 'fart']) {
    assert.ok(index.includes(`value="${value}"`));
  }
  assert.match(app, /boxing-bell\.mp3/);
  assert.match(app, /im-gonna-smash-your-boy\.mp3/);
  assert.match(app, /faaah\.mp3/);
  assert.match(app, /dry-fart_3\.mp3/);
});

test('user-supplied Awaken logo is the canonical local brand image', () => {
  assert.match(index, /id="brandLogo" src="\/assets\/logo\.png"/);
  assert.ok(!index.includes('raw.githubusercontent.com/victorlealz/awaken-bjj'));
});

test('service worker caches local logo assets and original sound sources when available', () => {
  assert.match(sw, /\/assets\/logo\.png/);
  assert.match(sw, /\/assets\/logo-awaken\.png/);
  assert.ok(!sw.includes('raw.githubusercontent.com/victorlealz/awaken-bjj'));
  assert.match(sw, /boxing-bell\.mp3/);
  assert.match(sw, /im-gonna-smash-your-boy\.mp3/);
  assert.match(sw, /faaah\.mp3/);
  assert.match(sw, /dry-fart_3\.mp3/);
});

test('immersive timer click logic does not use the old operator-precedence bug', () => {
  assert.ok(!app.includes("!runner.current()?.kind==='techniqueCue'"));
  assert.ok(app.includes("runner.current()?.kind !== 'techniqueCue'"));
});
