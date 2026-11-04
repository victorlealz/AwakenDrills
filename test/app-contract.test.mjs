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

test('service worker cache key is bumped so deployed clients receive the updated app', () => {
  assert.match(sw, /awaken-drills-v5\.4\.3/);
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

test('immersive timer click logic does not use the old exit-on-center-click condition', () => {
  assert.ok(!app.includes("!runner.current()?.kind==='techniqueCue'"));
  assert.ok(!app.includes("runner.current()?.kind !== 'techniqueCue'"));
});

test('zero prepare starts a direct drill or sparring phase with the selected bell after fullscreen', () => {
  const block = app.match(/async function startPreparedTimer\([\s\S]*?\n\}/)?.[0] || '';
  assert.ok(block.includes("['drill', 'sparring'].includes(plan[0]?.kind)"));
  assert.ok(block.includes('audio.bell()'));
  assert.ok(block.indexOf('await enterImmersive()') < block.indexOf('audio.bell()'));
  assert.ok(block.indexOf('audio.bell()') < block.indexOf('runner.play()'));
});

test('session completion always rings once before rendering the done state', () => {
  const block = app.match(/completePhase\(\) \{[\s\S]*?\n  \}/)?.[0] || '';
  const finalBlock = block.match(/if \(!next\) \{[\s\S]*?\n    \}/)?.[0] || '';
  assert.ok(finalBlock.includes('audio.bell()'));
  assert.ok(finalBlock.includes("this.controlState = 'done'"));
  assert.ok(finalBlock.indexOf('audio.bell()') < finalBlock.indexOf("this.controlState = 'done'"));
});

test('completed timer renders FIM or END on the existing timer screen with red background', () => {
  assert.match(app, /phaseEnd:'FIM'/);
  assert.match(app, /phaseEnd:'END'/);
  assert.match(app, /background = '#FF453A'/);
  assert.match(app, /\? t\('phaseEnd'\)/);
});

test('sparring keeps Rounds and uses Tempo de Luta for the round duration label in Portuguese', () => {
  assert.match(index, /data-i18n="rounds">Rounds</);
  assert.match(index, /data-i18n="round">Tempo de Luta</);
  assert.match(app, /round:'Tempo de Luta'/);
});

test('immersive screen click toggles pause without exiting fullscreen', () => {
  const centerBlock = app.match(/\$\('timerCenter'\)\.onclick = \(\) => \{[\s\S]*?\n  \};/)?.[0] || '';
  const cueBlock = app.match(/\$\('techniqueCue'\)\.onclick = \(\) => \{[\s\S]*?\n  \};/)?.[0] || '';
  assert.ok(centerBlock.includes('runner.toggle()'));
  assert.ok(cueBlock.includes('runner.toggle()'));
  assert.ok(!centerBlock.includes('exitImmersive()'));
  assert.ok(!cueBlock.includes('exitImmersive()'));
});
