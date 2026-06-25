const questions = [
  {
    id: 'who',
    title: 'Voor wie is de hulpvraag?',
    options: [
      { value: 'mijzelf', label: 'Voor mijzelf' },
      { value: 'kind', label: 'Voor mijn kind of jongere' },
      { value: 'cliënt', label: 'Voor een cliënt of bewoner' }
    ]
  },
  {
    id: 'domain',
    title: 'Waar draait het vooral om?',
    options: [
      { value: 'school', label: 'School of leren' },
      { value: 'zorg', label: 'Zorg of mentale gezondheid' },
      { value: 'thuis', label: 'Thuis, gezin of opvoeding' },
      { value: 'administratie', label: 'Administratie of aanvraag' }
    ]
  },
  {
    id: 'phase',
    title: 'Wat is de huidige stand?',
    options: [
      { value: 'begin', label: 'We beginnen net' },
      { value: 'bezig', label: 'We zijn al bezig' },
      { value: 'vast', label: 'We zitten vast' }
    ]
  }
];

const trajecten = {
  school: [
    {
      id: 'school-gewoon',
      label: 'Gewoon onderwijs met extra ondersteuning',
      beschrijving: 'Je kind blijft in een gewone school, maar krijgt extra hulp via het leersteuncentrum en het CLB.',
      stappen: [
        { tekst: 'Contacteer het CLB via de school en vraag een gesprek aan', gedaan: false },
        { tekst: 'Bespreek welke redelijke aanpassingen de school kan bieden', gedaan: false },
        { tekst: 'Vraag het CLB een GC-verslag op te maken (verslag voor leersteun)', gedaan: false },
        { tekst: 'Zoek een leersteuncentrum dat aan de school verbonden is', gedaan: false },
        { tekst: 'Plan een zorgoverleg met school, CLB en ouders samen', gedaan: false }
      ],
      documenten: ['Diagnoseverslagje of attest', 'Schoolrapport', 'GC-verslag van het CLB'],
      contact: { naam: 'CLB', tel: 'Via de school', website: 'https://www.clbchat.be' }
    },
    {
      id: 'school-buo',
      label: 'Buitengewoon onderwijs type 9 (ASS)',
      beschrijving: 'Je kind gaat naar een school voor buitengewoon onderwijs type 9, speciaal voor leerlingen met autisme.',
      stappen: [
        { tekst: 'Contacteer het CLB en vraag een IAC-verslag aan (inschrijvingsverslag voor buitengewoon onderwijs)', gedaan: false },
        { tekst: 'Zoek type 9-scholen in jouw regio op via www.schooldirect.be', gedaan: false },
        { tekst: 'Plan een oriëntatiegesprek bij een type 9-school', gedaan: false },
        { tekst: 'Bespreek het traject en de verwachtingen met school en CLB', gedaan: false },
        { tekst: 'Schrijf je kind in en plan een startgesprek', gedaan: false }
      ],
      documenten: ['Diagnoseverslagje of attest van ASS', 'IAC-verslag van het CLB', 'Schoolrapport'],
      contact: { naam: 'CLB', tel: 'Via de school', website: 'https://www.schooldirect.be' }
    }
  ],
  zorg: [
    {
      id: 'zorg-huisarts',
      label: 'Starten via de huisarts',
      beschrijving: 'De huisarts is je eerste aanspreekpunt. Hij of zij kan luisteren, beoordelen en doorverwijzen naar de juiste hulp.',
      stappen: [
        { tekst: 'Maak een afspraak bij de huisarts en benoem je zorgen', gedaan: false },
        { tekst: 'Schrijf vooraf op wat je ervaart, wanneer het speelt en wat je al hebt geprobeerd', gedaan: false },
        { tekst: 'Vraag de huisarts om een doorverwijzing naar een psycholoog of CGG', gedaan: false },
        { tekst: 'Vraag naar de wachttijd en of er een tijdelijke tussenoplossing is', gedaan: false }
      ],
      documenten: ['Korte beschrijving van de klachten', 'Eventueel eerdere verslagen of attesten'],
      contact: { naam: 'Huisarts', tel: 'Je eigen praktijk', website: 'https://www.huisartsenvlaanderen.be' }
    },
    {
      id: 'zorg-cgg',
      label: 'Rechtstreeks naar het CGG (geestelijke gezondheidszorg)',
      beschrijving: 'Het Centrum voor Geestelijke Gezondheidszorg biedt gespecialiseerde begeleiding bij psychische problemen.',
      stappen: [
        { tekst: 'Zoek het CGG in jouw regio op via de website', gedaan: false },
        { tekst: 'Bel of mail voor een intakegesprek', gedaan: false },
        { tekst: 'Beschrijf kort de situatie bij de eerste contactname', gedaan: false },
        { tekst: 'Vraag naar de wachttijd en mogelijke alternatieven in de tussentijd', gedaan: false },
        { tekst: 'Ga naar het intakegesprek en vraag om een behandelplan', gedaan: false }
      ],
      documenten: ['Verwijsbrief van huisarts (niet verplicht maar handig)', 'Eerdere diagnoses of verslagen'],
      contact: { naam: 'CGG', tel: 'Via je regio', website: 'https://www.vgc.be/geestelijke-gezondheid' }
    }
  ],
  thuis: [
    {
      id: 'thuis-caw',
      label: 'Ondersteuning via CAW',
      beschrijving: 'Het CAW helpt gratis bij problemen thuis: relaties, opvoeding, geweld of stress. Voor iedereen.',
      stappen: [
        { tekst: 'Bel of mail het CAW voor een eerste gesprek (078 15 15 15)', gedaan: false },
        { tekst: 'Leg kort uit wat er thuis speelt', gedaan: false },
        { tekst: 'Vraag naar begeleiding op maat voor gezin of opvoeding', gedaan: false },
        { tekst: 'Bespreek of ook andere hulpverleners betrokken moeten worden', gedaan: false }
      ],
      documenten: ['Korte beschrijving van de thuissituatie'],
      contact: { naam: 'CAW', tel: '078 15 15 15', website: 'https://www.caw.be' }
    },
    {
      id: 'thuis-ocmw',
      label: 'Praktische hulp via OCMW',
      beschrijving: 'Het OCMW helpt bij financiële problemen, schulden, sociale begeleiding en leefloon.',
      stappen: [
        { tekst: 'Ga naar het OCMW van je gemeente of maak een afspraak', gedaan: false },
        { tekst: 'Neem je identiteitskaart en een overzicht van je financiële situatie mee', gedaan: false },
        { tekst: 'Vraag welke steun of begeleiding voor jou beschikbaar is', gedaan: false },
        { tekst: 'Vul de nodige formulieren in en volg de aanvraag op', gedaan: false }
      ],
      documenten: ['Identiteitskaart', 'Overzicht inkomsten en uitgaven', 'Eventuele schuldbrieven'],
      contact: { naam: 'OCMW', tel: 'Via je gemeente', website: 'https://www.vlaanderen.be/ocmw' }
    }
  ],
  administratie: [
    {
      id: 'admin-vaph',
      label: 'Aanvraag via VAPH (handicap of beperking)',
      beschrijving: 'Het VAPH helpt personen met een beperking aan budget, begeleiding en hulpmiddelen.',
      stappen: [
        { tekst: 'Ga naar www.vaph.be en lees de informatie over aanvragen', gedaan: false },
        { tekst: 'Vraag een multidisciplinair verslag (MDV) op bij een erkend team', gedaan: false },
        { tekst: 'Dien een aanvraag in bij het VAPH met het MDV', gedaan: false },
        { tekst: 'Wacht op de beslissing en vraag bij onduidelijkheid om toelichting', gedaan: false },
        { tekst: 'Kies een vergunde zorgaanbieder als de aanvraag goedgekeurd is', gedaan: false }
      ],
      documenten: ['Multidisciplinair verslag (MDV)', 'Identiteitskaart', 'Diagnoseverslagje'],
      contact: { naam: 'VAPH', tel: '078 35 04 00', website: 'https://www.vaph.be' }
    },
    {
      id: 'admin-ocmw',
      label: 'Financiële of sociale aanvraag via OCMW',
      beschrijving: 'Het OCMW helpt bij leefloon, schuldhulp en sociale aanvragen in jouw gemeente.',
      stappen: [
        { tekst: 'Maak een afspraak bij het OCMW van je gemeente', gedaan: false },
        { tekst: 'Neem je identiteitskaart en bewijsstukken mee', gedaan: false },
        { tekst: 'Vraag welke aanvragen of steun beschikbaar zijn voor jou', gedaan: false },
        { tekst: 'Dien de aanvraag in en noteer de referentie en datum', gedaan: false }
      ],
      documenten: ['Identiteitskaart', 'Bewijsstukken van situatie (rekeningen, brieven)', 'Attest als van toepassing'],
      contact: { naam: 'OCMW', tel: 'Via je gemeente', website: 'https://www.vlaanderen.be/ocmw' }
    }
  ]
};

let currentQuestionIndex = 0;
let answers = {};
let gekozenPad = null;

function renderQuestion() {
  const question = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  document.getElementById('questionBox').style.display = 'block';
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('progressFill').style.width = `${progressPercent}%`;
  document.getElementById('progressText').textContent = `Vraag ${currentQuestionIndex + 1} van ${questions.length}`;
  document.getElementById('questionTitle').textContent = question.title;

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  question.options.forEach((option) => {
    const button = document.createElement('button');
    button.className = 'option-button';
    button.textContent = option.label;
    button.addEventListener('click', () => {
      answers[question.id] = option.value;
      goToNextQuestion();
    });
    optionsContainer.appendChild(button);
  });
}

function goToNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex += 1;
    renderQuestion();
    return;
  }
  renderPadKeuze();
}

function renderPadKeuze() {
  const domain = answers.domain || 'school';
  const paden = trajecten[domain] || trajecten.school;

  document.getElementById('questionBox').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';
  document.getElementById('resultTitle').textContent = 'Kies jouw traject';
  document.getElementById('resultSubtitle').textContent = 'Op basis van jouw situatie zijn er twee mogelijke paden. Kies het pad dat het beste bij jou past.';

  const planBody = document.getElementById('planBody');
  planBody.innerHTML = `
    <div class="pad-keuze">
      ${paden.map((pad) => `
        <div class="pad-kaart" data-pad-id="${pad.id}">
          <h3>${pad.label}</h3>
          <p>${pad.beschrijving}</p>
          <button class="primary kies-pad-btn" data-pad-id="${pad.id}">Dit pad kiezen</button>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.kies-pad-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const padId = btn.getAttribute('data-pad-id');
      const pad = paden.find((p) => p.id === padId);
      gekozenPad = pad;
      renderTraject(pad);
    });
  });
}

function renderTraject(pad) {
  document.getElementById('resultTitle').textContent = pad.label;
  document.getElementById('resultSubtitle').textContent = pad.beschrijving;

  const planBody = document.getElementById('planBody');
  planBody.innerHTML = `
    <div class="traject-wrap">
      <div class="sectie-titel">Jouw stappen</div>
      <ul class="stap-lijst" id="stapLijst">
        ${pad.stappen.map((stap, i) => `
          <li class="stap-item${stap.gedaan ? ' gedaan' : ''}" data-index="${i}">
            <button class="stap-check" aria-label="Stap afvinken" data-index="${i}">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                <circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5"/>
                <path class="vink" d="M5.5 10l3 3 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <span class="stap-tekst">${stap.tekst}</span>
          </li>
        `).join('')}
      </ul>

      <div class="info-blok">
        <h3>Welke documenten heb je nodig?</h3>
        <ul class="doc-lijst">
          ${pad.documenten.map((doc) => `<li>${doc}</li>`).join('')}
        </ul>
      </div>

      <div class="info-blok contact-blok">
        <h3>Eerste contact</h3>
        <p><strong>${pad.contact.naam}</strong></p>
        <p>Tel: ${pad.contact.tel}</p>
        <p><a href="${pad.contact.website}" target="_blank" rel="noopener noreferrer">${pad.contact.website}</a></p>
      </div>

      <div class="acties">
        <button class="secondary" id="andereKeuzeBtn">Ander pad kiezen</button>
        <button class="primary" id="restartButton">Opnieuw beginnen</button>
      </div>
    </div>
  `;

  document.querySelectorAll('.stap-check').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.getAttribute('data-index'));
      gekozenPad.stappen[index].gedaan = !gekozenPad.stappen[index].gedaan;
      const item = document.querySelector(`.stap-item[data-index="${index}"]`);
      item.classList.toggle('gedaan', gekozenPad.stappen[index].gedaan);
    });
  });

  document.getElementById('andereKeuzeBtn').addEventListener('click', () => renderPadKeuze());
  document.getElementById('restartButton').addEventListener('click', restartFlow);
}

function restartFlow() {
  currentQuestionIndex = 0;
  answers = {};
  gekozenPad = null;
  renderQuestion();
}

window.addEventListener('DOMContentLoaded', () => {
  renderQuestion();
});
