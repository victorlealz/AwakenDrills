import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assignUniqueColors,
  buildDrillPlan,
  buildSparringPlan,
  formatTime,
  getContrastColor,
  normalizeTechniques,
  techniqueFor
} from '../public/js/engine.mjs';

test('formatTime clamps and formats seconds', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(61), '01:01');
  assert.equal(formatTime(-10), '00:00');
});

test('normalizeTechniques preserves insertion order and ignores blanks', () => {
  assert.deepEqual(
    normalizeTechniques({ techniques: ['  Armbar ', '', 'Triangle', '  Omoplata  '] }),
    ['Armbar', 'Triangle', 'Omoplata']
  );
});

test('techniqueFor rotates each athlete own techniques by set', () => {
  const athlete = { techniques: ['A', 'B', 'C'] };
  assert.equal(techniqueFor(athlete, 0), 'A');
  assert.equal(techniqueFor(athlete, 1), 'B');
  assert.equal(techniqueFor(athlete, 2), 'C');
  assert.equal(techniqueFor(athlete, 3), 'A');
});

test('assignUniqueColors repairs duplicate active colors', () => {
  const palette = ['#1', '#2', '#3'];
  const result = assignUniqueColors([{ color:'#1' }, { color:'#1' }, { color:'#3' }], 3, palette);
  assert.deepEqual(result.map(x => x.color), ['#1', '#2', '#3']);
});

test('two athletes and multiple techniques keep independent ordered queues across all sets', () => {
  const plan = buildDrillPlan({
    athletes: [
      { name:'Atleta A', color:'#1', techniques:['A1','A2','A3'] },
      { name:'Atleta B', color:'#2', techniques:['B1','B2'] }
    ],
    workSeconds: 60,
    prepSeconds: 5,
    sets: 4,
    techniqueCueSeconds: 2
  });

  const cues = plan.filter(x => x.kind === 'techniqueCue');
  assert.deepEqual(
    cues.map(x => [x.athleteName, x.technique, x.setNumber, x.duration]),
    [
      ['Atleta A','A1',1,2], ['Atleta B','B1',1,2],
      ['Atleta A','A2',2,2], ['Atleta B','B2',2,2],
      ['Atleta A','A3',3,2], ['Atleta B','B1',3,2],
      ['Atleta A','A1',4,2], ['Atleta B','B2',4,2]
    ]
  );
});

test('each technique cue is immediately before the matching athlete drill', () => {
  const plan = buildDrillPlan({
    athletes: [
      { name:'A', color:'#1', techniques:['armbar','triangle'] },
      { name:'B', color:'#2', techniques:['pass','mount'] }
    ],
    workSeconds: 30,
    prepSeconds: 3,
    sets: 2,
    techniqueCueSeconds: 2
  });

  for (let index = 0; index < plan.length; index += 1) {
    if (plan[index].kind !== 'techniqueCue') continue;
    const next = plan[index + 1];
    assert.equal(next.kind, 'drill');
    assert.equal(next.athleteName, plan[index].athleteName);
    assert.equal(next.technique, plan[index].technique);
    assert.equal(next.setNumber, plan[index].setNumber);
  }
});

test('athletes without techniques skip only their cue while others keep theirs', () => {
  const plan = buildDrillPlan({
    athletes: [
      { name:'Sem técnica', techniques:[] },
      { name:'Com técnica', techniques:['Passagem 1','Passagem 2'] },
      { name:'Também sem', techniques:[] }
    ],
    workSeconds: 20,
    prepSeconds: 0,
    sets: 2,
    techniqueCueSeconds: 2
  });

  assert.deepEqual(
    plan.map(x => `${x.kind}:${x.athleteName}:${x.technique || '-'}`),
    [
      'drill:Sem técnica:-',
      'techniqueCue:Com técnica:Passagem 1',
      'drill:Com técnica:Passagem 1',
      'drill:Também sem:-',
      'drill:Sem técnica:-',
      'techniqueCue:Com técnica:Passagem 2',
      'drill:Com técnica:Passagem 2',
      'drill:Também sem:-'
    ]
  );
});

test('buildDrillPlan creates prep -> cue -> drill for every athlete that has a technique', () => {
  const plan = buildDrillPlan({
    athletes: [
      { name:'A', color:'#1', techniques:['armbar','triangle'] },
      { name:'B', color:'#2', techniques:['pass'] }
    ],
    workSeconds: 60,
    prepSeconds: 5,
    sets: 2,
    techniqueCueSeconds: 2
  });
  assert.equal(plan.filter(x => x.kind === 'drill').length, 4);
  assert.equal(plan.filter(x => x.kind === 'prepare').length, 4);
  assert.equal(plan.filter(x => x.kind === 'techniqueCue').length, 4);
  assert.ok(plan.filter(x => x.kind === 'techniqueCue').every(x => x.duration === 2));
  assert.deepEqual(plan.filter(x => x.kind === 'techniqueCue').map(x => x.technique), ['armbar','pass','triangle','pass']);
});

test('buildSparringPlan includes prep, rounds and rests', () => {
  const plan = buildSparringPlan({ prepSeconds:10, roundSeconds:300, restSeconds:60, rounds:3 });
  assert.deepEqual(plan.map(x => x.kind), ['prepare','sparring','rest','sparring','rest','sparring']);
});

test('getContrastColor chooses readable foreground', () => {
  assert.equal(getContrastColor('#FFFFFF'), '#050608');
  assert.equal(getContrastColor('#050608'), '#FFFFFF');
});

test('four athletes all receive their own cues in athlete order for every set', () => {
  const plan = buildDrillPlan({
    athletes: [
      { name:'A', techniques:['A1','A2'] },
      { name:'B', techniques:['B1','B2'] },
      { name:'C', techniques:['C1','C2'] },
      { name:'D', techniques:['D1','D2'] }
    ],
    workSeconds: 10,
    prepSeconds: 0,
    sets: 2,
    techniqueCueSeconds: 2
  });

  assert.deepEqual(
    plan.filter(phase => phase.kind === 'techniqueCue').map(phase => `${phase.athleteName}:${phase.technique}`),
    ['A:A1','B:B1','C:C1','D:D1','A:A2','B:B2','C:C2','D:D2']
  );
});
