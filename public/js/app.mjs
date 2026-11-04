import {
  assignUniqueColors,
  buildDrillPlan,
  buildSparringPlan,
  formatTime,
  getContrastColor
} from './engine.mjs';

const $ = id => document.getElementById(id);
const STORAGE_KEY = 'awaken-drills-v5.4';
const LEGACY_KEYS = ['awaken-drills-v5.3', 'awaken-drills-v5.2', 'awaken-drills-v5'];
const PALETTE = ['#0A84FF', '#F5F7FA', '#050608', '#FF453A', '#30D158', '#BF5AF2'];

// Os quatro efeitos abaixo são os mesmos nomes/sons usados pela versão original.
// As URLs públicas são mantidas como fonte canônica para não substituí-los por sons gerados.
export const FILE_SOUNDS = Object.freeze({
  boxing: 'https://www.myinstants.com/media/sounds/boxing-bell.mp3',
  smash: 'https://www.myinstants.com/media/sounds/im-gonna-smash-your-boy.mp3',
  faaah: 'https://www.myinstants.com/media/sounds/faaah.mp3',
  fart: 'https://www.myinstants.com/media/sounds/dry-fart_3.mp3'
});

const I18N = {
  'pt-BR': {
    settings:'Configurações', generalPreferences:'Preferências gerais', language:'Idioma', sound:'Som', bellsAndAlerts:'Sinos e alertas',
    bell:'Sino', bellHelp:'Som ao trocar ou finalizar', previewBell:'Ouvir sino', finalCountdown:'Contagem final',
    finalCountdownHelp:'Bipes em 3, 2 e 1 segundos', keepAwake:'Manter tela ativa', keepAwakeHelp:'Durante cronômetros em execução',
    restoreDefaults:'Restaurar padrões', drillsTitle:'Drills', roundsTitle:'Rounds', athletes:'Atletas', setsPerAthlete:'Séries por atleta',
    prepare:'Preparar', drillTime:'Tempo do drill', colorIsBackground:'Cor = fundo do cronômetro', startDrill:'Iniciar drill', rounds:'Rounds',
    round:'Tempo de Luta', rest:'Descanso', startSparring:'Iniciar sparring', infiniteTitle:'Contagem infinita',
    infiniteHelp:'Cronômetro crescente sem limite de tempo.', startInfinite:'Iniciar contagem', athlete:'Atleta', name:'Nome', technique:'Técnica',
    techniqueOptional:'opcional', techniquePlaceholder:'Digite uma técnica', add:'Adicionar', noTechnique:'Nenhuma técnica', nextTechnique:'TÉCNICA',
    phasePrepare:'PREPARAR', phaseTechnique:'TÉCNICA', phaseDrill:'DRILL', phaseSparring:'SPARRING', phaseRest:'DESCANSO',
    phaseInfinite:'CONTAGEM INFINITA', phaseEnd:'FIM', pause:'Pausar', continue:'Continuar', start:'Iniciar', done:'Concluído', resetSession:'Reiniciar sessão',
    sessionDone:'Sessão concluída.', drillTimeRequired:'Defina um tempo de drill maior que zero.',
    roundTimeRequired:'Defina um tempo de round maior que zero.', setProgress:'Série {current}/{total} · {athlete}',
    roundProgress:'Round {current}/{total}', nextRound:'Próximo: round {current}/{total}', duplicateTechnique:'Essa técnica já foi adicionada.'
  },
  en: {
    settings:'Settings', generalPreferences:'General preferences', language:'Language', sound:'Sound', bellsAndAlerts:'Bells and alerts',
    bell:'Bell', bellHelp:'Sound when switching or finishing', previewBell:'Preview bell', finalCountdown:'Final countdown',
    finalCountdownHelp:'Beeps at 3, 2 and 1 seconds', keepAwake:'Keep screen awake', keepAwakeHelp:'While timers are running',
    restoreDefaults:'Restore defaults', drillsTitle:'Drills', roundsTitle:'Rounds', athletes:'Athletes', setsPerAthlete:'Sets per athlete',
    prepare:'Get ready', drillTime:'Drill time', colorIsBackground:'Color = timer background', startDrill:'Start drill', rounds:'Rounds',
    round:'Round', rest:'Rest', startSparring:'Start sparring', infiniteTitle:'Infinite count',
    infiniteHelp:'Count-up timer with no time limit.', startInfinite:'Start count', athlete:'Athlete', name:'Name', technique:'Technique',
    techniqueOptional:'optional', techniquePlaceholder:'Type a technique', add:'Add', noTechnique:'No technique', nextTechnique:'TECHNIQUE',
    phasePrepare:'GET READY', phaseTechnique:'TECHNIQUE', phaseDrill:'DRILL', phaseSparring:'SPARRING', phaseRest:'REST',
    phaseInfinite:'INFINITE COUNT', phaseEnd:'END', pause:'Pause', continue:'Continue', start:'Start', done:'Done', resetSession:'Reset session',
    sessionDone:'Session complete.', drillTimeRequired:'Set a drill time greater than zero.',
    roundTimeRequired:'Set a round time greater than zero.', setProgress:'Set {current}/{total} · {athlete}',
    roundProgress:'Round {current}/{total}', nextRound:'Next: round {current}/{total}', duplicateTechnique:'That technique has already been added.'
  }
};

const defaultState = () => ({
  settings: {
    language: 'pt-BR',
    audioEnabled: true,
    bellType: 'boxing',
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
      { name:'', color:PALETTE[0], techniques:[] },
      { name:'', color:PALETTE[1], techniques:[] },
      { name:'', color:PALETTE[2], techniques:[] },
      { name:'', color:PALETTE[3], techniques:[] }
    ]
  },
  sparring: { rounds:5, prep:10, minutes:5, seconds:0, restMinutes:1, restSeconds:0 }
});

let state = loadState();
let wakeLock = null;
let immersiveControlsTimer = 0;

function t(key, vars = {}) {
  let value = (I18N[state.settings.language] || I18N['pt-BR'])[key] || key;
  return value.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? '');
}

function loadState() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      for (const key of LEGACY_KEYS) {
        raw = localStorage.getItem(key);
        if (raw) break;
      }
    }
    if (!raw) return defaultState();

    const saved = JSON.parse(raw);
    const base = defaultState();
    const athletes = base.drill.athletes.map((athlete, index) => {
      const previous = saved.drill?.athletes?.[index] || {};
      const techniques = Array.isArray(previous.techniques)
        ? previous.techniques.map(String).map(value => value.trim()).filter(Boolean).slice(0, 20)
        : [];
      return { ...athlete, ...previous, techniques };
    });

    return {
      ...base,
      ...saved,
      settings: { ...base.settings, ...saved.settings },
      drill: {
        ...base.drill,
        ...saved.drill,
        athletes: assignUniqueColors(athletes, saved.drill?.athleteCount || 2, PALETTE)
      },
      sparring: { ...base.sparring, ...saved.sparring }
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  }[char]));
}

function toast(message) {
  const element = $('toast');
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { element.hidden = true; }, 1800);
}

function applyLanguage() {
  document.documentElement.lang = state.settings.language;
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll('[data-lang]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.lang === state.settings.language));
  });
  renderAthletes();
  runner.render();
}

function renderAthletes() {
  const container = $('athletesContainer');
  container.innerHTML = '';
  const count = Number(state.drill.athleteCount);

  for (let index = 0; index < count; index += 1) {
    const athlete = state.drill.athletes[index];
    const card = document.createElement('div');
    card.className = 'athlete-card';
    card.style.setProperty('--athlete-color', athlete.color);
    const used = new Set(state.drill.athletes.slice(0, count).map((item, itemIndex) => itemIndex === index ? null : item.color));

    card.innerHTML = `
      <div class="athlete-top">
        <div>
          <div class="athlete-number">${t('athlete')} ${index + 1}</div>
          <label class="field"><span>${t('name')}</span><input data-name="${index}" value="${escapeHtml(athlete.name)}"></label>
        </div>
        <div class="color-picker">
          ${PALETTE.map(color => `<button class="color-dot" data-color="${color}" data-athlete="${index}" style="--dot:${color}" aria-pressed="${athlete.color === color}" ${used.has(color) ? 'disabled' : ''}></button>`).join('')}
        </div>
      </div>
      <div class="tech-box">
        <div class="tech-box-header"><span>${t('technique')}</span><small>${t('techniqueOptional')}</small></div>
        <div class="tech-custom"><input data-tech="${index}" placeholder="${t('techniquePlaceholder')}"><button data-add="${index}">${t('add')}</button></div>
        <div class="tech-chips">
          ${athlete.techniques.length
            ? athlete.techniques.map((technique, techniqueIndex) => `<span class="tech-chip"><b>${techniqueIndex + 1}</b>${escapeHtml(technique)}<button data-remove="${techniqueIndex}" data-athlete="${index}" aria-label="Remover">×</button></span>`).join('')
            : `<span class="empty-tech">${t('noTechnique')}</span>`}
        </div>
      </div>`;
    container.appendChild(card);
  }
}

function syncUI() {
  $('athleteCount').value = state.drill.athleteCount;
  $('drillSets').value = state.drill.sets;
  $('drillPrep').value = state.drill.prep;
  $('drillMinutes').value = state.drill.minutes;
  $('drillSeconds').value = state.drill.seconds;
  $('sparringRounds').value = state.sparring.rounds;
  $('sparringPrep').value = state.sparring.prep;
  $('sparringMinutes').value = state.sparring.minutes;
  $('sparringSeconds').value = state.sparring.seconds;
  $('restMinutes').value = state.sparring.restMinutes;
  $('restSeconds').value = state.sparring.restSeconds;
  $('audioEnabled').checked = state.settings.audioEnabled;
  $('countdownBeeps').checked = state.settings.countdownBeeps;
  $('wakeLockEnabled').checked = state.settings.wakeLockEnabled;
  $('bellType').value = state.settings.bellType;
  if (!$('bellType').value) {
    state.settings.bellType = 'boxing';
    $('bellType').value = 'boxing';
  }
  renderAthletes();
}

function collectSetup() {
  state.drill.athleteCount = Number($('athleteCount').value);
  state.drill.sets = Number($('drillSets').value);
  state.drill.prep = Number($('drillPrep').value);
  state.drill.minutes = Number($('drillMinutes').value) || 0;
  state.drill.seconds = Number($('drillSeconds').value) || 0;
  state.sparring.rounds = Number($('sparringRounds').value);
  state.sparring.prep = Number($('sparringPrep').value);
  state.sparring.minutes = Number($('sparringMinutes').value) || 0;
  state.sparring.seconds = Number($('sparringSeconds').value) || 0;
  state.sparring.restMinutes = Number($('restMinutes').value) || 0;
  state.sparring.restSeconds = Number($('restSeconds').value) || 0;
  saveState();
}

function setMode(mode) {
  state.mode = mode;
  ['drill', 'sparring', 'infinite'].forEach(name => {
    $(`${name}Setup`).hidden = name !== mode;
    document.querySelector(`[data-mode="${name}"]`).classList.toggle('is-active', name === mode);
  });
  saveState();
}

const audio = {
  ctx: null,
  players: new Map(),

  ensure() {
    if (!state.settings.audioEnabled) return;
    try {
      this.ctx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch {}
  },

  tone(freq = 880, duration = 0.08) {
    if (!state.settings.audioEnabled) return;
    this.ensure();
    if (!this.ctx) return;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.frequency.value = freq;
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    oscillator.connect(gain).connect(this.ctx.destination);
    oscillator.start();
    oscillator.stop(this.ctx.currentTime + duration);
  },

  beep() {
    this.tone(1050, 0.07);
  },

  filePlayer(key) {
    if (!FILE_SOUNDS[key]) return null;
    let player = this.players.get(key);
    if (!player) {
      player = new Audio(FILE_SOUNDS[key]);
      player.preload = 'auto';
      this.players.set(key, player);
    }
    return player;
  },

  playFile(key) {
    if (!state.settings.audioEnabled) return;
    const player = this.filePlayer(key);
    if (!player) return;
    try {
      player.pause();
      player.currentTime = 0;
      const promise = player.play();
      if (promise?.catch) promise.catch(() => {});
    } catch {}
  },

  bell() {
    if (!state.settings.audioEnabled) return;
    const selected = state.settings.bellType;
    if (FILE_SOUNDS[selected]) {
      this.playFile(selected);
      return;
    }
    this.tone(selected === 'vintage' ? 520 : selected === 'double' ? 760 : 660, 0.22);
    if (selected === 'double') setTimeout(() => this.tone(760, 0.18), 120);
  }
};

async function requestWakeLock() {
  if (!state.settings.wakeLockEnabled || !('wakeLock' in navigator)) return;
  try { wakeLock = await navigator.wakeLock.request('screen'); } catch {}
}

async function releaseWakeLock() {
  try { await wakeLock?.release(); } catch {}
  wakeLock = null;
}

class TimerRunner {
  constructor() {
    this.plan = [];
    this.index = 0;
    this.running = false;
    this.remainingMs = 0;
    this.elapsedMs = 0;
    this.frame = 0;
    this.mode = 'drill';
    this.controlState = 'start';
    this.lastBeepSecond = null;
  }

  current() { return this.plan[this.index]; }

  load(plan, mode) {
    this.stopLoop();
    this.running = false;
    this.plan = Array.isArray(plan) ? plan : [];
    this.index = 0;
    this.mode = mode;
    this.remainingMs = mode === 'infinite' ? 0 : (this.plan[0]?.duration || 0) * 1000;
    this.elapsedMs = 0;
    this.controlState = 'start';
    this.lastBeepSecond = null;
    this.render();
  }

  stopLoop() {
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = 0;
  }

  play() {
    if (!this.current() || this.controlState === 'done' || this.running) return;
    this.running = true;
    if (this.mode === 'infinite') this.startedAt = performance.now() - this.elapsedMs;
    else this.endAt = performance.now() + this.remainingMs;
    this.controlState = 'pause';
    this.lastBeepSecond = null;
    requestWakeLock();
    this.loop();
    this.render();
  }

  pause() {
    if (!this.running) return;
    if (this.mode === 'infinite') this.elapsedMs = Math.max(0, performance.now() - this.startedAt);
    else this.remainingMs = Math.max(0, this.endAt - performance.now());
    this.running = false;
    this.stopLoop();
    this.controlState = 'continue';
    releaseWakeLock();
    this.render();
  }

  toggle() {
    if (this.running) this.pause();
    else this.play();
  }

  loop() {
    this.stopLoop();
    const tick = now => {
      if (!this.running) return;

      if (this.mode === 'infinite') {
        this.elapsedMs = Math.max(0, now - this.startedAt);
        this.render();
        this.frame = requestAnimationFrame(tick);
        return;
      }

      this.remainingMs = Math.max(0, this.endAt - now);
      this.render();
      if (this.remainingMs <= 0) {
        this.completePhase();
        return;
      }
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  shouldRingAtTransition(finished, next) {
    if (!next) return true;
    if (next.kind === 'techniqueCue') return false;
    if (finished?.kind === 'techniqueCue' && next.kind === 'drill') return true;
    return finished?.kind !== 'techniqueCue';
  }

  completePhase() {
    this.running = false;
    this.stopLoop();
    const finished = this.current();
    const next = this.plan[this.index + 1];

    if (!next) {
      // Final de ciclo: o sinal de encerramento deve ocorrer sempre uma unica vez.
      audio.bell();
      this.controlState = 'done';
      this.render();
      $('announcement').textContent = t('sessionDone');
      releaseWakeLock();
      return;
    }

    if (this.shouldRingAtTransition(finished, next)) audio.bell();
    this.index += 1;
    this.remainingMs = (this.current()?.duration || 0) * 1000;
    this.lastBeepSecond = null;
    this.render();
    this.play();
  }

  go(delta) {
    if (this.mode === 'infinite') return;
    const wasRunning = this.running;
    if (this.running) this.pause();
    this.index = Math.max(0, Math.min(this.plan.length - 1, this.index + delta));
    this.remainingMs = (this.current()?.duration || 0) * 1000;
    this.lastBeepSecond = null;
    this.controlState = wasRunning ? 'continue' : 'continue';
    this.render();
    if (wasRunning) this.play();
  }

  reset() {
    if (this.running) this.pause();
    this.index = 0;
    this.elapsedMs = 0;
    this.remainingMs = this.mode === 'infinite' ? 0 : (this.current()?.duration || 0) * 1000;
    this.controlState = 'start';
    this.lastBeepSecond = null;
    this.render();
  }

  render() {
    const phase = this.current();
    if (!phase || !$('timerScreen')) return;

    const total = Math.max(1, (phase.duration || 1) * 1000);
    const seconds = Math.ceil(this.remainingMs / 1000);
    const isDone = this.controlState === 'done' && this.mode !== 'infinite';
    $('clock').textContent = isDone
      ? t('phaseEnd')
      : this.mode === 'infinite' ? formatTime(this.elapsedMs / 1000) : formatTime(this.remainingMs / 1000);
    $('phaseBarFill').style.width = isDone
      ? '100%'
      : this.mode === 'infinite'
        ? '0%'
        : `${Math.min(100, Math.max(0, (1 - this.remainingMs / total) * 100))}%`;

    if (
      this.running &&
      this.mode !== 'infinite' &&
      state.settings.countdownBeeps &&
      phase.kind !== 'techniqueCue' &&
      seconds >= 1 &&
      seconds <= 3 &&
      seconds !== this.lastBeepSecond
    ) {
      this.lastBeepSecond = seconds;
      audio.beep();
    }

    let background = '#050608';
    let label = '';
    let progress = '';
    let athlete = '';
    let technique = '';

    if (isDone) {
      background = '#FF453A';
      label = t('phaseEnd');
    } else if (phase.kind === 'infinite') {
      label = t('phaseInfinite');
    } else if (['prepare', 'techniqueCue', 'drill'].includes(phase.kind) && phase.athleteName) {
      background = phase.color || '#0A84FF';
      athlete = phase.athleteName;
      technique = phase.technique || '';
      label = phase.kind === 'prepare' ? t('phasePrepare') : phase.kind === 'techniqueCue' ? t('phaseTechnique') : t('phaseDrill');
      progress = t('setProgress', { current: phase.setNumber, total: phase.totalSets, athlete });
    } else if (phase.kind === 'sparring') {
      background = '#0A84FF';
      label = t('phaseSparring');
      progress = t('roundProgress', { current: phase.roundNumber, total: phase.totalRounds });
    } else if (phase.kind === 'rest') {
      background = '#F5F7FA';
      label = t('phaseRest');
      progress = t('nextRound', { current: phase.nextRoundNumber, total: phase.totalRounds });
    } else {
      label = t('phasePrepare');
    }

    const foreground = getContrastColor(background);
    const screen = $('timerScreen');
    screen.style.setProperty('--timer-bg', background);
    screen.style.setProperty('--timer-fg', foreground);
    $('phaseLabel').textContent = label;
    $('phaseProgress').textContent = progress;
    $('timerAthlete').textContent = athlete;
    $('currentTechnique').textContent = !isDone && phase.kind === 'drill' ? technique : '';

    const cueVisible = !isDone && phase.kind === 'techniqueCue' && Boolean(technique);
    $('techniqueCue').hidden = !cueVisible;
    $('techniqueAthlete').textContent = cueVisible ? athlete : '';
    $('techniqueText').textContent = cueVisible ? technique : '';
    $('clock').hidden = cueVisible;
    $('playPause').textContent = t(this.controlState);

    const immersiveToggle = $('immersivePlayPause');
    if (immersiveToggle) {
      immersiveToggle.hidden = isDone;
      const immersiveAction = this.running || this.controlState === 'start' ? 'pause' : 'continue';
      immersiveToggle.dataset.state = immersiveAction;
      immersiveToggle.setAttribute('aria-label', t(immersiveAction));
    }
  }
}

const runner = new TimerRunner();

function prepareTimer(plan, mode) {
  $('settingsMenu').hidden = true;
  $('timerScreen').hidden = false;
  document.body.style.overflow = 'hidden';
  runner.load(plan, mode);
  $('previousPhase').hidden = mode === 'infinite';
  $('nextPhase').hidden = mode === 'infinite';
}

async function enterImmersive() {
  document.body.classList.add('immersive');
  try {
    if ($('timerScreen').requestFullscreen && !document.fullscreenElement) {
      await $('timerScreen').requestFullscreen({ navigationUI: 'hide' });
    }
  } catch {
    // Em navegadores sem Fullscreen API, o modo imersivo CSS ainda ocupa toda a tela disponível.
  }
}

async function exitImmersive() {
  hideImmersiveControls();
  document.body.classList.remove('immersive');
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
  } catch {}
}

function hideImmersiveControls() {
  clearTimeout(immersiveControlsTimer);
  immersiveControlsTimer = 0;
  document.body.classList.remove('immersive-controls-visible');
}

function showImmersiveControls() {
  if (!document.body.classList.contains('immersive')) return;
  document.body.classList.add('immersive-controls-visible');
  clearTimeout(immersiveControlsTimer);
  immersiveControlsTimer = setTimeout(hideImmersiveControls, 2000);
}

async function startPreparedTimer(plan, mode) {
  prepareTimer(plan, mode);
  // Regra principal: o cronômetro NÃO começa antes da tentativa de fullscreen terminar.
  await enterImmersive();
  if (['drill', 'sparring'].includes(plan[0]?.kind)) audio.bell();
  runner.play();
}

function leaveTimer() {
  if (runner.running) runner.pause();
  exitImmersive();
  $('timerScreen').hidden = true;
  document.body.style.overflow = '';
}

async function startDrill() {
  collectSetup();
  const workSeconds = state.drill.minutes * 60 + state.drill.seconds;
  if (workSeconds <= 0) return toast(t('drillTimeRequired'));

  const athletes = state.drill.athletes
    .slice(0, state.drill.athleteCount)
    .map((athlete, index) => ({
      ...athlete,
      name: athlete.name.trim() || `${t('athlete')} ${index + 1}`,
      techniques: [...athlete.techniques]
    }));

  audio.ensure();
  const plan = buildDrillPlan({
    athletes,
    workSeconds,
    prepSeconds: state.drill.prep,
    sets: state.drill.sets,
    techniqueCueSeconds: 2
  });

  await startPreparedTimer(plan, 'drill');
}

async function startSparring() {
  collectSetup();
  const roundSeconds = state.sparring.minutes * 60 + state.sparring.seconds;
  if (roundSeconds <= 0) return toast(t('roundTimeRequired'));
  const restSeconds = state.sparring.restMinutes * 60 + state.sparring.restSeconds;
  audio.ensure();
  await startPreparedTimer(buildSparringPlan({
    prepSeconds: state.sparring.prep,
    roundSeconds,
    restSeconds,
    rounds: state.sparring.rounds
  }), 'sparring');
}

async function startInfinite() {
  audio.ensure();
  await startPreparedTimer([{ kind:'infinite', duration:0 }], 'infinite');
}

function bind() {
  document.querySelectorAll('[data-mode]').forEach(button => {
    button.onclick = () => setMode(button.dataset.mode);
  });

  document.querySelectorAll('[data-lang]').forEach(button => {
    button.onclick = () => {
      state.settings.language = button.dataset.lang;
      saveState();
      applyLanguage();
    };
  });

  $('settingsToggle').onclick = event => {
    event.stopPropagation();
    $('settingsMenu').hidden = !$('settingsMenu').hidden;
  };
  document.addEventListener('click', () => { $('settingsMenu').hidden = true; });
  $('settingsMenu').onclick = event => event.stopPropagation();

  ['audioEnabled', 'countdownBeeps', 'wakeLockEnabled'].forEach(id => {
    $(id).onchange = () => {
      state.settings[id] = $(id).checked;
      saveState();
    };
  });

  $('bellType').onchange = () => {
    state.settings.bellType = $('bellType').value;
    saveState();
  };
  $('previewBell').onclick = () => audio.bell();

  $('restoreDefaults').onclick = () => {
    state = defaultState();
    saveState();
    syncUI();
    applyLanguage();
  };

  $('athleteCount').onchange = () => {
    collectSetup();
    state.drill.athletes = assignUniqueColors(state.drill.athletes, state.drill.athleteCount, PALETTE);
    saveState();
    renderAthletes();
  };

  [
    'drillSets', 'drillPrep', 'drillMinutes', 'drillSeconds',
    'sparringRounds', 'sparringPrep', 'sparringMinutes', 'sparringSeconds',
    'restMinutes', 'restSeconds'
  ].forEach(id => { $(id).onchange = collectSetup; });

  $('athletesContainer').addEventListener('input', event => {
    if (event.target.matches('[data-name]')) {
      state.drill.athletes[Number(event.target.dataset.name)].name = event.target.value;
      saveState();
    }
  });

  $('athletesContainer').addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.target.matches('[data-tech]')) {
      event.preventDefault();
      document.querySelector(`[data-add="${event.target.dataset.tech}"]`)?.click();
    }
  });

  $('athletesContainer').addEventListener('click', event => {
    const colorButton = event.target.closest('[data-color]');
    if (colorButton && !colorButton.disabled) {
      state.drill.athletes[Number(colorButton.dataset.athlete)].color = colorButton.dataset.color;
      saveState();
      renderAthletes();
      return;
    }

    const addButton = event.target.closest('[data-add]');
    if (addButton) {
      const athleteIndex = Number(addButton.dataset.add);
      const input = document.querySelector(`[data-tech="${athleteIndex}"]`);
      const value = input.value.trim();
      if (!value) return;
      if (state.drill.athletes[athleteIndex].techniques.some(item => item.toLowerCase() === value.toLowerCase())) {
        toast(t('duplicateTechnique'));
        return;
      }
      state.drill.athletes[athleteIndex].techniques.push(value);
      saveState();
      renderAthletes();
      return;
    }

    const removeButton = event.target.closest('[data-remove]');
    if (removeButton) {
      const athleteIndex = Number(removeButton.dataset.athlete);
      const techniqueIndex = Number(removeButton.dataset.remove);
      state.drill.athletes[athleteIndex].techniques.splice(techniqueIndex, 1);
      saveState();
      renderAthletes();
    }
  });

  $('startDrill').onclick = () => { startDrill(); };
  $('startSparring').onclick = () => { startSparring(); };
  $('startInfinite').onclick = () => { startInfinite(); };
  $('playPause').onclick = () => runner.toggle();
  $('previousPhase').onclick = () => runner.go(-1);
  $('nextPhase').onclick = () => runner.go(1);
  $('resetTimer').onclick = () => runner.reset();
  $('backButton').onclick = leaveTimer;
  $('fullscreenButton').onclick = () => document.body.classList.contains('immersive') ? exitImmersive() : enterImmersive();
  $('timerScreen').onclick = event => {
    if (!document.body.classList.contains('immersive')) return;
    if (event.target.closest('.immersive-action')) return;
    showImmersiveControls();
  };
  $('immersiveHome').onclick = event => {
    event.stopPropagation();
    leaveTimer();
  };
  $('immersivePlayPause').onclick = event => {
    event.stopPropagation();
    if (runner.controlState === 'done') return;
    runner.toggle();
    showImmersiveControls();
  };

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      hideImmersiveControls();
      document.body.classList.remove('immersive');
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && runner.running) requestWakeLock();
  });
}

function init() {
  syncUI();
  setMode(state.mode);
  applyLanguage();
  bind();
  saveState();
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}

init();
