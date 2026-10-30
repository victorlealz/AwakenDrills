import test from 'node:test';
import assert from 'node:assert/strict';
import { assignUniqueColors, buildDrillPlan, buildSparringPlan, formatTime, getContrastColor, parseTechniques } from '../public/js/engine.mjs';

test('formatTime formats and rounds up remaining seconds', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(1.01), '00:02');
  assert.equal(formatTime(65), '01:05');
});

test('drill plan alternates up to four athletes and repeats sets', () => {
  const athletes = [
    { name: 'A', color: '#0A84FF', techniques: ['Armbar', 'Triangle'] },
    { name: 'B', color: '#F5F7FA', techniques: ['Pass'] },
    { name: 'C', color: '#050608', techniques: [] },
    { name: 'D', color: '#FF453A', techniques: ['Takedown'] }
  ];
  const plan = buildDrillPlan({ athletes, workSeconds: 30, prepSeconds: 5, sets: 2 });
  assert.equal(plan.length, 16);
  assert.deepEqual(plan.slice(0, 4).map(p => p.kind), ['prepare', 'drill', 'prepare', 'drill']);
  assert.equal(plan[0].athleteName, 'A');
  assert.equal(plan[8].athleteName, 'A');
  assert.equal(plan[8].technique, 'Triangle');
});

test('drill plan works with no techniques selected', () => {
  const plan = buildDrillPlan({
    athletes: [{ name: 'A', color: '#0A84FF', techniques: [] }],
    workSeconds: 20,
    prepSeconds: 5,
    sets: 1
  });
  assert.equal(plan.length, 2);
  assert.equal(plan[0].technique, '');
  assert.equal(plan[1].technique, '');
});

test('sparring plan includes prepare, rounds and rests', () => {
  const plan = buildSparringPlan({ prepSeconds: 10, roundSeconds: 300, restSeconds: 60, rounds: 3 });
  assert.deepEqual(plan.map(p => p.kind), ['prepare', 'sparring', 'rest', 'sparring', 'rest', 'sparring']);
});

test('techniques accept line, comma and semicolon separated input', () => {
  assert.deepEqual(parseTechniques('Armbar\nTriangle, Sweep; Pass'), ['Armbar', 'Triangle', 'Sweep', 'Pass']);
});

test('active athlete colors are normalized to unique values', () => {
  const athletes = [
    { name: 'A', color: '#0A84FF' },
    { name: 'B', color: '#0A84FF' },
    { name: 'C', color: '#0A84FF' },
    { name: 'D', color: '#0A84FF' }
  ];
  const palette = ['#0A84FF', '#F5F7FA', '#050608', '#FF453A', '#30D158', '#BF5AF2'];
  const normalized = assignUniqueColors(athletes, 4, palette);
  assert.equal(new Set(normalized.map(item => item.color)).size, 4);
  assert.deepEqual(normalized.map(item => item.color), palette.slice(0, 4));
});

test('contrast is readable on white and black backgrounds', () => {
  assert.equal(getContrastColor('#FFFFFF'), '#050608');
  assert.equal(getContrastColor('#050608'), '#FFFFFF');
});


test('drill plan can insert a two-second fullscreen technique cue before work', () => {
  const plan = buildDrillPlan({
    athletes: [{ name: 'A', color: '#0A84FF', techniques: ['Armbar'] }],
    workSeconds: 30,
    prepSeconds: 5,
    sets: 1,
    techniqueCueSeconds: 2
  });
  assert.deepEqual(plan.map(p => p.kind), ['prepare', 'techniqueCue', 'drill']);
  assert.equal(plan[1].duration, 2);
  assert.equal(plan[2].duration, 30);
});
