(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('clock')) return;
  const dict = {
    pt:{subtitle:'Treine com propósito.',keepAwake:'Manter tela ativa',releaseWake:'Liberar tela',drill:'Drills',sparring:'Sparring',previous:'Anterior',next:'Próximo',start:'Iniciar',pause:'Pausar',resume:'Continuar',reset:'Reiniciar',drillSettings:'Configurar drill',duration:'Segundos por etapa',participants:'Participantes',one:'1 pessoa',two:'2 pessoas',sets:'Séries por técnica',firstAthlete:'Primeiro atleta',blue:'Azul',green:'Verde',drillHint:'Com 2 pessoas, cada atleta executa cada técnica em cada série.',techniques:'Biblioteca de técnicas',techniqueName:'Nome da técnica',add:'Adicionar',selectAll:'Selecionar todas',clear:'Limpar seleção',techHint:'Marque as técnicas que entrarão na sessão. A ordem da lista define a sequência.',sparringSettings:'Configurar sparring',prep:'Preparação (segundos)',fight:'Sparring (segundos)',rest:'Descanso (segundos)',rounds:'Rounds',sparringHint:'Sequência: preparar → sparring → descanso. O último round termina sem descanso.',athlete:'ATLETA',prepare:'PREPARAR',resting:'DESCANSO',finished:'Sessão concluída!',noTech:'Selecione ao menos uma técnica.',wakeUnsupported:'Seu navegador não oferece bloqueio de tela. Mantenha a tela ativa nas configurações do aparelho.',wakeFailed:'Não foi possível manter a tela ativa.',wakeActive:'Tela mantida ativa enquanto o app estiver visível.',removed:'Técnica removida.',invalid:'Confira os valores de tempo e quantidade.',defaultTechniques:['Passagem de guarda','Raspagem de meia-guarda','Arm lock','Triângulo','Saída da montada','Pegada de costas']},
    en:{subtitle:'Train with purpose.',keepAwake:'Keep screen awake',releaseWake:'Release screen',drill:'Drills',sparring:'Sparring',previous:'Previous',next:'Next',start:'Start',pause:'Pause',resume:'Resume',reset:'Reset',drillSettings:'Drill setup',duration:'Seconds per step',participants:'Participants',one:'1 person',two:'2 people',sets:'Sets per technique',firstAthlete:'First athlete',blue:'Blue',green:'Green',drillHint:'With 2 people, each athlete performs each technique in each set.',techniques:'Technique library',techniqueName:'Technique name',add:'Add',selectAll:'Select all',clear:'Clear selection',techHint:'Check the techniques for this session. List order determines the sequence.',sparringSettings:'Sparring setup',prep:'Preparation (seconds)',fight:'Sparring (seconds)',rest:'Rest (seconds)',rounds:'Rounds',sparringHint:'Sequence: prepare → sparring → rest. No rest after the last round.',athlete:'ATHLETE',prepare:'PREPARE',resting:'REST',finished:'Session complete!',noTech:'Select at least one technique.',wakeUnsupported:'Your browser does not support screen wake lock. Adjust device settings to keep the screen on.',wakeFailed:'Unable to keep the screen awake.',wakeActive:'Screen will stay awake while the app is visible.',removed:'Technique removed.',invalid:'Check time and count values.',defaultTechniques:['Guard pass','Half-guard sweep','Armbar','Triangle choke','Mount escape','Back take']}
  };
  const storageKey='awaken-drills-v1';
  const readStored=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return {}}};
  const saved=readStored();
  const defaults=dict.pt.defaultTechniques.map((name,i)=>({id:`preset-${i}`,name,selected:true,custom:false}));
  let techniques=Array.isArray(saved.techniques)?saved.techniques.filter(t=>t&&typeof t.id==='string'&&typeof t.name==='string').slice(0,200):defaults;
  let lang=saved.lang==='en'?'en':'pt',mode='drill',steps=[],index=0,remaining=60,deadline=0,running=false,ticker=null,wakeLock=null,finished=false;
  const t=key=>dict[lang][key]||key;
  const msg=text=>{$('message').textContent=text};
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify({lang,techniques,settings:Object.fromEntries(['drillSeconds','participants','sets','firstAthlete','prepSeconds','fightSeconds','restSeconds','rounds'].map(id=>[id,$(id).value]))}))}catch{msg('Local storage unavailable / armazenamento indisponível')}};
  const format=s=>{const n=Math.max(0,Math.ceil(s));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`};
  const number=(id,min,max)=>{const n=Number($(id).value);return Number.isInteger(n)&&n>=min&&n<=max?n:null};
  const valid=()=>{const specs=mode==='drill'?[['drillSeconds',5,3600],['sets',1,50]]:[['prepSeconds',0,3600],['fightSeconds',5,7200],['restSeconds',0,3600],['rounds',1,99]];return specs.every(([id,min,max])=>number(id,min,max)!==null)};
  const makeSteps=()=>{
    if(!valid()){msg(t('invalid'));return null}
    if(mode==='drill'){
      const selected=techniques.filter(x=>x.selected);
      if(!selected.length){msg(t('noTech'));return null}
      const result=[],people=Number($('participants').value),sets=number('sets',1,50),seconds=number('drillSeconds',5,3600),first=$('firstAthlete').value;
      for(const tech of selected)for(let set=1;set<=sets;set++)for(let p=0;p<people;p++)result.push({phase:'drill',seconds,tech:tech.name,athlete:p===0?first:first==='blue'?'green':'blue',set});
      return result;
    }
    const result=[],rounds=number('rounds',1,99),prep=number('prepSeconds',0,3600),fight=number('fightSeconds',5,7200),rest=number('restSeconds',0,3600);
    for(let r=1;r<=rounds;r++){if(prep)result.push({phase:'prep',seconds:prep,round:r});result.push({phase:'fight',seconds:fight,round:r});if(rest&&r<rounds)result.push({phase:'rest',seconds:rest,round:r})}return result;
  };
  const stop=()=>{running=false;clearInterval(ticker);ticker=null};
  const reset=()=>{stop();finished=false;steps=makeSteps()||[];index=0;remaining=steps[0]?.seconds||0;render()};
  const render=()=>{
    const step=steps[index];$('clock').textContent=format(remaining);$('start').textContent=t(running?'pause':remaining===0&&finished?'start':remaining< (step?.seconds||0)?'resume':'start');
    $('progress').textContent=steps.length?`${index+1} / ${steps.length}`:'0 / 0';
    $('phase').textContent=mode==='drill'?'DRILL':step?.phase==='prep'?t('prepare'):step?.phase==='rest'?t('resting'):'SPARRING';
    $('athlete').textContent=mode==='drill'&&step?`${t('athlete')} ${t(step.athlete).toUpperCase()}`:'';
    $('currentTechnique').textContent=mode==='drill'?(step?`${step.tech} · ${step.set}/${$('sets').value}`:'—'):(step?`${t('rounds')} ${step.round}/${$('rounds').value}`:'—');
    const panel=$('timerPanel');panel.classList.toggle('athlete-green',mode==='drill'&&step?.athlete==='green');panel.classList.toggle('phase-prep',mode==='sparring'&&step?.phase==='prep');panel.classList.toggle('phase-rest',mode==='sparring'&&step?.phase==='rest');
    $('progressBar').style.width=step?`${Math.max(0,Math.min(100,(1-remaining/step.seconds)*100))}%`:'0%';
    $('previous').disabled=index===0;$('next').disabled=!steps.length||index>=steps.length-1;
  };
  const beep=()=>{try{const C=window.AudioContext||window.webkitAudioContext;if(!C)return;const ctx=new C(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=760;gain.gain.setValueAtTime(.08,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.17);osc.start();osc.stop(ctx.currentTime+.18);osc.onended=()=>ctx.close()}catch{/* sound optional */}};
  const tick=()=>{if(!running)return;const now=performance.now();let left=(deadline-now)/1000;while(left<=0&&running){beep();if(index>=steps.length-1){remaining=0;finished=true;stop();msg(t('finished'));render();return}index++;left+=steps[index].seconds;deadline=now+left*1000}remaining=Math.max(0,left);render()};
  const play=()=>{if(running){remaining=Math.max(0,(deadline-performance.now())/1000);stop();render();return}if(!steps.length||finished){reset();if(!steps.length)return}if(remaining<=0)remaining=steps[index].seconds;running=true;deadline=performance.now()+remaining*1000;ticker=setInterval(tick,100);render()};
  const navigate=delta=>{if(!steps.length)return;stop();index=Math.max(0,Math.min(steps.length-1,index+delta));remaining=steps[index].seconds;finished=false;render()};
  const list=()=>{const host=$('techniqueList');host.replaceChildren();for(const tech of techniques){const row=document.createElement('div');row.className='technique-row';const label=document.createElement('label'),check=document.createElement('input'),name=document.createElement('span');check.type='checkbox';check.checked=!!tech.selected;check.addEventListener('change',()=>{tech.selected=check.checked;save();reset()});name.textContent=tech.custom?tech.name:(dict[lang].defaultTechniques[Number(tech.id.split('-')[1])]||tech.name);label.append(check,name);row.append(label);if(tech.custom){const del=document.createElement('button');del.type='button';del.className='remove';del.textContent='×';del.setAttribute('aria-label',`Remove ${tech.name}`);del.addEventListener('click',()=>{techniques=techniques.filter(x=>x!==tech);save();list();reset();msg(t('removed'))});row.append(del)}host.append(row)}};
  const translate=()=>{document.documentElement.lang=lang==='pt'?'pt-BR':'en';document.querySelectorAll('[data-i18n]').forEach(el=>{const value=t(el.dataset.i18n);el.textContent=value});$('techniqueName').placeholder=lang==='pt'?'Ex.: Passagem de guarda':'E.g. Guard pass';$('wake').textContent=t(wakeLock?'releaseWake':'keepAwake');list();render()};
  const acquireWake=async()=>{if(!('wakeLock'in navigator)){msg(t('wakeUnsupported'));return}try{wakeLock=await navigator.wakeLock.request('screen');wakeLock.addEventListener('release',()=>{wakeLock=null;$('wake').setAttribute('aria-pressed','false');$('wake').textContent=t('keepAwake')});$('wake').setAttribute('aria-pressed','true');$('wake').textContent=t('releaseWake');msg(t('wakeActive'))}catch{msg(t('wakeFailed'))}};
  $('wake').addEventListener('click',async()=>{if(wakeLock){await wakeLock.release();return}await acquireWake()});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&$('wake').getAttribute('aria-pressed')==='true'&&!wakeLock)acquireWake();if(!document.hidden&&running)tick()});
  $('start').addEventListener('click',play);$('reset').addEventListener('click',reset);$('next').addEventListener('click',()=>navigate(1));$('previous').addEventListener('click',()=>navigate(-1));
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;document.querySelectorAll('[data-mode]').forEach(b=>{b.classList.toggle('active',b===button);if(b===button)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});$('drillSettings').classList.toggle('hidden',mode!=='drill');$('sparringSettings').classList.toggle('hidden',mode!=='sparring');msg('');reset()}));
  $('language').addEventListener('change',()=>{lang=$('language').value;save();translate()});
  $('addTechnique').addEventListener('submit',e=>{e.preventDefault();const name=$('techniqueName').value.trim();if(!name||techniques.length>=200)return;techniques.push({id:`custom-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,name,selected:true,custom:true});$('techniqueName').value='';save();list();reset()});
  $('selectAll').addEventListener('click',()=>{techniques.forEach(x=>x.selected=true);save();list();reset()});$('clearSelection').addEventListener('click',()=>{techniques.forEach(x=>x.selected=false);save();list();reset()});
  for(const id of ['drillSeconds','participants','sets','firstAthlete','prepSeconds','fightSeconds','restSeconds','rounds'])$(id).addEventListener('change',()=>{save();reset()});
  for(const [id,value] of Object.entries(saved.settings||{}))if($(id)&&typeof value==='string')$(id).value=value;
  $('language').value=lang;translate();reset();
})();
