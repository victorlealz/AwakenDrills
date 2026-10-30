import { assignUniqueColors, buildDrillPlan, buildSparringPlan, formatTime, getContrastColor } from './engine.mjs';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'awaken-drills-v5';
const LEGACY_STORAGE_KEY = 'awaken-drills-v4';
const PALETTE = ['#0A84FF', '#F5F7FA', '#050608', '#FF453A', '#30D158', '#BF5AF2'];
const COLORS = [
  { key: 'colorBlue', value: '#0A84FF' },
  { key: 'colorWhite', value: '#F5F7FA' },
  { key: 'colorBlack', value: '#050608' },
  { key: 'colorRed', value: '#FF453A' },
  { key: 'colorGreen', value: '#30D158' },
  { key: 'colorPurple', value: '#BF5AF2' }
];

const I18N = {
  'pt-BR': {
    settings: 'Configura\u00e7\u00f5es', generalPreferences: 'Prefer\u00eancias gerais', language: 'Idioma',
    sound: 'Som', bellsAndAlerts: 'Sinos e alertas', bell: 'Sino', bellHelp: 'Som ao trocar ou finalizar',
    bellTypeLabel: 'Tipo de sino', bellRing: 'Ringue cl\u00e1ssico', bellDouble: 'Ringue duplo', bellVintage: 'Ringue vintage',
    bellBoxing: 'Boxing Bell', bellSmash: "I'm gonna smash your boy", bellFaaah: 'Faaah', bellFart: 'Dry Fart',
    previewBell: 'Ouvir sino', showTechniqueFullscreen: 'Mostrar t\u00e9cnica em fullscreen?', showTechniqueFullscreenHelp: 'Exibe a t\u00e9cnica por 2 segundos antes do drill',
    finalCountdown: 'Contagem final', finalCountdownHelp: 'Bipes em 3, 2 e 1 segundos',
    keepAwake: 'Manter tela ativa', keepAwakeHelp: 'Durante cron\u00f4metros em execu\u00e7\u00e3o', restoreDefaults: 'Restaurar padr\u00f5es',
    trainingType: 'Tipo de treino', drillsTitle: 'Drills', roundsTitle: 'Rounds', athletes: 'Atletas', setsPerAthlete: 'S\u00e9ries por atleta',
    prepare: 'Preparar', drillTime: 'Tempo do drill', colorIsBackground: 'Cor = fundo do cron\u00f4metro', startDrill: 'Iniciar drill',
    rounds: 'Rounds', round: 'Round', rest: 'Descanso', startSparring: 'Iniciar sparring', secShort: 'seg',
    drillMinutes: 'Minutos do drill', drillSeconds: 'Segundos do drill', roundMinutes: 'Minutos do round', roundSeconds: 'Segundos do round',
    restMinutes: 'Minutos de descanso', restSeconds: 'Segundos de descanso', timer: 'Cron\u00f4metro', back: 'Voltar', fullscreen: 'Tela cheia / modo foco',
    focusExitHint: 'No modo foco, toque no tempo para sair', nextTechnique: 'PR\u00d3XIMA T\u00c9CNICA', previousPhase: 'Fase anterior', nextPhase: 'Pr\u00f3xima fase',
    pause: 'Pausar', stop: 'Parar', continue: 'Continuar', start: 'Iniciar', done: 'Conclu\u00eddo', resetSession: 'Reiniciar sess\u00e3o', openSettings: 'Abrir configura\u00e7\u00f5es',
    athlete: 'Atleta', athleteDefault: 'Atleta {n}', name: 'Nome', technique: 'T\u00e9cnica', techniqueOptional: 'opcional', techniquePlaceholder: 'Digite uma t\u00e9cnica',
    add: 'Adicionar', removeTechnique: 'Remover {technique}', noTechnique: 'Nenhuma t\u00e9cnica', colorForAthlete: 'Cor do atleta {n}',
    colorBlue: 'Azul', colorWhite: 'Branco', colorBlack: 'Preto', colorRed: 'Vermelho', colorGreen: 'Verde', colorPurple: 'Roxo',
    colorAlreadyUsed: 'Essa cor j\u00e1 est\u00e1 sendo usada por outro atleta.', drillTimeRequired: 'Defina um tempo de drill maior que zero.',
    roundTimeRequired: 'Defina um tempo de round maior que zero.', enableSound: 'Ative o som para ouvir o sino.',
    restoreConfirm: 'Restaurar todas as configura\u00e7\u00f5es, atletas e t\u00e9cnicas?', restored: 'Padr\u00f5es restaurados.',
    sessionDone: 'Sess\u00e3o conclu\u00edda.', nextTechniqueAnnouncement: 'Pr\u00f3xima t\u00e9cnica: {technique}', setProgress: 'S\u00e9rie {current}/{total} \u00b7 {athlete}',
    roundProgress: 'Round {current}/{total}', nextRound: 'Pr\u00f3ximo: round {current}/{total}', phasePrepare: 'PREPARAR', phaseDrill: 'DRILL',
    phaseSparring: 'SPARRING', phaseRest: 'DESCANSO', phaseInfinite: 'CONTAGEM INFINITA', duplicateTechnique: 'Essa t\u00e9cnica j\u00e1 foi adicionada.',
    infiniteCount: 'Contagem Infinita', infiniteHelp: 'Cron\u00f4metro crescente de 00:00 at\u00e9 voc\u00ea parar.', startInfinite: 'Iniciar contagem'
  },
  en: {
    settings: 'Settings', generalPreferences: 'General preferences', language: 'Language',
    sound: 'Sound', bellsAndAlerts: 'Bells and alerts', bell: 'Bell', bellHelp: 'Sound when switching or finishing',
    bellTypeLabel: 'Bell type', bellRing: 'Classic ring bell', bellDouble: 'Double ring bell', bellVintage: 'Vintage ring bell',
    bellBoxing: 'Boxing Bell', bellSmash: "I'm gonna smash your boy", bellFaaah: 'Faaah', bellFart: 'Dry Fart',
    previewBell: 'Preview bell', showTechniqueFullscreen: 'Show technique fullscreen?', showTechniqueFullscreenHelp: 'Shows the technique for 2 seconds before the drill',
    finalCountdown: 'Final countdown', finalCountdownHelp: 'Beeps at 3, 2 and 1 seconds',
    keepAwake: 'Keep screen awake', keepAwakeHelp: 'While timers are running', restoreDefaults: 'Restore defaults',
    trainingType: 'Training type', drillsTitle: 'Drills', roundsTitle: 'Rounds', athletes: 'Athletes', setsPerAthlete: 'Sets per athlete',
    prepare: 'Get ready', drillTime: 'Drill time', colorIsBackground: 'Color = timer background', startDrill: 'Start drill',
    rounds: 'Rounds', round: 'Round', rest: 'Rest', startSparring: 'Start sparring', secShort: 'sec',
    drillMinutes: 'Drill minutes', drillSeconds: 'Drill seconds', roundMinutes: 'Round minutes', roundSeconds: 'Round seconds',
    restMinutes: 'Rest minutes', restSeconds: 'Rest seconds', timer: 'Timer', back: 'Back', fullscreen: 'Fullscreen / focus mode',
    focusExitHint: 'In focus mode, tap the time to exit', nextTechnique: 'NEXT TECHNIQUE', previousPhase: 'Previous phase', nextPhase: 'Next phase',
    pause: 'Pause', stop: 'Stop', continue: 'Continue', start: 'Start', done: 'Done', resetSession: 'Reset session', openSettings: 'Open settings',
    athlete: 'Athlete', athleteDefault: 'Athlete {n}', name: 'Name', technique: 'Technique', techniqueOptional: 'optional', techniquePlaceholder: 'Type a technique',
    add: 'Add', removeTechnique: 'Remove {technique}', noTechnique: 'No technique', colorForAthlete: 'Color for athlete {n}',
    colorBlue: 'Blue', colorWhite: 'White', colorBlack: 'Black', colorRed: 'Red', colorGreen: 'Green', colorPurple: 'Purple',
    colorAlreadyUsed: 'That color is already being used by another athlete.', drillTimeRequired: 'Set a drill time greater than zero.',
    roundTimeRequired: 'Set a round time greater than zero.', enableSound: 'Turn sound on to preview the bell.',
    restoreConfirm: 'Restore all settings, athletes and techniques?', restored: 'Defaults restored.',
    sessionDone: 'Session complete.', nextTechniqueAnnouncement: 'Next technique: {technique}', setProgress: 'Set {current}/{total} \u00b7 {athlete}',
    roundProgress: 'Round {current}/{total}', nextRound: 'Next: round {current}/{total}', phasePrepare: 'GET READY', phaseDrill: 'DRILL',
    phaseSparring: 'SPARRING', phaseRest: 'REST', phaseInfinite: 'INFINITE COUNT', duplicateTechnique: 'That technique has already been added.',
    infiniteCount: 'Infinite Count', infiniteHelp: 'Count-up timer from 00:00 until you stop it.', startInfinite: 'Start count'
  }
};

const defaultState = () => ({
  settings: {
    language: 'pt-BR',
    audioEnabled: true,
    bellType: 'ring',
    showTechniqueFullscreen: false,
    countdownBeeps: true,
    wakeLockEnabled: true
  },
  mode: 'drill',
  drill: {
    athleteCount: 2,
    sets: 2,
    prep: 5,
    minutes: 1,
    seconds: 0,
    athletes: [
      { name: '', color: '#0A84FF', techniques: [] },
      { name: '', color: '#F5F7FA', techniques: [] },
      { name: '', color: '#050608', techniques: [] },
      { name: '', color: '#FF453A', techniques: [] }
    ]
  },
  sparring: { rounds: 5, prep: 10, minutes: 5, seconds: 0, restMinutes: 1, restSeconds: 0 }
});

function interpolate(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

function t(key, vars = {}) {
  const language = state?.settings?.language === 'en' ? 'en' : 'pt-BR';
  return interpolate(I18N[language][key] || I18N['pt-BR'][key] || key, vars);
}

function cleanDefaultName(name) {
  const value = String(name || '').trim();
  return /^(Atleta|Athlete) [1-4]$/.test(value) ? '' : value;
}

function mapLegacyBell(value) {
  if (value === 'classic') return 'ring';
  if (value === 'digital') return 'double';
  if (value === 'gong') return 'vintage';
  return ['ring', 'double', 'vintage', 'boxing', 'smash', 'faaah', 'fart'].includes(value) ? value : 'ring';
}

function mergeState(saved) {
  const base = defaultState();
  if (!saved || typeof saved !== 'object') return base;
  const athleteCount = Math.min(4, Math.max(1, Number(saved.drill?.athleteCount) || base.drill.athleteCount));
  const mergedAthletes = base.drill.athletes.map((athlete, index) => ({
    ...athlete,
    ...(saved.drill?.athletes?.[index] || {}),
    name: cleanDefaultName(saved.drill?.athletes?.[index]?.name),
    techniques: Array.isArray(saved.drill?.athletes?.[index]?.techniques)
      ? saved.drill.athletes[index].techniques.map(value => String(value).trim()).filter(Boolean).slice(0, 20)
      : []
  }));
  const uniqueAthletes = assignUniqueColors(mergedAthletes, athleteCount, PALETTE);
  return {
    ...base,
    ...saved,
    settings: {
      ...base.settings,
      ...(saved.settings || {}),
      language: saved.settings?.language === 'en' ? 'en' : 'pt-BR',
      bellType: mapLegacyBell(saved.settings?.bellType)
    },
    drill: { ...base.drill, ...(saved.drill || {}), athleteCount, athletes: uniqueAthletes },
    sparring: { ...base.sparring, ...(saved.sparring || {}) }
  };
}

function loadState() {
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    return mergeState(JSON.parse(current || legacy || 'null'));
  } catch {
    return defaultState();
  }
}

let state = loadState();
let toastTimer = 0;
let wakeLock = null;

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage may be unavailable */ }
}

function toast(message) {
  const element = $('toast');
  clearTimeout(toastTimer);
  element.textContent = message;
  element.hidden = false;
  toastTimer = window.setTimeout(() => { element.hidden = true; }, 2600);
}

function asInt(value, fallback = 0, min = 0, max = 3600) {
  const number = Number.parseInt(value, 10);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

class AudioManager {
  constructor() {
    this.context = null;
    this.files = {
      boxing: '/assets/audio/boxing-bell.mp3',
      smash: '/assets/audio/im-gonna-smash-your-boy.mp3',
      faaah: '/assets/audio/faaah.mp3',
      fart: '/assets/audio/dry-fart.mp3'
    };
  }

  ensure() {
    if (!state.settings.audioEnabled) return null;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    if (!this.context) this.context = new Context();
    if (this.context.state === 'suspended') this.context.resume().catch(() => {});
    return this.context;
  }

  voice({ start = 0, duration = .25, frequency = 880, type = 'sine', volume = .30, endFrequency = null }) {
    const context = this.ensure();
    if (!context) return;
    const now = context.currentTime + start;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(.001, volume), now + .008);
    gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + .03);
  }

  beep() {
    if (!state.settings.audioEnabled) return;
    this.voice({ duration: .10, frequency: 1450, endFrequency: 1250, type: 'sine', volume: .22 });
  }

  ringStrike(start = 0, base = 720, duration = 1.18, volume = .19) {
    const partials = [
      [1.00, 1.00, 1.00],
      [1.48, .62, .92],
      [2.06, .38, .78],
      [2.71, .22, .64],
      [3.37, .12, .52]
    ];
    partials.forEach(([ratio, gain, decay]) => {
      const frequency = base * ratio;
      this.voice({
        start,
        duration: duration * decay,
        frequency,
        endFrequency: frequency * .985,
        type: ratio > 2 ? 'triangle' : 'sine',
        volume: volume * gain
      });
    });
    this.voice({ start, duration: .055, frequency: 2600, endFrequency: 2250, type: 'triangle', volume: volume * .24 });
  }

  playFile(type) {
    const src = this.files[type];
    if (!src || !state.settings.audioEnabled) return false;
    const clip = new Audio(src);
    clip.volume = 1;
    clip.play().catch(() => {});
    return true;
  }

  bell() {
    if (!state.settings.audioEnabled) return;
    const type = state.settings.bellType;
    if (this.playFile(type)) return;
    if (type === 'double') {
      this.ringStrike(0, 735, .92, .24);
      this.ringStrike(.26, 755, 1.08, .27);
      return;
    }
    if (type === 'vintage') {
      this.ringStrike(0, 610, 1.45, .30);
      this.ringStrike(.17, 620, 1.18, .18);
      return;
    }
    this.ringStrike(0, 725, 1.30, .30);
  }
}

const audio = new AudioManager();

async function requestWakeLock() {
  if (!state.settings.wakeLockEnabled || !('wakeLock' in navigator) || document.visibilityState !== 'visible') return;
  try {
    if (!wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; }, { once: true });
    }
  } catch { /* permission or browser state may prevent it */ }
}

async function releaseWakeLock() {
  if (!wakeLock) return;
  try { await wakeLock.release(); } catch { /* already released */ }
  wakeLock = null;
}

function normalizeActiveColors() {
  state.drill.athletes = assignUniqueColors(state.drill.athletes, state.drill.athleteCount, PALETTE);
}

function applySettingsToUI() {
  $('audioEnabled').checked = Boolean(state.settings.audioEnabled);
  $('bellType').value = ['ring', 'double', 'vintage', 'boxing', 'smash', 'faaah', 'fart'].includes(state.settings.bellType) ? state.settings.bellType : 'ring';
  $('showTechniqueFullscreen').checked = Boolean(state.settings.showTechniqueFullscreen);
  $('countdownBeeps').checked = Boolean(state.settings.countdownBeeps);
  $('wakeLockEnabled').checked = Boolean(state.settings.wakeLockEnabled);
}

function syncSetupUI() {
  $('athleteCount').value = String(state.drill.athleteCount);
  $('drillSets').value = String(state.drill.sets);
  $('drillPrep').value = String(state.drill.prep);
  $('drillMinutes').value = String(state.drill.minutes);
  $('drillSeconds').value = String(state.drill.seconds);
  $('sparringRounds').value = String(state.sparring.rounds);
  $('sparringPrep').value = String(state.sparring.prep);
  $('sparringMinutes').value = String(state.sparring.minutes);
  $('sparringSeconds').value = String(state.sparring.seconds);
  $('restMinutes').value = String(state.sparring.restMinutes);
  $('restSeconds').value = String(state.sparring.restSeconds);
}

function setMode(mode, persist = true) {
  const next = ['drill', 'sparring', 'infinite'].includes(mode) ? mode : 'drill';
  state.mode = next;
  document.querySelectorAll('.mode-button').forEach(button => {
    const active = button.dataset.mode === next;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('drillSetup').hidden = next !== 'drill';
  $('sparringSetup').hidden = next !== 'sparring';
  $('infiniteSetup').hidden = next !== 'infinite';
  if (persist) saveState();
}

function renderAthletes() {
  normalizeActiveColors();
  const container = $('athletesContainer');
  const count = Math.min(4, Math.max(1, state.drill.athleteCount));
  const activeColors = state.drill.athletes.slice(0, count).map(athlete => athlete.color);

  container.innerHTML = state.drill.athletes.slice(0, count).map((athlete, index) => {
    const displayName = athlete.name || t('athleteDefault', { n: index + 1 });
    const chips = athlete.techniques.length
      ? athlete.techniques.map((technique, techIndex) => `<span class="tech-chip">${escapeHtml(technique)}<button type="button" data-remove-tech="${techIndex}" data-athlete="${index}" aria-label="${escapeHtml(t('removeTechnique', { technique }))}">\u00d7</button></span>`).join('')
      : `<span class="empty-tech">${escapeHtml(t('noTechnique'))}</span>`;
    const colors = COLORS.map(color => {
      const selectedElsewhere = activeColors.some((value, athleteIndex) => athleteIndex !== index && value === color.value);
      const disabled = selectedElsewhere ? ' disabled aria-disabled="true"' : '';
      return `<button type="button" class="color-dot" data-color="${color.value}" data-athlete="${index}" style="--dot:${color.value}" aria-label="${escapeHtml(t(color.key))}" aria-pressed="${String(athlete.color === color.value)}"${disabled}></button>`;
    }).join('');
    return `
      <article class="athlete-card" data-athlete-card="${index}" style="--athlete-color:${athlete.color}">
        <div class="athlete-top">
          <div>
            <span class="athlete-number">${escapeHtml(t('athlete'))} ${index + 1}</span>
            <label class="field"><span>${escapeHtml(t('name'))}</span><input data-athlete-name="${index}" maxlength="28" autocomplete="off" value="${escapeHtml(displayName)}"></label>
          </div>
          <div class="color-picker" role="group" aria-label="${escapeHtml(t('colorForAthlete', { n: index + 1 }))}">${colors}</div>
        </div>
        <div class="tech-box">
          <div class="tech-box-header"><span>${escapeHtml(t('technique'))}</span><small>${escapeHtml(t('techniqueOptional'))}</small></div>
          <div class="tech-custom"><input data-tech-custom="${index}" maxlength="60" placeholder="${escapeHtml(t('techniquePlaceholder'))}" aria-label="${escapeHtml(t('technique'))}"><button type="button" data-add-custom="${index}">${escapeHtml(t('add'))}</button></div>
          <div class="tech-chips">${chips}</div>
        </div>
      </article>`;
  }).join('');
}

function addTechnique(athleteIndex, raw) {
  const value = String(raw || '').trim().replace(/\s+/g, ' ');
  if (!value) return;
  const athlete = state.drill.athletes[athleteIndex];
  if (!athlete) return;
  if (athlete.techniques.some(item => item.toLocaleLowerCase() === value.toLocaleLowerCase())) {
    toast(t('duplicateTechnique'));
    return;
  }
  athlete.techniques = [...athlete.techniques, value].slice(0, 20);
  saveState();
  renderAthletes();
}

function collectSetupState() {
  state.drill.athleteCount = asInt($('athleteCount').value, 2, 1, 4);
  state.drill.sets = asInt($('drillSets').value, 2, 1, 20);
  state.drill.prep = asInt($('drillPrep').value, 5, 0, 600);
  state.drill.minutes = asInt($('drillMinutes').value, 1, 0, 60);
  state.drill.seconds = asInt($('drillSeconds').value, 0, 0, 59);
  state.sparring.rounds = asInt($('sparringRounds').value, 5, 1, 30);
  state.sparring.prep = asInt($('sparringPrep').value, 10, 0, 600);
  state.sparring.minutes = asInt($('sparringMinutes').value, 5, 0, 60);
  state.sparring.seconds = asInt($('sparringSeconds').value, 0, 0, 59);
  state.sparring.restMinutes = asInt($('restMinutes').value, 1, 0, 30);
  state.sparring.restSeconds = asInt($('restSeconds').value, 0, 0, 59);
  normalizeActiveColors();
  saveState();
}

class TimerRunner {
  constructor() {
    this.plan = [];
    this.mode = 'drill';
    this.index = 0;
    this.remainingMs = 0;
    this.elapsedMs = 0;
    this.endAt = 0;
    this.startedAt = 0;
    this.running = false;
    this.frame = 0;
    this.lastBeepSecond = null;
    this.controlState = 'start';
  }

  load(plan, mode) {
    this.stopFrame();
    this.plan = plan;
    this.mode = mode;
    this.index = 0;
    this.running = false;
    this.remainingMs = (plan[0]?.duration || 0) * 1000;
    this.elapsedMs = 0;
    this.startedAt = 0;
    this.lastBeepSecond = null;
    this.controlState = 'start';
    this.render();
  }

  current() { return this.plan[this.index]; }

  updateControlText() {
    const key = this.mode === 'infinite' && this.controlState === 'pause' ? 'stop' : this.controlState;
    $('playPause').textContent = t(key);
  }

  play() {
    if (!this.current() || this.controlState === 'done') return;
    this.running = true;
    if (this.mode === 'infinite') {
      this.startedAt = Date.now() - this.elapsedMs;
    } else {
      if (this.remainingMs <= 0) this.remainingMs = this.current().duration * 1000;
      this.endAt = Date.now() + this.remainingMs;
    }
    this.lastBeepSecond = null;
    this.controlState = 'pause';
    this.updateControlText();
    audio.ensure();
    requestWakeLock();
    this.loop();
  }

  pause() {
    if (!this.running) return;
    if (this.mode === 'infinite') this.elapsedMs = Math.max(0, Date.now() - this.startedAt);
    else this.remainingMs = Math.max(0, this.endAt - Date.now());
    this.running = false;
    this.stopFrame();
    this.controlState = 'continue';
    this.updateControlText();
    releaseWakeLock();
    this.render();
  }

  toggle() { this.running ? this.pause() : this.play(); }

  stopFrame() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  loop() {
    this.stopFrame();
    const tick = () => {
      if (!this.running) return;
      if (this.mode === 'infinite') {
        this.elapsedMs = Math.max(0, Date.now() - this.startedAt);
      } else {
        this.remainingMs = Math.max(0, this.endAt - Date.now());
      }
      this.render();
      if (this.mode !== 'infinite' && this.remainingMs <= 0) {
        this.completePhase();
        return;
      }
      this.frame = requestAnimationFrame(tick);
    };
    tick();
  }

  completePhase() {
    this.stopFrame();
    this.running = false;
    this.remainingMs = 0;
    this.render();
    if (this.current()?.kind !== 'techniqueCue') audio.bell();
    if (this.index < this.plan.length - 1) {
      this.index += 1;
      this.remainingMs = this.current().duration * 1000;
      this.lastBeepSecond = null;
      this.render();
      this.play();
    } else {
      this.controlState = 'done';
      this.updateControlText();
      $('announcement').textContent = t('sessionDone');
      releaseWakeLock();
    }
  }

  go(delta) {
    if (!this.plan.length || this.mode === 'infinite') return;
    const wasRunning = this.running;
    this.stopFrame();
    this.running = false;
    this.index = Math.min(this.plan.length - 1, Math.max(0, this.index + delta));
    this.remainingMs = this.current().duration * 1000;
    this.lastBeepSecond = null;
    this.controlState = wasRunning ? 'pause' : 'continue';
    this.render();
    if (wasRunning) this.play();
    else this.updateControlText();
  }

  reset() {
    if (!this.plan.length) return;
    this.stopFrame();
    this.running = false;
    this.index = 0;
    this.elapsedMs = 0;
    this.startedAt = 0;
    this.remainingMs = this.mode === 'infinite' ? 0 : this.current().duration * 1000;
    this.lastBeepSecond = null;
    this.controlState = 'start';
    releaseWakeLock();
    this.render();
  }

  render() {
    const phase = this.current();
    if (!phase) {
      this.updateControlText();
      return;
    }
    const isInfinite = this.mode === 'infinite' || phase.kind === 'infinite';
    const totalMs = Math.max(1, phase.duration * 1000);
    const seconds = Math.ceil(this.remainingMs / 1000);
    if (isInfinite) {
      const elapsedSeconds = Math.floor(this.elapsedMs / 1000);
      const minutes = Math.floor(elapsedSeconds / 60);
      const secs = elapsedSeconds % 60;
      $('clock').textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      $('phaseBarFill').style.width = '0%';
    } else {
      $('clock').textContent = formatTime(this.remainingMs / 1000);
      $('phaseBarFill').style.width = `${Math.min(100, Math.max(0, (1 - this.remainingMs / totalMs) * 100))}%`;
    }

    const countdownApplies = !isInfinite && phase.kind !== 'techniqueCue';
    if (this.running && countdownApplies && state.settings.countdownBeeps && seconds >= 1 && seconds <= 3 && seconds !== this.lastBeepSecond) {
      this.lastBeepSecond = seconds;
      audio.beep();
    }

    let background = '#050608';
    let label = '';
    let progress = '';
    let athlete = '';
    let technique = '';

    if (phase.kind === 'drill' || phase.kind === 'techniqueCue' || (phase.kind === 'prepare' && phase.athleteName)) {
      background = phase.color || '#0A84FF';
      athlete = phase.athleteName || '';
      technique = phase.technique || '';
      label = phase.kind === 'prepare' ? t('phasePrepare') : phase.kind === 'techniqueCue' ? t('technique') : t('phaseDrill');
      progress = t('setProgress', { current: phase.setNumber, total: phase.totalSets, athlete });
    } else if (phase.kind === 'sparring') {
      background = '#0A84FF';
      label = t('phaseSparring');
      progress = t('roundProgress', { current: phase.roundNumber, total: phase.totalRounds });
    } else if (phase.kind === 'rest') {
      background = '#F5F7FA';
      label = t('phaseRest');
      progress = t('nextRound', { current: phase.nextRoundNumber, total: phase.totalRounds });
    } else if (phase.kind === 'infinite') {
      background = '#050608';
      label = t('phaseInfinite');
      progress = '';
    } else {
      background = '#050608';
      label = t('phasePrepare');
      progress = phase.totalRounds ? t('roundProgress', { current: 1, total: phase.totalRounds }) : '';
    }

    const foreground = getContrastColor(background);
    const screen = $('timerScreen');
    screen.style.setProperty('--timer-bg', background);
    screen.style.setProperty('--timer-fg', foreground);
    $('phaseLabel').textContent = label;
    $('phaseProgress').textContent = progress;
    $('timerAthlete').textContent = athlete;
    $('currentTechnique').textContent = phase.kind === 'drill' && technique ? technique : '';

    const showCue = phase.kind === 'techniqueCue' && Boolean(technique);
    $('techniqueCue').hidden = !showCue;
    $('techniqueText').textContent = showCue ? technique : '';
    if (showCue) $('announcement').textContent = t('nextTechniqueAnnouncement', { technique });

    const infiniteControls = this.mode === 'infinite';
    $('previousPhase').hidden = infiniteControls;
    $('nextPhase').hidden = infiniteControls;
    $('phaseBarFill').parentElement.hidden = infiniteControls;
    $('timerScreen').classList.toggle('is-infinite', infiniteControls);
    this.updateControlText();
  }
}

const runner = new TimerRunner();

function applyLanguage() {
  const language = state.settings.language === 'en' ? 'en' : 'pt-BR';
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(element => {
    element.setAttribute('aria-label', t(element.dataset.i18nAria));
  });
  document.querySelectorAll('[data-i18n-title]').forEach(element => {
    element.setAttribute('title', t(element.dataset.i18nTitle));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === language));
  });
  renderAthletes();
  runner.render();
}

function setLanguage(language) {
  state.settings.language = language === 'en' ? 'en' : 'pt-BR';
  saveState();
  applyLanguage();
}

function showTimer(plan, mode) {
  $('settingsMenu').hidden = true;
  $('settingsToggle').setAttribute('aria-expanded', 'false');
  $('timerScreen').hidden = false;
  document.body.style.overflow = 'hidden';
  runner.load(plan, mode);
  runner.play();
}

async function exitImmersive() {
  document.body.classList.remove('immersive');
  try {
    if (document.fullscreenElement && document.exitFullscreen) await document.exitFullscreen();
  } catch { /* browser may refuse */ }
}

async function enterImmersive() {
  document.body.classList.add('immersive');
  const screen = $('timerScreen');
  try {
    if (screen.requestFullscreen && !document.fullscreenElement) await screen.requestFullscreen({ navigationUI: 'hide' });
  } catch { /* CSS fallback remains active */ }
}

function leaveTimer() {
  runner.pause();
  exitImmersive();
  $('timerScreen').hidden = true;
  document.body.style.overflow = '';
}

function startDrill() {
  collectSetupState();
  const workSeconds = state.drill.minutes * 60 + state.drill.seconds;
  if (workSeconds <= 0) { toast(t('drillTimeRequired')); return; }
  const athletes = state.drill.athletes.slice(0, state.drill.athleteCount).map((athlete, index) => ({
    ...athlete,
    name: athlete.name.trim() || t('athleteDefault', { n: index + 1 })
  }));
  audio.ensure();
  const plan = buildDrillPlan({
    athletes,
    workSeconds,
    prepSeconds: state.drill.prep,
    sets: state.drill.sets,
    techniqueCueSeconds: state.settings.showTechniqueFullscreen ? 2 : 0
  });
  showTimer(plan, 'drill');
}

function startSparring() {
  collectSetupState();
  const roundSeconds = state.sparring.minutes * 60 + state.sparring.seconds;
  const restSeconds = state.sparring.restMinutes * 60 + state.sparring.restSeconds;
  if (roundSeconds <= 0) { toast(t('roundTimeRequired')); return; }
  audio.ensure();
  const plan = buildSparringPlan({ prepSeconds: state.sparring.prep, roundSeconds, restSeconds, rounds: state.sparring.rounds });
  showTimer(plan, 'sparring');
}

function startInfinite() {
  audio.ensure();
  showTimer([{ kind: 'infinite', duration: 0 }], 'infinite');
}

function bindEvents() {
  document.querySelectorAll('.mode-button').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

  $('settingsToggle').addEventListener('click', event => {
    event.stopPropagation();
    const menu = $('settingsMenu');
    menu.hidden = !menu.hidden;
    $('settingsToggle').setAttribute('aria-expanded', String(!menu.hidden));
  });
  $('settingsMenu').addEventListener('click', event => event.stopPropagation());
  document.addEventListener('click', () => {
    $('settingsMenu').hidden = true;
    $('settingsToggle').setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !document.body.classList.contains('immersive')) {
      $('settingsMenu').hidden = true;
      $('settingsToggle').setAttribute('aria-expanded', 'false');
    }
  });

  ['audioEnabled', 'showTechniqueFullscreen', 'countdownBeeps', 'wakeLockEnabled'].forEach(id => {
    $(id).addEventListener('change', () => {
      state.settings[id] = $(id).checked;
      saveState();
      if (id === 'audioEnabled' && $(id).checked) audio.ensure();
      if (id === 'wakeLockEnabled') {
        if ($(id).checked && runner.running) requestWakeLock();
        else if (!$(id).checked) releaseWakeLock();
      }
    });
  });

  $('bellType').addEventListener('change', () => {
    state.settings.bellType = $('bellType').value;
    saveState();
    audio.bell();
  });
  $('previewBell').addEventListener('click', () => {
    if (!state.settings.audioEnabled) { toast(t('enableSound')); return; }
    audio.bell();
  });
  $('restoreDefaults').addEventListener('click', () => {
    if (!window.confirm(t('restoreConfirm'))) return;
    state = defaultState();
    saveState();
    applySettingsToUI();
    syncSetupUI();
    setMode('drill');
    applyLanguage();
    toast(t('restored'));
  });

  $('athleteCount').addEventListener('change', () => {
    state.drill.athleteCount = asInt($('athleteCount').value, 2, 1, 4);
    normalizeActiveColors();
    saveState();
    renderAthletes();
  });

  $('athletesContainer').addEventListener('input', event => {
    const index = event.target.dataset.athleteName;
    if (index !== undefined) {
      const fallback = t('athleteDefault', { n: Number(index) + 1 });
      state.drill.athletes[Number(index)].name = event.target.value === fallback ? '' : event.target.value;
      saveState();
    }
  });

  $('athletesContainer').addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.target.dataset.techCustom === undefined) return;
    event.preventDefault();
    addTechnique(Number(event.target.dataset.techCustom), event.target.value);
  });

  $('athletesContainer').addEventListener('click', event => {
    const colorButton = event.target.closest('[data-color]');
    if (colorButton) {
      if (colorButton.disabled) { toast(t('colorAlreadyUsed')); return; }
      const index = Number(colorButton.dataset.athlete);
      const nextColor = colorButton.dataset.color;
      const usedElsewhere = state.drill.athletes.slice(0, state.drill.athleteCount)
        .some((athlete, athleteIndex) => athleteIndex !== index && athlete.color === nextColor);
      if (usedElsewhere) { toast(t('colorAlreadyUsed')); return; }
      state.drill.athletes[index].color = nextColor;
      saveState();
      renderAthletes();
      return;
    }

    const customButton = event.target.closest('[data-add-custom]');
    if (customButton) {
      const index = Number(customButton.dataset.addCustom);
      const input = document.querySelector(`[data-tech-custom="${index}"]`);
      addTechnique(index, input?.value);
      return;
    }

    const removeButton = event.target.closest('[data-remove-tech]');
    if (removeButton) {
      const athleteIndex = Number(removeButton.dataset.athlete);
      const techIndex = Number(removeButton.dataset.removeTech);
      state.drill.athletes[athleteIndex].techniques.splice(techIndex, 1);
      saveState();
      renderAthletes();
    }
  });

  ['drillSets', 'drillPrep', 'drillMinutes', 'drillSeconds', 'sparringRounds', 'sparringPrep', 'sparringMinutes', 'sparringSeconds', 'restMinutes', 'restSeconds']
    .forEach(id => $(id).addEventListener('change', collectSetupState));

  $('startDrill').addEventListener('click', startDrill);
  $('startSparring').addEventListener('click', startSparring);
  $('startInfinite').addEventListener('click', startInfinite);
  $('playPause').addEventListener('click', () => runner.toggle());
  $('previousPhase').addEventListener('click', () => runner.go(-1));
  $('nextPhase').addEventListener('click', () => runner.go(1));
  $('resetTimer').addEventListener('click', () => runner.reset());
  $('backButton').addEventListener('click', leaveTimer);
  $('fullscreenButton').addEventListener('click', () => document.body.classList.contains('immersive') ? exitImmersive() : enterImmersive());
  $('timerCenter').addEventListener('click', () => { if (document.body.classList.contains('immersive')) exitImmersive(); });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) document.body.classList.remove('immersive');
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && runner.running) requestWakeLock();
  });
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  try { await navigator.serviceWorker.register('/sw.js', { scope: '/' }); } catch { /* app still works online */ }
}

function init() {
  normalizeActiveColors();
  applySettingsToUI();
  syncSetupUI();
  const requestedMode = new URLSearchParams(location.search).get('mode');
  setMode(['drill', 'sparring', 'infinite'].includes(requestedMode) ? requestedMode : state.mode, false);
  applyLanguage();
  bindEvents();
  saveState();
  registerServiceWorker();
  document.documentElement.dataset.appReady = 'true';
}

init();
