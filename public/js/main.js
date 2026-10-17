(() => {
  'use strict';

  const storageKey = 'awaken-drills-v2';
  const maxTechniques = 200;
  const ownerIds = [1, 2, 3];
  const colorValues = ['green', 'blue', 'red'];
  const pageNames = ['drill', 'sparring', 'library', 'timer'];
  const fieldNames = [
    'participants', 'athlete1', 'athlete2', 'athlete3', 'drillMin', 'drillSec',
    'drillPrepSec', 'prepSec', 'fightMin', 'fightSec', 'restMin', 'restSec', 'rounds'
  ];
  const elementNames = [
    ...fieldNames,
    ...pageNames.map(pageName => `${pageName}Page`),
    'language', 'menu', 'menuButton', 'timerMenu', 'alternateField', 'alternateTiming',
    'athleteSettings', 'athleteOne', 'athleteTwo', 'athleteThree', 'tech1', 'tech2', 'tech3',
    'owner', 'techniqueName', 'addTechnique', 'libraryList', 'launchDrill', 'launchSparring',
    'timerPanel', 'back', 'phase', 'sound', 'soundIcon', 'fullscreen', 'fullscreenIcon',
    'timerAthlete', 'timerTechnique', 'clock', 'progress', 'progressBar', 'previous', 'play',
    'next', 'reset', 'wake', 'wakeText', 'timerNotice', 'timerAnnouncement', 'message',
    'popup', 'popupTitle', 'popupMessage', 'popupClose'
  ];
  const elements = Object.fromEntries(elementNames.map(id => [id, document.getElementById(id)]));

  const translations = {
    pt: {
      skipContent: 'Ir para o conteúdo', language: 'Idioma', navigation: 'Navegação',
      drills: 'Drills', drill: 'Drill', sparring: 'Sparring', techniques: 'Técnicas',
      technique: 'Técnica', timer: 'Cronômetro', athletes: 'Atletas', athlete: 'Atleta',
      athlete1: 'Atleta 1', athlete2: 'Atleta 2', athlete3: 'Atleta 3',
      athlete1Color: 'Cor do atleta 1', athlete2Color: 'Cor do atleta 2', athlete3Color: 'Cor do atleta 3',
      athlete1Techniques: 'Técnicas do atleta 1', athlete2Techniques: 'Técnicas do atleta 2', athlete3Techniques: 'Técnicas do atleta 3',
      green: 'Verde', blue: 'Azul', red: 'Vermelho', duration: 'Tempo', minutesShort: 'Min', secondsShort: 'Seg',
      drillMinutes: 'Drill, minutos', drillSeconds: 'Drill, segundos',
      fightMinutes: 'Sparring, minutos', fightSeconds: 'Sparring, segundos',
      restMinutes: 'Descanso, minutos', restSeconds: 'Descanso, segundos',
      prepareSeconds: 'Preparar, segundos', prepare: 'Preparar', rest: 'Descanso',
      alternateAthletes: 'Alternar Atletas', rounds: 'Rounds', round: 'Round',
      start: 'Iniciar', pause: 'Pausar', resume: 'Continuar', reset: 'Reiniciar',
      add: 'Adicionar', remove: 'Remover {name}', back: 'Voltar', previous: 'Anterior', next: 'Próximo',
      fullscreen: 'Tela Cheia', exitFullscreen: 'Sair da Tela Cheia', bell: 'Sino', muteBell: 'Silenciar Sino',
      enableBell: 'Ativar Sino', elapsed: 'Tempo decorrido', finished: 'FIM', screenAwake: 'Tela Ativa',
      wakeIdle: 'Tela ativa durante o treino', wakeActive: 'Tela ativa: proteção contra bloqueio em uso',
      wakePending: 'Ativando proteção contra bloqueio',
      wakeUnavailable: 'Tela ativa indisponível. Verifique o navegador e a bateria.',
      wakeReleased: 'Proteção de tela interrompida. Toque em Tela Ativa para tentar novamente.',
      audioUnavailable: 'Não foi possível ativar o ring bell. Toque no botão do sino e tente novamente.',
      invalidDuration: 'Escolha um tempo maior que zero.', invalidTechnique: 'Digite o nome da técnica.',
      duplicateTechnique: 'Técnica já cadastrada.', techniqueLimit: 'Limite de 200 técnicas atingido.',
      storageUnavailable: 'Não foi possível salvar os dados neste navegador.',
      unexpectedError: 'Ocorreu um erro inesperado. Recarregue a página se o problema continuar.',
      serviceWorkerError: 'Não foi possível ativar o modo offline deste webapp.',
      errorTitle: 'Aviso', ok: 'OK', timeNumber: 'Tempo {number} de {total}',
      description: 'Awaken Drills: cronômetros de drills e sparring de Jiu-Jitsu.'
    },
    en: {
      skipContent: 'Skip to content', language: 'Language', navigation: 'Navigation',
      drills: 'Drills', drill: 'Drill', sparring: 'Sparring', techniques: 'Techniques',
      technique: 'Technique', timer: 'Timer', athletes: 'Athletes', athlete: 'Athlete',
      athlete1: 'Athlete 1', athlete2: 'Athlete 2', athlete3: 'Athlete 3',
      athlete1Color: 'Athlete 1 color', athlete2Color: 'Athlete 2 color', athlete3Color: 'Athlete 3 color',
      athlete1Techniques: 'Athlete 1 techniques', athlete2Techniques: 'Athlete 2 techniques', athlete3Techniques: 'Athlete 3 techniques',
      green: 'Green', blue: 'Blue', red: 'Red', duration: 'Time', minutesShort: 'Min', secondsShort: 'Sec',
      drillMinutes: 'Drill, minutes', drillSeconds: 'Drill, seconds',
      fightMinutes: 'Sparring, minutes', fightSeconds: 'Sparring, seconds',
      restMinutes: 'Rest, minutes', restSeconds: 'Rest, seconds',
      prepareSeconds: 'Prepare, seconds', prepare: 'Prepare', rest: 'Rest',
      alternateAthletes: 'Alternate Athletes', rounds: 'Rounds', round: 'Round',
      start: 'Start', pause: 'Pause', resume: 'Resume', reset: 'Restart',
      add: 'Add', remove: 'Remove {name}', back: 'Back', previous: 'Previous', next: 'Next',
      fullscreen: 'Full Screen', exitFullscreen: 'Exit Full Screen', bell: 'Bell', muteBell: 'Mute Bell',
      enableBell: 'Enable Bell', elapsed: 'Elapsed time', finished: 'END', screenAwake: 'Screen Awake',
      wakeIdle: 'Keep screen awake during training', wakeActive: 'Screen awake: wake lock is active',
      wakePending: 'Requesting screen wake lock',
      wakeUnavailable: 'Screen wake lock unavailable. Check your browser and battery.',
      wakeReleased: 'Screen wake lock released. Tap Screen Awake to retry.',
      audioUnavailable: 'The boxing ring bell could not be enabled. Tap the bell button and try again.',
      invalidDuration: 'Choose a time greater than zero.', invalidTechnique: 'Enter a technique name.',
      duplicateTechnique: 'Technique already added.', techniqueLimit: 'The 200-technique limit has been reached.',
      storageUnavailable: 'Could not save data in this browser.',
      unexpectedError: 'An unexpected error occurred. Reload the page if the problem continues.',
      serviceWorkerError: 'The offline mode for this web app could not be enabled.',
      errorTitle: 'Notice', ok: 'OK', timeNumber: 'Interval {number} of {total}',
      description: 'Awaken Drills: Jiu-Jitsu drills and sparring timers.'
    }
  };

  let language = 'pt';
  let techniques = [];
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
  let soundEnabled = true;
  let audioContext = null;
  let bellOutput = null;
  let bellCompressor = null;
  let wakeLock = null;
  let wakeGeneration = 0;
  let isAcquiringWake = false;
  let wakeState = 'idle';
  let fullscreenControlTimer = null;
  let nativeFullscreenRequested = false;
  let popupPreviousFocus = null;
  let lastUnexpectedPopupAt = 0;
  const timerNotices = { wake: '', audio: '' };
  const athleteColors = { 1: 'green', 2: 'blue', 3: 'red' };

  function translate(key, replacements = {}) {
    let value = translations[language]?.[key] || translations.pt[key] || key;
    for (const [name, replacement] of Object.entries(replacements)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
  }

  function setText(element, text) {
    if (element && element.textContent !== text) element.textContent = text;
  }

  function missingCriticalElement() {
    return Object.entries(elements).find(([, element]) => !element)?.[0] || '';
  }

  function showPopup(message, title = translate('errorTitle')) {
    if (!message) return;
    if (!elements.popup || !elements.popupMessage || !elements.popupClose) {
      window.alert(String(message));
      return;
    }
    popupPreviousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setText(elements.popupTitle, title);
    setText(elements.popupMessage, String(message));
    elements.popup.hidden = false;
    document.body.classList.add('hasPopup');
    window.setTimeout(() => elements.popupClose.focus({ preventScroll: true }), 0);
  }

  function closePopup() {
    if (!elements.popup || elements.popup.hidden) return;
    elements.popup.hidden = true;
    document.body.classList.remove('hasPopup');
    const target = popupPreviousFocus;
    popupPreviousFocus = null;
    if (target?.isConnected) target.focus({ preventScroll: true });
  }

  function reportUnexpectedError() {
    const now = Date.now();
    if (now - lastUnexpectedPopupAt < 1500) return;
    lastUnexpectedPopupAt = now;
    showPopup(translate('unexpectedError'));
  }

  window.addEventListener('error', event => {
    console.error(event.error || event.message);
    reportUnexpectedError();
  });
  window.addEventListener('unhandledrejection', event => {
    console.error(event.reason);
    reportUnexpectedError();
  });

  const missingId = missingCriticalElement();
  if (missingId) {
    console.error(`Awaken Drills: missing element #${missingId}`);
    reportUnexpectedError();
    return;
  }

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
      .filter(item => item && typeof item.name === 'string' && item.name.trim() && ownerIds.includes(Number(item.owner)))
      .slice(0, maxTechniques)
      .map(item => ({
        id: typeof item.id === 'string' ? item.id.slice(0, 100) : makeId(),
        name: item.name.trim().slice(0, 90),
        owner: Number(item.owner),
        selected: item.selected !== false
      }));
  }

  const preferences = loadPreferences();
  language = preferences.lang === 'en' ? 'en' : 'pt';
  techniques = sanitizeTechniques(preferences.techniques);
  soundEnabled = preferences.soundEnabled !== false;

  for (const owner of ownerIds) {
    const saved = preferences.colors?.[owner];
    if (colorValues.includes(saved)) athleteColors[owner] = saved;
  }

  function normalizeColors() {
    const used = new Set();
    for (const owner of ownerIds) {
      let color = athleteColors[owner];
      if (!colorValues.includes(color) || used.has(color)) {
        color = colorValues.find(candidate => !used.has(candidate)) || colorValues[(owner - 1) % colorValues.length];
      }
      athleteColors[owner] = color;
      used.add(color);
    }
  }
  normalizeColors();

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
        version: 4,
        lang: language,
        techniques,
        colors: athleteColors,
        soundEnabled,
        values
      }));
    } catch {
      showPopup(translate('storageUnavailable'));
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
        element.value = /^(Atleta|Athlete) [123]$/.test(value) ? '' : value.trim().slice(0, 32);
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

  function assignColor(owner, requestedColor) {
    if (!ownerIds.includes(owner) || !colorValues.includes(requestedColor)) return;
    athleteColors[owner] = requestedColor;
    const used = new Set([requestedColor]);
    for (const otherOwner of ownerIds.filter(candidate => candidate !== owner)) {
      let next = athleteColors[otherOwner];
      if (!colorValues.includes(next) || used.has(next)) {
        next = colorValues.find(candidate => !used.has(candidate)) || colorValues[0];
      }
      athleteColors[otherOwner] = next;
      used.add(next);
    }
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
    const count = Math.min(3, Math.max(1, Number(elements.participants.value) || 1));
    elements.athleteOne.hidden = false;
    elements.athleteTwo.hidden = count < 2;
    elements.athleteThree.hidden = count < 3;
    elements.alternateField.hidden = count < 2;
    elements.alternateTiming.disabled = count < 2;
    elements.athleteSettings.classList.toggle('singleAthlete', count === 1);
    elements.athleteSettings.dataset.count = String(count);

    for (const owner of ownerIds) {
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
    for (const owner of ownerIds) {
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
    if (!name) {
      showPopup(translate('invalidTechnique'));
      return;
    }
    if (techniques.length >= maxTechniques) {
      showPopup(translate('techniqueLimit'));
      return;
    }
    if (techniques.some(item => item.owner === owner && item.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showPopup(translate('duplicateTechnique'));
      return;
    }
    techniques.push({ id: makeId(), name, owner, selected: true });
    elements.techniqueName.value = '';
    savePreferences();
    renderLibrary();
    renderChoices();
    elements.techniqueName.focus();
  }

  function activeOwners() {
    const count = Math.min(3, Math.max(1, Number(elements.participants.value) || 1));
    return ownerIds.slice(0, count);
  }

  function buildDrillSteps() {
    const workDuration = durationMs('drill');
    if (!workDuration) throw new Error(translate('invalidDuration'));

    const owners = activeOwners();
    const selectedByOwner = {};
    for (const owner of owners) {
      const selected = techniques.filter(item => item.owner === owner && item.selected);
      // No technique is a valid choice: one blank interval keeps the athlete in the rotation.
      selectedByOwner[owner] = selected.length ? selected : [null];
    }

    const orderedEntries = [];
    if (owners.length > 1 && elements.alternateTiming.checked) {
      const turnsPerAthlete = Math.max(...owners.map(owner => selectedByOwner[owner].length));
      for (let turn = 0; turn < turnsPerAthlete; turn += 1) {
        for (const owner of owners) {
          const list = selectedByOwner[owner];
          orderedEntries.push({ owner, technique: list[turn % list.length] });
        }
      }
    } else {
      for (const owner of owners) {
        for (const technique of selectedByOwner[owner]) orderedEntries.push({ owner, technique });
      }
    }

    const preparationMs = Number(elements.drillPrepSec.value) * 1000;
    const steps = [];
    orderedEntries.forEach((entry, index) => {
      const work = {
        phase: 'drill',
        durationMs: workDuration,
        owner: entry.owner,
        athleteName: elements[`athlete${entry.owner}`].value.trim(),
        color: athleteColors[entry.owner],
        technique: entry.technique?.name || '',
        workNumber: index + 1,
        totalWork: orderedEntries.length
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
      showPopup(error instanceof Error ? error.message : translate('unexpectedError'));
      return;
    }

    stopClock();
    sessionMode = mode;
    sessionSteps = nextSteps;
    stepIndex = 0;
    remainingMs = sessionSteps[0]?.durationMs || 0;
    hasFinished = false;
    lastAnnouncement = '';
    elements.timerMenu.disabled = false;
    setTimerNotice('wake');
    setTimerNotice('audio');
    savePreferences();

    // This runs from the user's click and is intentionally started before the first bell.
    void enableAudio(true).then(enabled => {
      if (!enabled && soundEnabled) showPopup(translate('audioUnavailable'));
    });
    showPage('timer');
    startTimer();
  }

  function stopClock() {
    isRunning = false;
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    void releaseWakeLock();
  }

  function startTimer() {
    if (!sessionSteps.length || isRunning) return;
    if (hasFinished) resetTimer();
    isRunning = true;
    deadlineAt = Date.now() + remainingMs;
    timerInterval = window.setInterval(tickTimer, 100);
    void enableAudio(false);
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
    lastAnnouncement = '';
    renderTimer();
  }

  function moveStep(direction) {
    if (!sessionSteps.length) return;
    stopClock();
    stepIndex = Math.min(sessionSteps.length - 1, Math.max(0, stepIndex + direction));
    remainingMs = sessionSteps[stepIndex].durationMs;
    hasFinished = false;
    lastAnnouncement = '';
    renderTimer();
  }

  function tickTimer() {
    if (!isRunning) return;
    const now = Date.now();
    let crossedBoundary = false;
    let lastBoundaryAt = 0;

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
    if (crossedBoundary && document.visibilityState === 'visible' && now - lastBoundaryAt < 1500) {
      ringBell(hasFinished ? 3 : 1);
    }
    renderTimer();
  }

  function renderTimer() {
    const step = sessionSteps[stepIndex];
    const phaseKey = hasFinished ? 'finished'
      : step?.phase === 'prepare' ? 'prepare'
        : step?.phase === 'rest' ? 'rest'
          : sessionMode === 'drill' ? 'drill' : 'sparring';
    const phaseText = translate(phaseKey);
    const ownerText = hasFinished ? '' : step?.owner ? (step.athleteName || translate(`athlete${step.owner}`)) : '';
    const techniqueText = hasFinished ? '' : step?.technique || (step && !step.owner ? `${translate('round')} ${step.workNumber}` : '');

    setText(elements.phase, phaseText);
    setText(elements.timerAthlete, ownerText);
    elements.timerAthlete.hidden = !ownerText;
    setText(elements.timerTechnique, techniqueText);
    elements.timerTechnique.hidden = !techniqueText;
    setText(elements.clock, hasFinished ? translate('finished') : formatTime(remainingMs));
    setText(elements.progress, hasFinished ? '' : step ? `${step.workNumber} / ${step.totalWork}` : '0 / 0');
    elements.progress.hidden = hasFinished;
    setText(elements.play, translate(isRunning ? 'pause' : hasFinished ? 'reset' : step && remainingMs < step.durationMs ? 'resume' : 'start'));

    elements.previous.disabled = !step || stepIndex === 0 || hasFinished;
    elements.next.disabled = !step || stepIndex === sessionSteps.length - 1 || hasFinished;
    elements.play.disabled = !step;
    elements.reset.disabled = !step;
    elements.progressBar.value = hasFinished ? 1 : step ? Math.min(1, Math.max(0, 1 - remainingMs / step.durationMs)) : 0;
    elements.progressBar.hidden = hasFinished;

    elements.timerPanel.dataset.phase = hasFinished ? 'finished' : step?.phase || 'drill';
    elements.timerPanel.dataset.tone = hasFinished ? 'finished'
      : step?.phase === 'prepare' ? 'prepare'
        : step?.phase === 'rest' ? 'rest'
          : step?.color || 'blue';

    const announcementKey = `${stepIndex}:${phaseKey}:${language}:${hasFinished}`;
    if (announcementKey !== lastAnnouncement) {
      lastAnnouncement = announcementKey;
      const announcement = hasFinished
        ? translate('finished')
        : [phaseText, ownerText, techniqueText, step ? translate('timeNumber', { number: step.workNumber, total: step.totalWork }) : '']
          .filter(Boolean).join('. ');
      setText(elements.timerAnnouncement, announcement);
    }
  }

  function createBellAudioGraph() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) throw new Error('AudioContext unavailable');
    try {
      audioContext = new AudioContextClass({ latencyHint: 'interactive' });
    } catch {
      audioContext = new AudioContextClass();
    }
    bellOutput = audioContext.createGain();
    bellCompressor = audioContext.createDynamicsCompressor();
    bellCompressor.threshold.value = -14;
    bellCompressor.knee.value = 18;
    bellCompressor.ratio.value = 5;
    bellCompressor.attack.value = 0.003;
    bellCompressor.release.value = 0.25;
    bellOutput.gain.value = soundEnabled ? 0.72 : 0;
    bellOutput.connect(bellCompressor);
    bellCompressor.connect(audioContext.destination);
  }

  function primeSilentAudio() {
    if (!audioContext || !bellOutput) return;
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.00001, now);
    oscillator.connect(gain);
    gain.connect(bellOutput);
    oscillator.start(now);
    oscillator.stop(now + 0.015);
    oscillator.onended = () => {
      oscillator.disconnect();
      gain.disconnect();
    };
  }

  async function enableAudio(prime = false) {
    if (!soundEnabled) return false;
    try {
      if (!audioContext || audioContext.state === 'closed') createBellAudioGraph();
      if (audioContext.state !== 'running') await audioContext.resume();
      if (audioContext.state !== 'running') throw new Error('Audio suspended');
      bellOutput.gain.setValueAtTime(soundEnabled ? 0.72 : 0, audioContext.currentTime);
      if (prime) primeSilentAudio();
      setTimerNotice('audio');
      return true;
    } catch (error) {
      console.warn('Awaken Drills audio:', error);
      setTimerNotice('audio', 'audioUnavailable');
      return false;
    }
  }

  function scheduleBellStrike(startAt) {
    if (!audioContext || !bellOutput) return;
    const partials = [
      { frequency: 421, amplitude: 0.75, decay: 2.25, type: 'triangle' },
      { frequency: 598, amplitude: 0.50, decay: 2.00, type: 'sine' },
      { frequency: 787, amplitude: 0.34, decay: 1.70, type: 'sine' },
      { frequency: 1113, amplitude: 0.22, decay: 1.25, type: 'sine' },
      { frequency: 1517, amplitude: 0.13, decay: 0.90, type: 'sine' }
    ];

    partials.forEach(({ frequency, amplitude, decay, type }) => {
      const oscillator = audioContext.createOscillator();
      const envelope = audioContext.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, startAt);
      oscillator.detune.setValueAtTime((Math.random() - 0.5) * 5, startAt);
      envelope.gain.setValueAtTime(0.0001, startAt);
      envelope.gain.exponentialRampToValueAtTime(amplitude, startAt + 0.004);
      envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, amplitude * 0.72), startAt + 0.06);
      envelope.gain.exponentialRampToValueAtTime(0.0001, startAt + decay);
      oscillator.connect(envelope);
      envelope.connect(bellOutput);
      oscillator.start(startAt);
      oscillator.stop(startAt + decay + 0.03);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
      };
    });

    const noiseLength = Math.max(1, Math.floor(audioContext.sampleRate * 0.045));
    const buffer = audioContext.createBuffer(1, noiseLength, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = audioContext.createBufferSource();
    const filter = audioContext.createBiquadFilter();
    const noiseGain = audioContext.createGain();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1900, startAt);
    filter.Q.setValueAtTime(0.8, startAt);
    noiseGain.gain.setValueAtTime(0.22, startAt);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.045);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(bellOutput);
    source.start(startAt);
    source.stop(startAt + 0.05);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      noiseGain.disconnect();
    };
  }

  function ringBell(strikes = 1) {
    if (!soundEnabled) return;
    if (!audioContext || audioContext.state !== 'running' || !bellOutput) {
      setTimerNotice('audio', 'audioUnavailable');
      return;
    }
    try {
      const firstStrike = audioContext.currentTime + 0.01;
      const count = Math.max(1, Math.min(3, Number(strikes) || 1));
      for (let index = 0; index < count; index += 1) scheduleBellStrike(firstStrike + index * 0.32);
    } catch (error) {
      console.warn('Awaken Drills bell:', error);
      setTimerNotice('audio', 'audioUnavailable');
      showPopup(translate('audioUnavailable'));
    }
  }

  function renderSound() {
    elements.sound.setAttribute('aria-pressed', String(soundEnabled));
    elements.sound.title = translate(soundEnabled ? 'muteBell' : 'enableBell');
    elements.soundIcon.setAttribute('href', `./assets/icons/ui.svg#${soundEnabled ? 'bell' : 'bellOff'}`);
  }

  async function toggleSound() {
    if (soundEnabled && (!audioContext || audioContext.state !== 'running')) {
      const enabled = await enableAudio(true);
      if (enabled) {
        ringBell(1);
        return;
      }
      showPopup(translate('audioUnavailable'));
      return;
    }

    soundEnabled = !soundEnabled;
    if (bellOutput && audioContext) bellOutput.gain.setValueAtTime(soundEnabled ? 0.72 : 0, audioContext.currentTime);
    renderSound();
    savePreferences();
    if (soundEnabled) {
      if (await enableAudio(true)) ringBell(1);
      else showPopup(translate('audioUnavailable'));
    } else {
      setTimerNotice('audio');
    }
  }

  function shouldKeepAwake() {
    return isRunning && currentPage === 'timer' && document.visibilityState === 'visible';
  }

  function renderWakeState() {
    elements.wake.dataset.state = wakeState;
    setText(elements.wakeText, translate('screenAwake'));
    const key = wakeState === 'active' ? 'wakeActive'
      : wakeState === 'pending' ? 'wakePending'
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
    } catch (error) {
      console.warn('Awaken Drills wake lock:', error);
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
      try {
        await sentinel.release();
      } catch {
        // Already released or the document is hidden.
      }
    }
  }

  function nativeFullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function isExpanded() {
    return elements.timerPanel.classList.contains('isExpanded');
  }

  function hideFullscreenControls() {
    if (fullscreenControlTimer) window.clearTimeout(fullscreenControlTimer);
    fullscreenControlTimer = null;
    elements.timerPanel.classList.remove('controlsVisible');
  }

  function revealFullscreenControls() {
    if (!isExpanded()) return;
    elements.timerPanel.classList.add('controlsVisible');
    if (fullscreenControlTimer) window.clearTimeout(fullscreenControlTimer);
    fullscreenControlTimer = window.setTimeout(hideFullscreenControls, 3200);
    if (soundEnabled && audioContext?.state !== 'running') void enableAudio(true);
  }

  function renderFullscreenState() {
    const expanded = isExpanded();
    document.body.classList.toggle('hasExpandedTimer', expanded);
    elements.fullscreen.setAttribute('aria-pressed', String(expanded));
    elements.fullscreen.setAttribute('aria-label', translate(expanded ? 'exitFullscreen' : 'fullscreen'));
    elements.fullscreen.title = translate(expanded ? 'exitFullscreen' : 'fullscreen');
    elements.fullscreenIcon.setAttribute('href', `./assets/icons/ui.svg#${expanded ? 'collapse' : 'expand'}`);
  }

  async function requestNativeFullscreen() {
    const target = document.documentElement;
    const request = target.requestFullscreen || target.webkitRequestFullscreen;
    if (!request) return false;
    try {
      if (target.requestFullscreen) {
        try {
          await target.requestFullscreen({ navigationUI: 'hide' });
        } catch {
          await target.requestFullscreen();
        }
      } else {
        const result = target.webkitRequestFullscreen();
        if (result?.then) await result;
      }
      return true;
    } catch (error) {
      console.info('Native fullscreen unavailable; using viewport fallback.', error);
      return false;
    }
  }

  async function leaveFullscreen() {
    hideFullscreenControls();
    elements.timerPanel.classList.remove('isExpanded');
    renderFullscreenState();
    const fullscreenElement = nativeFullscreenElement();
    if (fullscreenElement) {
      try {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      } catch {
        // Browser may already be exiting fullscreen.
      }
    }
    nativeFullscreenRequested = false;
  }

  async function toggleFullscreen() {
    if (isExpanded()) {
      await leaveFullscreen();
      return;
    }
    nativeFullscreenRequested = await requestNativeFullscreen();
    elements.timerPanel.classList.add('isExpanded');
    hideFullscreenControls();
    renderFullscreenState();
  }

  function handleNativeFullscreenChange() {
    if (nativeFullscreenRequested && !nativeFullscreenElement() && isExpanded()) {
      nativeFullscreenRequested = false;
      hideFullscreenControls();
      elements.timerPanel.classList.remove('isExpanded');
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
    elements.athlete3.placeholder = translate('athlete3');
    elements.techniqueName.placeholder = translate('technique');
    renderLibrary();
    renderSound();
    renderWakeState();
    renderFullscreenState();
    renderTimer();
    setTimerNotice('wake', timerNotices.wake);
    setTimerNotice('audio', timerNotices.audio);
  }

  function handleForeground() {
    if (document.visibilityState !== 'visible') return;
    if (isRunning) {
      tickTimer();
      if (isRunning) {
        void acquireWakeLock();
        if (soundEnabled && audioContext?.state !== 'running') void enableAudio(false);
      }
    }
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const allowedProtocol = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!allowedProtocol) return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(error => {
        console.warn('Awaken Drills service worker:', error);
        showPopup(translate('serviceWorkerError'));
      });
    }, { once: true });
  }

  function bindEvents() {
    elements.popupClose.addEventListener('click', closePopup);
    elements.popup.addEventListener('click', event => {
      if (event.target === elements.popup) closePopup();
    });

    elements.menuButton.addEventListener('click', () => setMenuOpen(elements.menu.hidden));
    document.querySelectorAll('button[data-page]').forEach(button => {
      button.addEventListener('click', () => showPage(button.dataset.page));
    });
    document.addEventListener('click', event => {
      if (!elements.menu.contains(event.target) && !elements.menuButton.contains(event.target)) setMenuOpen(false);
    });

    document.addEventListener('keydown', event => {
      if (!elements.popup.hidden && event.key === 'Escape') {
        event.preventDefault();
        closePopup();
      } else if (event.key === 'Escape' && !elements.menu.hidden) {
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
        assignColor(owner, button.dataset.color);
        renderColors();
        savePreferences();
      });
    });

    elements.addTechnique.addEventListener('submit', addTechnique);
    elements.participants.addEventListener('change', () => {
      renderChoices();
      savePreferences();
    });
    elements.alternateTiming.addEventListener('change', savePreferences);
    fieldNames.filter(id => id !== 'participants').forEach(id => {
      elements[id].addEventListener('change', () => {
        savePreferences();
        renderLibrary();
      });
    });

    elements.language.addEventListener('change', () => {
      language = elements.language.value === 'en' ? 'en' : 'pt';
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

    elements.timerPanel.addEventListener('pointerdown', event => {
      if (!isExpanded()) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      revealFullscreenControls();
    });

    document.addEventListener('fullscreenchange', handleNativeFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleNativeFullscreenChange);
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
  registerServiceWorker();
})();
