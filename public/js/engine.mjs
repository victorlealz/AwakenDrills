export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

export function formatTime(seconds) {
  const total = Math.max(0, Math.ceil(Number(seconds) || 0));
  const minutes = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function parseTechniques(value) {
  return String(value || '')
    .split(/[\n,;]+/)
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function techniqueFor(athlete, setIndex) {
  const techniques = Array.isArray(athlete?.techniques) ? athlete.techniques : [];
  return techniques.length ? techniques[setIndex % techniques.length] : '';
}

export function assignUniqueColors(athletes, activeCount = 4, palette = []) {
  const source = Array.isArray(athletes) ? athletes : [];
  const colors = Array.isArray(palette) && palette.length ? palette : ['#0A84FF', '#F5F7FA', '#050608', '#FF453A'];
  const count = Math.max(0, Math.min(Number(activeCount) || 0, source.length));
  const used = new Set();

  return source.map((athlete, index) => {
    if (index >= count) return { ...athlete };
    let color = athlete?.color;
    if (!colors.includes(color) || used.has(color)) {
      color = colors.find(candidate => !used.has(candidate)) || colors[index % colors.length];
    }
    used.add(color);
    return { ...athlete, color };
  });
}

export function buildDrillPlan({ athletes, workSeconds, prepSeconds, sets, techniqueCueSeconds = 0 }) {
  const activeAthletes = (athletes || []).slice(0, 4).filter(Boolean);
  if (!activeAthletes.length) throw new Error('At least one athlete is required.');
  const work = clamp(workSeconds, 1, 60 * 60);
  const prep = clamp(prepSeconds, 0, 60 * 10);
  const totalSets = clamp(sets, 1, 20);
  const cue = clamp(techniqueCueSeconds, 0, 10);
  const phases = [];

  for (let setIndex = 0; setIndex < totalSets; setIndex += 1) {
    activeAthletes.forEach((athlete, athleteIndex) => {
      const technique = techniqueFor(athlete, setIndex);
      const shared = {
        athleteIndex,
        athleteName: athlete.name || `Athlete ${athleteIndex + 1}`,
        color: athlete.color || '#0A84FF',
        technique,
        setIndex,
        setNumber: setIndex + 1,
        totalSets
      };
      if (prep > 0) phases.push({ ...shared, kind: 'prepare', duration: prep });
      if (cue > 0 && technique) phases.push({ ...shared, kind: 'techniqueCue', duration: cue });
      phases.push({ ...shared, kind: 'drill', duration: work });
    });
  }
  return phases;
}

export function buildSparringPlan({ prepSeconds, roundSeconds, restSeconds, rounds }) {
  const prep = clamp(prepSeconds, 0, 60 * 10);
  const round = clamp(roundSeconds, 1, 60 * 60);
  const rest = clamp(restSeconds, 0, 60 * 30);
  const totalRounds = clamp(rounds, 1, 30);
  const phases = [];

  if (prep > 0) phases.push({ kind: 'prepare', duration: prep, roundNumber: 1, totalRounds });
  for (let index = 0; index < totalRounds; index += 1) {
    phases.push({ kind: 'sparring', duration: round, roundNumber: index + 1, totalRounds });
    if (index < totalRounds - 1 && rest > 0) {
      phases.push({ kind: 'rest', duration: rest, roundNumber: index + 1, nextRoundNumber: index + 2, totalRounds });
    }
  }
  return phases;
}

export function getContrastColor(hex) {
  const normalized = String(hex || '').replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map(char => char + char).join('')
    : normalized.padEnd(6, '0').slice(0, 6);
  const r = parseInt(value.slice(0, 2), 16) || 0;
  const g = parseInt(value.slice(2, 4), 16) || 0;
  const b = parseInt(value.slice(4, 6), 16) || 0;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? '#050608' : '#FFFFFF';
}
