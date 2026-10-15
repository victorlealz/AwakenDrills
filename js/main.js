(() => {
  'use strict';

  // Keep the v2 key so existing athletes and techniques survive this update.
  const storageKey = 'awaken-drills-v2';
  const maxTechniques = 200;
  const pageNames = ['drill', 'sparring', 'library', 'timer'];
  const fieldNames = [
    'participants', 'athlete1', 'athlete2', 'drillMin', 'drillSec',
    'drillPrepSec', 'prepSec', 'fightMin', 'fightSec', 'restMin', 'restSec', 'rounds'
  ];
  const elementNames = [
    ...fieldNames, ...pageNames.map(pageName => `${pageName}Page`),
    'language', 'menu', 'menuButton', 'timerMenu', 'alternateField', 'alternateTiming',
    'athleteSettings', 'athleteTwo', 'tech1', 'tech2', 'owner', 'techniqueName',
    'addTechnique', 'libraryList', 'launchDrill', 'launchSparring', 'timerPanel',
    'back', 'phase', 'sound', 'soundIcon', 'fullscreen', 'fullscreenIcon',
    'timerAthlete', 'timerTechnique', 'clock', 'progress', 'progressBar',
    'previous', 'play', 'next', 'reset', 'wake', 'wakeText', 'timerNotice',
    'timerAnnouncement', 'message'
  ];
  const elements = Object.fromEntries(elementNames.map(id => [id, document.getElementById(id)]));
  if (Object.values(elements).some(element => !element)) return;

  const translations = {
    pt: {
      skipContent: 'Ir para o conte\u00fado', language: 'Idioma', navigation: 'Navega\u00e7\u00e3o',
      drills: 'Drills', drill: 'Drill', sparring: 'Sparring', techniques: 'T\u00e9cnicas',
      technique: 'T\u00e9cnica', timer: 'Cron\u00f4metro', athletes: 'Atletas', athlete: 'Atleta',
      athlete1: 'Atleta 1', athlete2: 'Atleta 2', athlete1Color: 'Cor do atleta 1',
      athlete2Color: 'Cor do atleta 2', athlete1Techniques: 'T\u00e9cnicas do atleta 1',
      athlete2Techniques: 'T\u00e9cnicas do atleta 2', green: 'Verde', blue: 'Azul',
      duration: 'Tempo', minutesShort: 'Min', secondsShort: 'Seg',
      drillMinutes: 'Drill, minutos', drillSeconds: 'Drill, segundos',
      fightMinutes: 'Sparring, minutos', fightSeconds: 'Sparring, segundos',
      restMinutes: 'Descanso, minutos', restSeconds: 'Descanso, segundos',
      prepareSeconds: 'Preparar, segundos', prepare: 'Preparar', rest: 'Descanso',
      alternateAthletes: 'Alternar Atletas', rounds: 'Rounds', round: 'Round',
      start: 'Iniciar', pause: 'Pausar', resume: 'Continuar', reset: 'Reiniciar',
      add: 'Adicionar', remove: 'Remover {name}', back: 'Voltar', previous: 'Anterior',
      next: 'Pr\u00f3ximo', fullscreen: 'Tela Cheia', exitFullscreen: 'Sair da Tela Cheia',
      bell: 'Sino', muteBell: 'Silenciar Sino', enableBell: 'Ativar Sino', elapsed: 'Tempo decorrido',
      finished: 'Conclu\u00eddo', screenAwake: 'Tela Ativa', wakeIdle: 'Tela ativa durante o treino',
      wakeActive: 'Tela ativa: prote\u00e7\u00e3o contra bloqueio em uso',
      wakePending: 'Ativando prote\u00e7\u00e3o contra bloqueio',
      wakeUnavailable: 'Tela ativa indispon\u00edvel. Verifique o navegador e a bateria.',
      wakeReleased: 'Prote\u00e7\u00e3o de tela interrompida. Toque em Tela Ativa para tentar novamente.',
      audioUnavailable: 'Sino indispon\u00edvel. Toque no sino para tentar novamente.',
      noTechniques: 'Selecione uma t\u00e9cnica para {athlete}.',
      invalidDuration: 'Escolha um tempo maior que zero.',
      invalidTechnique: 'Digite o nome da t\u00e9cnica.', duplicateTechnique: 'T\u00e9cnica j\u00e1 cadastrada.',
      techniqueLimit: 'Limite de 200 t\u00e9cnicas atingido.',
      storageUnavailable: 'N\u00e3o foi poss\u00edvel salvar neste navegador.',
      timeNumber: 'Tempo {number} de {total}',
      description: 'Awaken Drills: cron\u00f4metros de drills e sparring de Jiu-Jitsu.'
    },
    en: {
      skipContent: 'Skip to content', language: 'Language', navigation: 'Navigation',
      drills: 'Drills', drill: 'Drill', sparring: 'Sparring', techniques: 'Techniques',
      technique: 'Technique', timer: 'Timer', athletes: 'Athletes', athlete: 'Athlete',
      athlete1: 'Athlete 1', athlete2: 'Athlete 2', athlete1Color: 'Athlete 1 color',
      athlete2Color: 'Athlete 2 color', athlete1Techniques: 'Athlete 1 techniques',
      athlete2Techniques: 'Athlete 2 techniques', green: 'Green', blue: 'Blue',
      duration: 'Time', minutesShort: 'Min', secondsShort: 'Sec',
      drillMinutes: 'Drill, minutes', drillSeconds: 'Drill, seconds',
      fightMinutes: 'Sparring, minutes', fightSeconds: 'Sparring, seconds',
      restMinutes: 'Rest, minutes', restSeconds: 'Rest, seconds',
      prepareSeconds: 'Prepare, seconds', prepare: 'Prepare', rest: 'Rest',
      alternateAthletes: 'Alternate Athletes', rounds: 'Rounds', round: 'Round',
      start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Restart',
      add: 'Add', remove: 'Remove {name}', back: 'Back', previous: 'Previous',
      next: 'Next', fullscreen: 'Full Screen', exitFullscreen: 'Exit Full Screen',
      bell: 'Bell', muteBell: 'Mute Bell', enableBell: 'Enable Bell', elapsed: 'Elapsed time',
      finished: 'Finished', screenAwake: 'Screen Awake', wakeIdle: 'Keep screen awake during training',
      wakeActive: 'Screen awake: wake lock is active', wakePending: 'Requesting screen wake lock',
      wakeUnavailable: 'Screen wake lock unavailable. Check your browser and battery.',
      wakeReleased: 'Screen wake lock released. Tap Screen Awake to retry.',
      audioUnavailable: 'Bell unavailable. Tap the bell to retry.',
      noTechniques: 'Select a technique for {athlete}.', invalidDuration: 'Choose a time greater than zero.',
      invalidTechnique: 'Enter a technique name.', duplicateTechnique: 'Technique already added.',
      techniqueLimit: 'The 200-technique limit has been reached.',
      storageUnavailable: 'Could not save in this browser.', timeNumber: 'Interval {number} of {total}',
      description: 'Awaken Drills: Jiu-Jitsu drills and sparring timers.'
    }
  };

  function loadPreferences() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function makeId() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function sanitizeTechniques(value) {
    if (!Array.isArray(value)) return [];
    return value
      .filter(item => item && typeof item.name === 'string' && item.name.trim() && [1, 2].includes(item.owner))
      .slice(0, maxTechniques)
      .map(item => ({
        id: typeof item.id === 'string' ? item.id.slice(0, 100) : makeId(),
        name: item.name.trim().slice(0, 90), owner: item.owner, selected: item.selected !== false
      }));
  }

  const preferences = loadPreferences();
  let language = preferences.lang === 'en' ? 'en' : 'pt';
  let techniques = sanitizeTechniques(preferences.techniques);
  const athleteColors = {
    1: preferences.colors?.[1] === 'blue' ? 'blue' : 'green',
    2: preferences.colors?.[2] === 'green' ? 'green' : 'blue'
  };
  if (athleteColors[1] === athleteColors[2]) {
    athleteColors[2] = athleteColors[1] === 'green' ? 'blue' : 'green';
  }

  let currentPage = 'drill';
  let sessionMode = 'drill';
  let sessionSteps = [];
  let stepIndex = 0;
  let remainingMs = 0;
  let deadlineAt = 0;
  let isRunning = false;
  let hasFinished = false;
  let timerInterval = null;
  let lastAnnouncement = '';
  let soundEnabled = preferences.soundEnabled !== false;
  let audioContext = null;
  let bellOutput = null;
  let wakeLock = null;
  let wakeGeneration = 0;
  let isAcquiringWake = false;
  let wakeState = 'idle';
  const timerNotices = { wake: '', audio: '' };

  function translate(key, replacements = {}) {
    let value = translations[language][key] || translations.pt[key] || key;
    for (const [name, replacement] of Object.entries(replacements)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
  }

  function setText(element, text) {
    if (element.textContent !== text) element.textContent = text;
  }

  function showMessage(text = '') {
    setText(elements.message, text);
    elements.message.hidden = !text;
  }

  function setTimerNotice(source, key = '') {
    timerNotices[source] = key;
    const text = Object.values(timerNotices).filter(Boolean).map(keyName => translate(keyName)).join(' ');
    setText(elements.timerNotice, text);
    elements.timerNotice.hidden = !text;
  }

  function athleteName(owner) {
    return elements[`athlete${owner}`].value.trim() || translate(`athlete${owner}`);
  }

  function savePreferences() {
    const values = Object.fromEntries(fieldNames.map(id => [id, elements[id].value]));
    values.alternateTiming = elements.alternateTiming.checked;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        version: 3, lang: language, techniques, colors: athleteColors, soundEnabled, values
      }));
    } catch {
      showMessage(translate('storageUnavailable'));
    }
  }

  function fillSelect(id, maximum, defaultValue, minimum = 0, suffix = '') {
    const select = elements[id];
    const fragment = document.createDocumentFragment();
    for (let value = minimum; value <= maximum; value += 1) {
      const option = document.createElement('option');
      option.value = String(value);
      option.textContent = minimum === 1 ? String(value) : `${String(value).padStart(2, '0')}${suffix}`;
      fragment.append(option);
    }
    select.replaceChildren(fragment);
    select.value = String(defaultValue);
  }

  function initializeFields() {
    const defaults = { drillMin: 1, drillSec: 0, fightMin: 5, fightSec: 0, restMin: 1, restSec: 0 };
    Object.entries(defaults).forEach(([id, value]) => fillSelect(id, 59, value));
    fillSelect('drillPrepSec', 30, 5, 0, ' s');
    fillSelect('prepSec', 30, 10, 0, ' s');
    fillSelect('rounds', 99, 5, 1);
    const savedValues = preferences.values && typeof preferences.values === 'object' ? preferences.values : {};
    for (const id of fieldNames) {
      const element = elements[id];
      const value = savedValues[id];
      if (element.tagName === 'SELECT' && value !== undefined) {
        if (Array.from(element.options).some(option => option.value === String(value))) element.value = String(value);
      } else if (element.tagName === 'INPUT' && typeof value === 'string') {
        // Legacy default names follow the selected language instead of becoming fixed names.
        element.value = /^(Atleta|Athlete) [12]$/.test(value) ? '' : value.trim().slice(0, 32);
      }
    }
    if (savedValues.prepMin !== undefined || savedValues.prepSec !== undefined) {
      const legacyPreparation = (Number(savedValues.prepMin) || 0) * 60 + (Number(savedValues.prepSec) || 0);
      elements.prepSec.value = String(Math.min(30, Math.max(0, Math.round(legacyPreparation))));
    }
    elements.alternateTiming.checked = savedValues.alternateTiming !== false && savedValues.alternateTiming !== 'false';
    elements.language.value = language;
  }

  function durationMs(prefix) {
    return (Number(elements[`${prefix}Min`].value) * 60 + Number(elements[`${prefix}Sec`].value)) * 1000;
  }

  function formatTime(milliseconds) {
    const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function setMenuOpen(open) {
    elements.menu.hidden = !open;
    elements.menuButton.setAttribute('aria-expanded', String(open));
  }

  function showPage(pageName) {
    if (!pageNames.includes(pageName) || (pageName === 'timer' && !sessionSteps.length)) return;
    if (currentPage === 'timer' && pageName !== 'timer') {
      pauseTimer();
      void leaveFullscreen();
    }
    currentPage = pageName;
    document.body.dataset.page = pageName;
    for (const name of pageNames) elements[`${name}Page`].hidden = name !== pageName;
    document.querySelectorAll('[data-page]').forEach(button => {
      if (button.tagName !== 'BUTTON') return;
      if (button.dataset.page === pageName) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
    setMenuOpen(false);
    showMessage();
    if (pageName === 'library') renderLibrary();
    if (pageName === 'drill') renderChoices();
    if (pageName === 'timer') renderTimer();
    elements[`${pageName}Page`].querySelector('h1')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  function renderColors() {
    document.querySelectorAll('.colorChoices').forEach(group => {
      const owner = Number(group.dataset.athlete);
      group.querySelectorAll('button').forEach(button => {
        button.setAttribute('aria-pressed', String(athleteColors[owner] === button.dataset.color));
      });
    });
  }

  function renderChoices() {
    const twoAthletes = elements.participants.value === '2';
    elements.athleteTwo.hidden = !twoAthletes;
    elements.alternateField.hidden = !twoAthletes;
    elements.alternateTiming.disabled = !twoAthletes;
    elements.athleteSettings.classList.toggle('singleAthlete', !twoAthletes);
    for (const owner of [1, 2]) {
      const fragment = document.createDocumentFragment();
      techniques.filter(item => item.owner === owner).forEach(technique => {
        const label = document.createElement('label');
        label.className = 'techOption';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = technique.selected;
        checkbox.addEventListener('change', () => {
          technique.selected = checkbox.checked;
          savePreferences();
        });
        const text = document.createElement('span');
        text.textContent = technique.name;
        label.append(checkbox, text);
        fragment.append(label);
      });
      elements[`tech${owner}`].replaceChildren(fragment);
    }
  }

  function createIcon(symbolId) {
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.classList.add('icon');
    icon.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `./assets/icons/ui.svg#${symbolId}`);
    icon.append(use);
    return icon;
  }

  function renderLibrary() {
    const fragment = document.createDocumentFragment();
    for (const owner of [1, 2]) {
      elements.owner.options[owner - 1].textContent = athleteName(owner);
      const group = document.createElement('div');
      group.className = 'libraryGroup';
      const heading = document.createElement('h2');
      heading.textContent = athleteName(owner);
      group.append(heading);
      techniques.filter(item => item.owner === owner).forEach(technique => {
        const row = document.createElement('div');
        row.className = 'libraryRow';
        const text = document.createElement('span');
        text.textContent = technique.name;
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'iconButton';
        removeButton.setAttribute('aria-label', translate('remove', { name: technique.name }));
        removeButton.append(createIcon('remove'));
        removeButton.addEventListener('click', () => {
          techniques = techniques.filter(item => item !== technique);
          savePreferences();
          renderLibrary();
          renderChoices();
          elements.techniqueName.focus();
        });
        row.append(text, removeButton);
        group.append(row);
      });
      fragment.append(group);
    }
    elements.libraryList.replaceChildren(fragment);
  }

  function addTechnique(event) {
    event.preventDefault();
    const name = elements.techniqueName.value.trim().slice(0, 90);
    const owner = Number(elements.owner.value);
    if (!name) return showMessage(translate('invalidTechnique'));
    if (techniques.length >= maxTechniques) return showMessage(translate('techniqueLimit'));
    if (techniques.some(item => item.owner === owner && item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      return showMessage(translate('duplicateTechnique'));
    }
    techniques.push({ id: makeId(), name, owner, selected: true });
    elements.techniqueName.value = '';
    showMessage();
    savePreferences();
    renderLibrary();
    renderChoices();
    elements.techniqueName.focus();
  }

  // Each work entry captures its athlete, technique and color for this session.
  function buildDrillSteps() {
    const workDuration = durationMs('drill');
    if (!workDuration) throw new Error(translate('invalidDuration'));
    const owners = elements.participants.value === '2' ? [1, 2] : [1];
    const selectedByOwner = {};
    for (const owner of owners) {
      selectedByOwner[owner] = techniques.filter(item => item.owner === owner && item.selected);
      if (!selectedByOwner[owner].length) {
        throw new Error(translate('noTechniques', { athlete: athleteName(owner) }));
      }
    }
    const orderedTechniques = [];
    if (owners.length === 2 && elements.alternateTiming.checked) {
      // Cycle the shorter list, keeping strict 1 -> 2 alternation to the end.
      const turnsPerAthlete = Math.max(selectedByOwner[1].length, selectedByOwner[2].length);
      for (let turn = 0; turn < turnsPerAthlete; turn += 1) {
        for (const owner of owners) {
          const list = selectedByOwner[owner];
          orderedTechniques.push(list[turn % list.length]);
        }
      }
    } else {
      owners.forEach(owner => orderedTechniques.push(...selectedByOwner[owner]));
    }
    const steps = [];
    const preparationMs = Number(elements.drillPrepSec.value) * 1000;
    orderedTechniques.forEach((technique, index) => {
      const work = {
        phase: 'drill', durationMs: workDuration, owner: technique.owner,
        athleteName: elements[`athlete${technique.owner}`].value.trim(), color: athleteColors[technique.owner],
        technique: technique.name, workNumber: index + 1, totalWork: orderedTechniques.length
      };
      if (preparationMs > 0) steps.push({ ...work, phase: 'prepare', durationMs: preparationMs });
      steps.push(work);
    });
    return steps;
  }

  function buildSparringSteps() {
    const fightDuration = durationMs('fight');
    if (!fightDuration) throw new Error(translate('invalidDuration'));
    const preparationMs = Number(elements.prepSec.value) * 1000;
    const restDuration = durationMs('rest');
    const totalRounds = Number(elements.rounds.value);
    const steps = [];
    for (let round = 1; round <= totalRounds; round += 1) {
      const work = { phase: 'fight', durationMs: fightDuration, workNumber: round, totalWork: totalRounds };
      if (preparationMs > 0) steps.push({ ...work, phase: 'prepare', durationMs: preparationMs });
      steps.push(work);
      if (restDuration > 0 && round < totalRounds) steps.push({ ...work, phase: 'rest', durationMs: restDuration });
    }
    return steps;
  }

  function launchSession(mode) {
    let nextSteps;
    try {
      nextSteps = mode === 'drill' ? buildDrillSteps() : buildSparringSteps();
    } catch (error) {
      showMessage(error.message);
      return;
    }
    stopClock();
    sessionMode = mode;
    sessionSteps = nextSteps;
    stepIndex = 0;
    remainingMs = sessionSteps[0].durationMs;
    hasFinished = false;
    lastAnnouncement = '';
    elements.timerMenu.disabled = false;
    setTimerNotice('wake');
    setTimerNotice('audio');
    savePreferences();
    showPage('timer');
    // Called directly from a user click, unlocking audio on mobile browsers.
    startTimer();
  }

  function stopClock() {
    isRunning = false;
    clearInterval(timerInterval);
    timerInterval = null;
    void releaseWakeLock();
  }

  function startTimer() {
    if (!sessionSteps.length || isRunning) return;
    if (hasFinished) resetTimer();
    isRunning = true;
    deadlineAt = Date.now() + remainingMs;
    timerInterval = setInterval(tickTimer, 100);
    void enableAudio();
    void acquireWakeLock();
    renderTimer();
  }

  function pauseTimer() {
    if (isRunning) {
      tickTimer();
      if (isRunning) remainingMs = Math.max(0, deadlineAt - Date.now());
    }
    stopClock();
    renderTimer();
  }

  function toggleTimer() {
    if (isRunning) pauseTimer();
    else startTimer();
  }

  function resetTimer() {
    stopClock();
    stepIndex = 0;
    remainingMs = sessionSteps[0]?.durationMs || 0;
    hasFinished = false;
    renderTimer();
  }

  function moveStep(direction) {
    if (!sessionSteps.length) return;
    stopClock();
    stepIndex = Math.min(sessionSteps.length - 1, Math.max(0, stepIndex + direction));
    remainingMs = sessionSteps[stepIndex].durationMs;
    hasFinished = false;
    renderTimer();
  }

  function tickTimer() {
    if (!isRunning) return;
    const now = Date.now();
    let crossedBoundary = false;
    let lastBoundaryAt = 0;
    // Use absolute deadlines, not a decremented counter. Delayed ticks do not add time.
    while (isRunning && now >= deadlineAt) {
      crossedBoundary = true;
      lastBoundaryAt = deadlineAt;
      if (stepIndex === sessionSteps.length - 1) {
        remainingMs = 0;
        hasFinished = true;
        stopClock();
        break;
      }
      stepIndex += 1;
      deadlineAt += sessionSteps[stepIndex].durationMs;
    }
    if (isRunning) remainingMs = Math.max(0, deadlineAt - now);
    // Never replay a burst of old bells after the browser suspends a hidden tab.
    if (crossedBoundary && document.visibilityState === 'visible' && now - lastBoundaryAt < 1500) ringBell();
    renderTimer();
  }

  function renderTimer() {
    const step = sessionSteps[stepIndex];
    const phaseKey = hasFinished ? 'finished' : step?.phase === 'prepare' ? 'prepare'
      : step?.phase === 'rest' ? 'rest' : sessionMode === 'drill' ? 'drill' : 'sparring';
    const phaseText = translate(phaseKey);
    const ownerText = step?.owner ? (step.athleteName || translate(`athlete${step.owner}`)) : '';
    const techniqueText = step?.technique || (step ? `${translate('round')} ${step.workNumber}` : '');
    setText(elements.phase, phaseText);
    setText(elements.timerAthlete, ownerText);
    elements.timerAthlete.hidden = !ownerText;
    setText(elements.timerTechnique, techniqueText);
    setText(elements.clock, formatTime(remainingMs));
    setText(elements.progress, step ? `${step.workNumber} / ${step.totalWork}` : '0 / 0');
    setText(elements.play, translate(isRunning ? 'pause' : hasFinished ? 'reset'
      : step && remainingMs < step.durationMs ? 'resume' : 'start'));
    elements.previous.disabled = !step || stepIndex === 0;
    elements.next.disabled = !step || stepIndex === sessionSteps.length - 1;
    elements.play.disabled = !step;
    elements.reset.disabled = !step;
    elements.progressBar.value = step ? Math.min(1, Math.max(0, 1 - remainingMs / step.durationMs)) : 0;
    elements.timerPanel.dataset.phase = hasFinished ? 'finished' : step?.phase || 'drill';
    elements.timerPanel.dataset.tone = step?.phase === 'prepare' ? 'prepare'
      : step?.phase === 'rest' ? 'rest' : step?.color || 'blue';
    const announcementKey = `${stepIndex}:${phaseKey}:${language}`;
    if (step && announcementKey !== lastAnnouncement) {
      lastAnnouncement = announcementKey;
      setText(elements.timerAnnouncement, [phaseText, ownerText, techniqueText,
        translate('timeNumber', { number: step.workNumber, total: step.totalWork })].filter(Boolean).join('. '));
    }
  }

  /* Bell synthesis: one AudioContext, a short attack and decaying inharmonic partials.
     No network requests, sound files, libraries or new context for every interval. */
  async function enableAudio() {
    if (!soundEnabled) return false;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Audio unavailable');
      if (!audioContext || audioContext.state === 'closed') {
        audioContext = new AudioContextClass();
        bellOutput = audioContext.createGain();
        bellOutput.gain.value = 0.2;
        bellOutput.connect(audioContext.destination);
      }
      if (audioContext.state !== 'running') await audioContext.resume();
      if (audioContext.state !== 'running') throw new Error('Audio suspended');
      bellOutput.gain.setValueAtTime(soundEnabled ? 0.2 : 0, audioContext.currentTime);
      setTimerNotice('audio');
      return true;
    } catch {
      if (soundEnabled) setTimerNotice('audio', 'audioUnavailable');
      return false;
    }
  }

  function ringBell() {
    if (!soundEnabled) return;
    if (!audioContext || audioContext.state !== 'running' || !bellOutput) {
      setTimerNotice('audio', 'audioUnavailable');
      return;
    }
    try {
      const startAt = audioContext.currentTime;
      const partials = [
        { ratio: 1, amplitude: 0.72, decay: 1.65 },
        { ratio: 2.01, amplitude: 0.3, decay: 1.15 },
        { ratio: 2.76, amplitude: 0.18, decay: 0.85 },
        { ratio: 5.4, amplitude: 0.09, decay: 0.5 }
      ];
      partials.forEach(({ ratio, amplitude, decay }) => {
        const oscillator = audioContext.createOscillator();
        const envelope = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(528 * ratio, startAt);
        envelope.gain.setValueAtTime(0.0001, startAt);
        envelope.gain.exponentialRampToValueAtTime(amplitude, startAt + 0.006);
        envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + decay);
        oscillator.connect(envelope);
        envelope.connect(bellOutput);
        oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
        oscillator.start(startAt);
        oscillator.stop(startAt + decay + 0.02);
      });
    } catch {
      setTimerNotice('audio', 'audioUnavailable');
    }
  }

  function renderSound() {
    elements.sound.setAttribute('aria-pressed', String(soundEnabled));
    elements.sound.title = translate(soundEnabled ? 'muteBell' : 'enableBell');
    elements.soundIcon.setAttribute('href', `./assets/icons/ui.svg#${soundEnabled ? 'bell' : 'bellOff'}`);
  }

  async function toggleSound() {
    // A suspended context is retried by this gesture rather than immediately muted.
    if (soundEnabled && (!audioContext || audioContext.state !== 'running')) {
      if (await enableAudio()) { ringBell(); return; }
    }
    soundEnabled = !soundEnabled;
    if (bellOutput && audioContext) bellOutput.gain.setValueAtTime(soundEnabled ? 0.2 : 0, audioContext.currentTime);
    renderSound();
    savePreferences();
    if (soundEnabled) {
      if (await enableAudio()) ringBell();
    } else {
      setTimerNotice('audio');
    }
  }

  /* Screen wake lock is automatic while the timer is running and visible.
     A generation counter prevents a late permission result keeping a paused screen awake. */
  function shouldKeepAwake() {
    return isRunning && currentPage === 'timer' && document.visibilityState === 'visible';
  }

  function renderWakeState() {
    elements.wake.dataset.state = wakeState;
    setText(elements.wakeText, translate('screenAwake'));
    const key = wakeState === 'active' ? 'wakeActive' : wakeState === 'pending' ? 'wakePending'
      : wakeState === 'unavailable' ? 'wakeUnavailable' : 'wakeIdle';
    elements.wake.title = translate(key);
    elements.wake.setAttribute('aria-label', translate(key));
  }

  async function acquireWakeLock() {
    if (!shouldKeepAwake() || isAcquiringWake) return;
    if (wakeLock && !wakeLock.released) return;
    if (!window.isSecureContext || !navigator.wakeLock?.request) {
      wakeState = 'unavailable';
      renderWakeState();
      setTimerNotice('wake', 'wakeUnavailable');
      return;
    }
    const requestGeneration = wakeGeneration;
    isAcquiringWake = true;
    wakeState = 'pending';
    renderWakeState();
    try {
      const sentinel = await navigator.wakeLock.request('screen');
      if (!shouldKeepAwake() || requestGeneration !== wakeGeneration) {
        await sentinel.release();
        return;
      }
      wakeLock = sentinel;
      wakeState = 'active';
      setTimerNotice('wake');
      sentinel.addEventListener('release', () => {
        if (wakeLock !== sentinel) return;
        wakeLock = null;
        wakeState = shouldKeepAwake() ? 'unavailable' : 'idle';
        if (shouldKeepAwake()) setTimerNotice('wake', 'wakeReleased');
        renderWakeState();
      }, { once: true });
    } catch {
      if (shouldKeepAwake() && requestGeneration === wakeGeneration) {
        wakeState = 'unavailable';
        setTimerNotice('wake', 'wakeUnavailable');
      }
    } finally {
      isAcquiringWake = false;
      renderWakeState();
      if (requestGeneration !== wakeGeneration && shouldKeepAwake()) void acquireWakeLock();
    }
  }

  async function releaseWakeLock() {
    wakeGeneration += 1;
    const sentinel = wakeLock;
    wakeLock = null;
    wakeState = 'idle';
    renderWakeState();
    if (sentinel && !sentinel.released) {
      try { await sentinel.release(); } catch { /* A released/hidden document needs no further action. */ }
    }
  }

  function isExpanded() {
    return document.fullscreenElement === elements.timerPanel || elements.timerPanel.classList.contains('isExpanded');
  }

  function renderFullscreenState() {
    const expanded = isExpanded();
    document.body.classList.toggle('hasExpandedTimer', expanded);
    elements.fullscreen.setAttribute('aria-pressed', String(expanded));
    elements.fullscreen.setAttribute('aria-label', translate(expanded ? 'exitFullscreen' : 'fullscreen'));
    elements.fullscreen.title = translate(expanded ? 'exitFullscreen' : 'fullscreen');
    elements.fullscreenIcon.setAttribute('href', `./assets/icons/ui.svg#${expanded ? 'collapse' : 'expand'}`);
  }

  async function leaveFullscreen() {
    elements.timerPanel.classList.remove('isExpanded');
    if (document.fullscreenElement === elements.timerPanel && document.exitFullscreen) {
      try { await document.exitFullscreen(); } catch { /* The browser may already have exited. */ }
    }
    renderFullscreenState();
  }

  async function toggleFullscreen() {
    if (isExpanded()) {
      await leaveFullscreen();
      return;
    }
    try {
      if (!elements.timerPanel.requestFullscreen) throw new Error('Fullscreen unavailable');
      await elements.timerPanel.requestFullscreen();
    } catch {
      // Mobile browsers without element fullscreen still get an expanded viewport.
      elements.timerPanel.classList.add('isExpanded');
    }
    renderFullscreenState();
  }

  function applyLanguage() {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(element => setText(element, translate(element.dataset.i18n)));
    document.querySelectorAll('[data-i18n-aria]').forEach(element => element.setAttribute('aria-label', translate(element.dataset.i18nAria)));
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate('description'));
    elements.athlete1.placeholder = translate('athlete1');
    elements.athlete2.placeholder = translate('athlete2');
    elements.techniqueName.placeholder = translate('technique');
    renderLibrary();
    renderSound();
    renderWakeState();
    renderFullscreenState();
    renderTimer();
    setTimerNotice('wake', timerNotices.wake);
  }

  function handleForeground() {
    if (document.visibilityState !== 'visible') return;
    if (isRunning) {
      tickTimer();
      if (isRunning) {
        void acquireWakeLock();
        if (soundEnabled && audioContext?.state !== 'running') void enableAudio();
      }
    }
  }

  function bindEvents() {
    elements.menuButton.addEventListener('click', () => setMenuOpen(elements.menu.hidden));
    document.querySelectorAll('button[data-page]').forEach(button => {
      button.addEventListener('click', () => showPage(button.dataset.page));
    });
    document.addEventListener('click', event => {
      if (!elements.menu.contains(event.target) && !elements.menuButton.contains(event.target)) setMenuOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !elements.menu.hidden) {
        setMenuOpen(false);
        elements.menuButton.focus();
      } else if (event.key === 'Escape' && isExpanded()) {
        void leaveFullscreen();
      } else if (event.code === 'Space' && !event.repeat && currentPage === 'timer'
        && !event.target.closest('button, input, select, textarea, a, [contenteditable="true"]')) {
        event.preventDefault();
        toggleTimer();
      }
    });
    document.querySelectorAll('.colorChoices button').forEach(button => {
      button.addEventListener('click', () => {
        const owner = Number(button.parentElement.dataset.athlete);
        athleteColors[owner] = button.dataset.color;
        athleteColors[owner === 1 ? 2 : 1] = button.dataset.color === 'green' ? 'blue' : 'green';
        renderColors();
        savePreferences();
      });
    });
    elements.addTechnique.addEventListener('submit', addTechnique);
    elements.participants.addEventListener('change', () => { renderChoices(); savePreferences(); });
    elements.alternateTiming.addEventListener('change', savePreferences);
    fieldNames.filter(id => id !== 'participants').forEach(id => {
      elements[id].addEventListener('change', () => { savePreferences(); renderLibrary(); });
    });
    elements.language.addEventListener('change', () => {
      language = elements.language.value === 'en' ? 'en' : 'pt';
      showMessage();
      applyLanguage();
      savePreferences();
    });
    elements.launchDrill.addEventListener('click', () => launchSession('drill'));
    elements.launchSparring.addEventListener('click', () => launchSession('sparring'));
    elements.play.addEventListener('click', toggleTimer);
    elements.reset.addEventListener('click', resetTimer);
    elements.previous.addEventListener('click', () => moveStep(-1));
    elements.next.addEventListener('click', () => moveStep(1));
    elements.back.addEventListener('click', () => showPage(sessionMode));
    elements.sound.addEventListener('click', () => { void toggleSound(); });
    elements.fullscreen.addEventListener('click', () => { void toggleFullscreen(); });
    elements.wake.addEventListener('click', () => { void acquireWakeLock(); });
    document.addEventListener('fullscreenchange', renderFullscreenState);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') handleForeground();
      else void releaseWakeLock();
    });
    window.addEventListener('focus', handleForeground);
    window.addEventListener('pageshow', handleForeground);
    window.addEventListener('pagehide', () => { void releaseWakeLock(); });
  }

  initializeFields();
  renderColors();
  renderChoices();
  applyLanguage();
  bindEvents();
})();
