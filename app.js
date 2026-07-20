let DATA = null;
let answers = {};

async function init() {
  DATA = await fetch('data.json').then((r) => r.json());
  renderCrisisBanner();
  showStep('crisis');
}

function renderCrisisBanner() {
  const el = document.getElementById('crisisBanner');
  if (!el || !DATA.crisis_info) return;
  el.innerHTML = `
    <strong>${DATA.crisis_info.title}</strong>
    <div class="crisis-items">
      ${DATA.crisis_info.services.map((s) => `<span>${s.name} - ${s.description}</span>`).join('')}
    </div>
  `;
}

function showStep(stepId) {
  if (stepId === 'crisis') return renderCrisisQuestion();
  if (stepId === 'result') return renderResult();
  renderGenericQuestion(stepId);
}

function renderCrisisQuestion() {
  const q = DATA.questions.crisis;
  document.getElementById('questionBox').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('progressText').textContent = 'Eerste vraag';
  document.getElementById('progressFill').style.width = '10%';
  document.getElementById('questionTitle').textContent = q.text;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  q.options.forEach((opt) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = opt.label;
    button.addEventListener('click', () => {
      if (opt.value === 'ja') {
        answers.routeOverride = 'crisis';
        showStep('result');
      } else {
        showStep('voor_wie');
      }
    });
    optionsContainer.appendChild(button);
  });
}

function getQuestionDef(stepId) {
  if (stepId === 'ouder_school_sub1') return DATA.questions.ouder_school_sub1;
  return DATA.questions[stepId];
}

const STEP_ORDER = ['voor_wie', 'eerder_hulp', 'thema'];

function renderGenericQuestion(stepId) {
  const q = getQuestionDef(stepId);
  if (!q) return showStep('result');

  document.getElementById('questionBox').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';

  const stepIndex = STEP_ORDER.indexOf(stepId);
  if (stepIndex >= 0) {
    document.getElementById('progressText').textContent = `Vraag ${stepIndex + 2}`;
    document.getElementById('progressFill').style.width = `${((stepIndex + 2) / 6) * 100}%`;
  } else {
    document.getElementById('progressText').textContent = 'Nog even doorvragen';
    document.getElementById('progressFill').style.width = '80%';
  }

  document.getElementById('questionTitle').textContent = q.text;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  q.options.forEach((opt) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = opt.label;
    button.addEventListener('click', () => {
      answers[stepId] = opt.value;
      determineNext(stepId, opt.value);
    });
    optionsContainer.appendChild(button);
  });
}

function determineNext(stepId, value) {
  switch (stepId) {
    case 'voor_wie':
      return showStep('eerder_hulp');
    case 'eerder_hulp':
      return showStep('thema');
    case 'thema':
      if (value === 'mentaal') return showStep('mentaal_sub1');
      if (value === 'relaties') return showStep('relaties_sub1');
      if (value === 'school') return showStep(answers.voor_wie === 'ouder' ? 'ouder_school_sub1' : 'school_sub1');
      if (value === 'opvoeding') return showStep('opvoeding_sub1');
      if (value === 'verslaving') return showStep('verslaving_sub1');
      return showStep('result');
    case 'mentaal_sub1':
      if (value === 'zelfmoord') { answers.routeOverride = 'zelfmoord'; return showStep('result'); }
      if (value === 'angst' || value === 'depressie') return showStep('urgentie');
      if (value === 'anders') return showStep('mentaal_sub2');
      return showStep('result');
    case 'urgentie':
      return showStep('result');
    case 'mentaal_sub2':
      return showStep('result');
    case 'relaties_sub1':
      if (value === 'seksueel_geweld') { answers.routeOverride = 'seksueel_geweld'; return showStep('result'); }
      if (value === 'lichamelijk_geweld') return showStep('relaties_sub2');
      return showStep('result');
    case 'relaties_sub2':
      if (value === 'onveilig') answers.routeOverride = 'geweld_onveilig';
      return showStep('result');
    case 'school_sub1':
      if (value === 'pesten') return showStep('school_sub2');
      return showStep('result');
    case 'ouder_school_sub1':
      return showStep('result');
    case 'school_sub2':
      return showStep('result');
    case 'opvoeding_sub1':
      return showStep('opvoeding_sub2');
    case 'opvoeding_sub2':
      return showStep('result');
    case 'verslaving_sub1':
      return showStep('verslaving_sub2');
    case 'verslaving_sub2':
      return showStep('result');
    default:
      return showStep('result');
  }
}

function buildCandidateKeys() {
  const { voor_wie, eerder_hulp, thema } = answers;
  const parts = [voor_wie, eerder_hulp, thema];

  if (thema === 'mentaal') {
    if (answers.mentaal_sub1 === 'angst' || answers.mentaal_sub1 === 'depressie') {
      parts.push(answers.mentaal_sub1);
      if (answers.urgentie) parts.push(answers.urgentie);
    } else if (answers.mentaal_sub1 === 'stress') {
      parts.push('stress');
    } else if (answers.mentaal_sub1 === 'eetstoornis') {
      parts.push('eetstoornis');
    } else if (answers.mentaal_sub2 === 'ernstig') {
      parts.push('ernstig');
    }
  } else if (thema === 'relaties') {
    if (['relatieproblemen', 'familie', 'eenzaamheid'].includes(answers.relaties_sub1)) {
      parts.push(answers.relaties_sub1);
    } else if (answers.relaties_sub1 === 'lichamelijk_geweld') {
      parts.push('geweld');
    }
  } else if (thema === 'school') {
    const sub1 = answers.school_sub1 || answers.ouder_school_sub1;
    if (sub1) parts.push(sub1);
    if (answers.school_sub2 === 'veel') parts.push('veel');
  } else if (thema === 'opvoeding') {
    if (answers.opvoeding_sub1) parts.push(answers.opvoeding_sub1);
    if (answers.opvoeding_sub2) parts.push(answers.opvoeding_sub2);
  } else if (thema === 'verslaving') {
    if (answers.verslaving_sub1) parts.push(answers.verslaving_sub1);
    if (answers.verslaving_sub2 === 'ernstig') parts.push('ernstig');
  }

  const keys = [];
  for (let i = parts.length; i >= 3; i -= 1) {
    keys.push(parts.slice(0, i).join('_'));
  }
  return keys;
}

function resolveServices() {
  if (answers.routeOverride === 'crisis') {
    return { key: 'crisis', serviceIds: DATA.crisis_services.map((s) => s.id).filter((id) => DATA.services.some((sv) => sv.id === id)), isCrisis: true };
  }
  if (answers.routeOverride === 'zelfmoord') {
    const key = answers.voor_wie === 'jongere' ? 'jongere_zelfmoord' : 'volwassene_zelfmoord';
    return { key, serviceIds: DATA.routing[key] || [] };
  }
  if (answers.routeOverride === 'geweld_onveilig') {
    return { key: 'geweld_onveilig', serviceIds: DATA.routing.geweld_onveilig || [] };
  }
  if (answers.routeOverride === 'seksueel_geweld') {
    return { key: 'seksueel_geweld', serviceIds: DATA.routing.seksueel_geweld || [] };
  }
  for (const key of buildCandidateKeys()) {
    if (DATA.routing[key]) return { key, serviceIds: DATA.routing[key] };
  }
  return { key: null, serviceIds: ['huisarts', 'caw', 'tele-onthaal'] };
}

function renderResult() {
  const { key, serviceIds, isCrisis } = resolveServices();

  document.getElementById('questionBox').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';
  document.getElementById('resultTitle').textContent = isCrisis ? 'Directe hulp' : 'Jouw hulplijn';
  document.getElementById('resultSubtitle').textContent = isCrisis
    ? 'Neem meteen contact op met een van deze diensten.'
    : 'Op basis van je antwoorden passen deze diensten het best bij jouw situatie.';

  const services = serviceIds
    .map((id) => DATA.services.find((s) => s.id === id))
    .filter(Boolean);

  const meerInfo = key ? DATA.meer_info[key] : null;

  const planBody = document.getElementById('planBody');
  planBody.innerHTML = `
    ${renderStappenplan(getStappenplan(key), answers)}
    <div class="service-lijst">
      ${services.map((s) => `
        <div class="info-blok contact-blok">
          <h3>${s.name}</h3>
          <p>${s.description}</p>
          <p>Tel: ${s.contact.phone}</p>
          <p><a href="${s.contact.website}" target="_blank" rel="noopener noreferrer">${s.contact.website}</a></p>
        </div>
      `).join('')}
    </div>
    ${meerInfo ? `
      <div class="info-blok">
        <h3>${meerInfo.tekst}</h3>
        <p><a href="${meerInfo.link}" target="_blank" rel="noopener noreferrer">${meerInfo.label}</a></p>
      </div>
    ` : ''}
    <div class="acties">
      <button class="primary" id="restartButton">Opnieuw beginnen</button>
    </div>
  `;

  document.getElementById('restartButton').addEventListener('click', restartFlow);
}

function restartFlow() {
  answers = {};
  showStep('crisis');
}

window.addEventListener('DOMContentLoaded', init);

function getStappenplan(key) {
  if (!DATA || !DATA.stappenplannen) return DATA && DATA.stappenplannen && DATA.stappenplannen.fallback || null;
  return DATA.stappenplannen[key] || DATA.stappenplannen.fallback || null;
}

const VOOR_WIE_LABELS = {
  jongere: 'jezelf als jongere (12-25 jaar)',
  volwassene: 'jezelf als volwassene (25+)',
  ouder: 'je kind (als ouder of verzorger)',
};

const EERDER_HULP_LABELS = {
  laagdrempelig: 'Je zoekt voor het eerst hulp.',
  tussenliggend: 'Je hebt al eerder hulp gezocht (bij huisarts of school).',
  specialist: 'Je wil nu gespecialiseerde hulp.',
};

const THEMA_LABELS = {
  mentaal: 'mentale gezondheid',
  relaties: 'relaties en geweld',
  school: 'school of werk',
  opvoeding: 'opvoeding en gezin',
  verslaving: 'verslaving of financiën',
};

const SUB_LABELS = {
  angst: 'angst of paniekaanvallen',
  depressie: 'somberheid of depressieve gevoelens',
  stress: 'stress of overspannenheid',
  eetstoornis: 'eetstoornissen',
  anders: 'andere mentale klachten',
  relatieproblemen: 'relatieproblemen',
  familie: 'familieconflicten',
  eenzaamheid: 'eenzaamheid',
  lichamelijk_geweld: 'lichamelijk of psychisch geweld',
  pesten: 'pesten of onveilig gevoel',
  leerproblemen: 'leerproblemen of concentratie',
  studiestress: 'studiestress of faalangst',
  werkzoeken: 'werk zoeken of loopbaan',
  baby: 'een kind van 0-3 jaar',
  kind: 'een kind van 3-12 jaar',
  tiener: 'een kind van 12 jaar of ouder',
  gedrag: 'gedrag of emoties',
  ontwikkeling: 'ontwikkeling of school',
  opvoeden: 'hoe op te voeden',
  gezin: 'gezinssituatie (scheiding, stress)',
  drugs: 'drugs of alcohol',
  gokken: 'gokken',
  schulden: 'schulden of financiële problemen',
};

const URGENTIE_LABELS = {
  zeer_urgent: 'De situatie voelt crisis-achtig aan.',
  redelijk_urgent: 'Je maakt je zorgen.',
  niet_urgent: 'Het is niet acuut, maar je wil hulp.',
};

function buildContextStappen(a) {
  const stappen = [];

  if (a.voor_wie) {
    stappen.push(`Je zoekt hulp voor ${VOOR_WIE_LABELS[a.voor_wie] || a.voor_wie}.`);
  }

  if (a.eerder_hulp) {
    stappen.push(EERDER_HULP_LABELS[a.eerder_hulp] || '');
  }

  if (a.thema) {
    const themaLabel = THEMA_LABELS[a.thema] || a.thema;
    const subKey = a.mentaal_sub1 || a.relaties_sub1 || a.school_sub1 || a.ouder_school_sub1 || a.verslaving_sub1;
    const subLabel = subKey ? SUB_LABELS[subKey] || subKey : null;
    if (subLabel) {
      stappen.push(`Je thema is ${themaLabel}, meer specifiek: ${subLabel}.`);
    } else {
      stappen.push(`Je thema is ${themaLabel}.`);
    }
  }

  if (a.urgentie) {
    stappen.push(URGENTIE_LABELS[a.urgentie] || '');
  }

  if (a.opvoeding_sub1 && a.opvoeding_sub2) {
    stappen.push(`Het gaat over ${SUB_LABELS[a.opvoeding_sub1] || a.opvoeding_sub1} en je zorgen zijn rond ${SUB_LABELS[a.opvoeding_sub2] || a.opvoeding_sub2}.`);
  }

  return stappen.filter(Boolean);
}

function renderStappenplan(plan, a = {}) {
  if (!plan) return '';

  const contextStappen = buildContextStappen(a);
  const alleStappen = [...contextStappen, ...plan.stappen];

  const stappenHTML = alleStappen
    .map((s, i) => {
      const isContext = i < contextStappen.length;
      return `<li class="${isContext ? 'stap-context' : 'stap-actie'}"><span class="stap-nummer">${i + 1}</span>${s}</li>`;
    })
    .join('');

  const documentenHTML = plan.documenten && plan.documenten.length
    ? `<div class="documenten-blok">
        <h4>Wat heb je nodig?</h4>
        <ul class="documenten-lijst">${plan.documenten.map(d => `<li>${d}</li>`).join('')}</ul>
       </div>`
    : '';

  return `
    <div class="stappenplan-blok">
      <h3>Jouw stappenplan</h3>
      <p class="stappenplan-intro">${plan.intro}</p>
      <ol class="stappen-lijst">${stappenHTML}</ol>
      ${documentenHTML}
    </div>
  `;
}
