let DATA = null;
let answers = {};

async function init() {
  DATA = await fetch('data.json').then((r) => r.json());
  renderCrisisBanner();
  showStep('voor_wie');
}

function renderCrisisBanner() {
  const el = document.getElementById('crisisBanner');
  if (!el || !DATA.crisis_info) return;
  el.innerHTML = `
    <strong>${DATA.crisis_info.title}</strong>
    <div class="crisis-items">
      ${DATA.crisis_info.services.map((s) => `<span>${s.name} - ${s.description}</span>`).join('')}
    </div>
    <button type="button" class="crisis-direct-btn" id="crisisDirectBtn">Ik heb nu direct gevaar — toon spoedhulp</button>
  `;
  document.getElementById('crisisDirectBtn').addEventListener('click', () => {
    answers.routeOverride = 'crisis';
    showStep('result');
  });
}

function showStep(stepId) {
  if (stepId === 'result') return renderResult();
  renderGenericQuestion(stepId);
}

function getQuestionDef(stepId) {
  if (stepId === 'ouder_school_sub1') return DATA.questions.ouder_school_sub1;
  return DATA.questions[stepId];
}

const STEP_ORDER = ['voor_wie', 'thema'];

function renderGenericQuestion(stepId) {
  const q = getQuestionDef(stepId);
  if (!q) return showStep('result');

  document.getElementById('questionBox').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';

  const stepIndex = STEP_ORDER.indexOf(stepId);
  if (stepIndex >= 0) {
    document.getElementById('progressText').textContent = `Vraag ${stepIndex + 1}`;
    document.getElementById('progressFill').style.width = `${((stepIndex + 1) / 5) * 100}%`;
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
      if (value === 'angst' || value === 'depressie') return showStep('result');
      if (value === 'anders') return showStep('mentaal_sub2');
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
      return showStep('result');
    default:
      return showStep('result');
  }
}

function buildCandidateKeys() {
  const { voor_wie, thema } = answers;
  const parts = [voor_wie, thema];

  if (thema === 'mentaal') {
    if (answers.mentaal_sub1 === 'angst' || answers.mentaal_sub1 === 'depressie') {
      parts.push(answers.mentaal_sub1);
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
  }

  const keys = [];
  for (let i = parts.length; i >= 2; i -= 1) {
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

function getServiceMeta(serviceId) {
  return (DATA.service_meta && DATA.service_meta[serviceId]) || {};
}

function getContactType(typeKey) {
  return (DATA.contact_types && DATA.contact_types[typeKey]) || DATA.contact_types.afspraak;
}

function renderResult() {
  const { key, serviceIds, isCrisis } = resolveServices();

  document.getElementById('questionBox').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';
  document.getElementById('resultTitle').textContent = isCrisis ? 'Directe hulp' : 'Jouw zorgplan';
  document.getElementById('resultSubtitle').textContent = isCrisis
    ? 'Neem meteen contact op. Hieronder zie je wat je kan verwachten en wie je kan bellen.'
    : 'Op basis van je antwoorden: wat je kan verwachten, wat je meeneemt, en waar je start.';

  const services = serviceIds
    .map((id) => DATA.services.find((s) => s.id === id))
    .filter(Boolean);

  const plan = getStappenplan(key);
  const primaryService = services[0];
  const primaryType = primaryService
    ? getContactType(getServiceMeta(primaryService.id).contact_type || 'afspraak')
    : getContactType('afspraak');
  const meerInfo = key ? DATA.meer_info[key] : null;

  const planBody = document.getElementById('planBody');
  planBody.innerHTML = `
    ${renderSituatieSamenvatting()}
    ${renderVerwachtingBlok(primaryType, primaryService, isCrisis)}
    ${renderStappenplan(plan, answers)}
    ${renderMeenemenBlok(plan, primaryType, services)}
    ${renderDienstenSectie(services, isCrisis)}
    ${renderVervolgoptiesBlok(plan, services, isCrisis)}
    ${meerInfo ? renderMeerInfo(meerInfo) : ''}
    <div class="acties">
      <button class="primary" id="restartButton">Opnieuw beginnen</button>
    </div>
  `;

  bindStapCheckboxes();
  document.getElementById('restartButton').addEventListener('click', restartFlow);
}

function renderSituatieSamenvatting() {
  const stappen = buildContextStappen(answers);
  if (!stappen.length) return '';

  return `
    <div class="result-sectie">
      <p class="sectie-titel">Jouw situatie</p>
      <div class="situatie-blok">
        <ul class="situatie-lijst">
          ${stappen.map((s) => `<li>${s}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderVerwachtingBlok(contactType, primaryService, isCrisis) {
  const meta = primaryService ? getServiceMeta(primaryService.id) : {};
  const verwachting = meta.verwachting || contactType.verwachting;
  const verloop = contactType.verloop || [];

  return `
    <div class="result-sectie">
      <p class="sectie-titel">Wat je kan verwachten</p>
      <div class="verwachting-blok">
        ${primaryService ? `
          <div class="verwachting-header">
            <span class="type-badge">${contactType.label}</span>
            ${meta.rol ? `<span class="rol-tekst">${meta.rol}</span>` : ''}
          </div>
        ` : ''}
        <p class="verwachting-tekst">${verwachting}</p>
        ${verloop.length ? `
          <div class="verloop-stappen">
            <p class="verloop-label">Typisch verloop:</p>
            <ol class="verloop-lijst">
              ${verloop.map((stap) => `<li>${stap}</li>`).join('')}
            </ol>
          </div>
        ` : ''}
        ${contactType.kosten ? `<p class="kosten-tekst"><strong>Kosten:</strong> ${contactType.kosten}</p>` : ''}
        ${isCrisis ? '<p class="crisis-noot">Bij onmiddellijk levensgevaar: bel <strong>112</strong>.</p>' : ''}
      </div>
    </div>
  `;
}

function renderMeenemenBlok(plan, contactType, services) {
  const planDocs = (plan && plan.documenten) || [];
  const typeDocs = contactType.meenemen || [];
  const allDocs = [...new Set([...planDocs, ...typeDocs])];

  if (!allDocs.length) return '';

  return `
    <div class="result-sectie">
      <p class="sectie-titel">Wat neem je mee?</p>
      <div class="info-blok meenemen-blok">
        <p class="meenemen-intro">Voor je eerste contact — niets moet perfect, maar dit helpt:</p>
        <ul class="doc-lijst">
          ${allDocs.map((d) => `<li>${d}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderDienstenSectie(services, isCrisis) {
  if (!services.length) return '';

  return `
    <div class="result-sectie">
      <p class="sectie-titel">${isCrisis ? 'Bel direct' : 'Waar start je?'}</p>
      <p class="sectie-uitleg">${isCrisis
        ? 'Deze nummers zijn 24/7 bereikbaar. Je hoeft je naam niet te geven.'
        : 'Begin bij de bovenste dienst. Past die niet? Probeer de volgende — elke dienst is een andere ingang.'}</p>
      <div class="dienst-lijst">
        ${services.map((s, i) => renderDienstKaart(s, i, isCrisis)).join('')}
      </div>
    </div>
  `;
}

function renderDienstKaart(service, index, isCrisis) {
  const meta = getServiceMeta(service.id);
  const type = getContactType(meta.contact_type || 'afspraak');
  const isPrimary = index === 0;
  const badge = isCrisis
    ? 'Spoed'
    : isPrimary
      ? 'Start hier'
      : `Alternatief ${index}`;

  return `
    <div class="dienst-kaart ${isPrimary ? 'dienst-kaart-primary' : ''}">
      <div class="dienst-kaart-header">
        <span class="dienst-badge ${isPrimary ? 'dienst-badge-primary' : ''}">${badge}</span>
        <span class="type-badge type-badge-klein">${type.label}</span>
      </div>
      <h3>${service.name}</h3>
      <p class="dienst-beschrijving">${service.description}</p>
      ${meta.rol ? `<p class="dienst-rol">${meta.rol}</p>` : ''}
      <div class="dienst-contact">
        <p><strong>Telefoon:</strong> ${service.contact.phone}</p>
        ${service.contact.email && service.contact.email !== 'Via website' ? `<p><strong>E-mail:</strong> ${service.contact.email}</p>` : ''}
        <p><a href="${service.contact.website}" target="_blank" rel="noopener noreferrer">Website bezoeken →</a></p>
      </div>
    </div>
  `;
}

function renderVervolgoptiesBlok(plan, services, isCrisis) {
  const opties = (plan && plan.vervolgopties) || (DATA.stappenplannen.fallback && DATA.stappenplannen.fallback.vervolgopties) || [];
  const alternatiefNamen = services.slice(1, 3).map((s) => s.name);

  let extraOpties = [];
  if (alternatiefNamen.length && !isCrisis) {
    extraOpties.push(`Alternatief: probeer ${alternatiefNamen.join(' of ')} als de eerste dienst niet past.`);
  }

  const alleOpties = [...opties, ...extraOpties];
  if (!alleOpties.length) return '';

  return `
    <div class="result-sectie">
      <p class="sectie-titel">Als dit niet helpt — wat nu?</p>
      <div class="vervolg-blok">
        <p class="vervolg-intro">Je bent niet aangewezen op één dienst. Dit zijn je opties als de eerste stap niet werkt:</p>
        <ul class="vervolg-lijst">
          ${alleOpties.map((o) => `<li>${o}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function renderMeerInfo(meerInfo) {
  return `
    <div class="result-sectie">
      <p class="sectie-titel">Meer lezen</p>
      <div class="info-blok">
        <p>${meerInfo.tekst}</p>
        <p><a href="${meerInfo.link}" target="_blank" rel="noopener noreferrer">${meerInfo.label} →</a></p>
      </div>
    </div>
  `;
}

function bindStapCheckboxes() {
  document.querySelectorAll('.stap-check').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.stap-item');
      if (item) item.classList.toggle('gedaan');
    });
  });
}

function restartFlow() {
  answers = {};
  showStep('voor_wie');
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

function buildContextStappen(a) {
  const stappen = [];

  if (a.voor_wie) {
    stappen.push(`Je zoekt hulp voor ${VOOR_WIE_LABELS[a.voor_wie] || a.voor_wie}.`);
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

  if (a.opvoeding_sub1 && a.opvoeding_sub2) {
    stappen.push(`Het gaat over ${SUB_LABELS[a.opvoeding_sub1] || a.opvoeding_sub1} en je zorgen zijn rond ${SUB_LABELS[a.opvoeding_sub2] || a.opvoeding_sub2}.`);
  }

  return stappen.filter(Boolean);
}

function renderStappenplan(plan, a = {}) {
  if (!plan) return '';

  const actieStappen = plan.stappen || [];
  if (!actieStappen.length) return '';

  const stappenHTML = actieStappen
    .map((s, i) => `
      <li class="stap-item">
        <button class="stap-check" type="button" aria-label="Stap ${i + 1} afvinken">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
            <path d="M6 10l3 3 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="stap-tekst">${s}</span>
      </li>
    `)
    .join('');

  return `
    <div class="result-sectie">
      <p class="sectie-titel">Jouw stappenplan</p>
      <div class="stappenplan-blok">
        <p class="stappenplan-intro">${plan.intro}</p>
        <ul class="stap-lijst">${stappenHTML}</ul>
        <p class="stappen-tip">Vink stappen af terwijl je ze zet — zo houd je overzicht.</p>
      </div>
    </div>
  `;
}
