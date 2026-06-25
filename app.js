const questions = [
  {
    id: 'who',
    title: 'Voor wie is de hulpvraag?',
    options: [
      { value: 'mijzelf', label: 'Voor mijzelf' },
      { value: 'kind', label: 'Voor mijn kind of jongere' },
      { value: 'cliënt', label: 'Voor een client of bewoner' }
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
    id: 'extra',
    title: 'Is er ook een tweede thema dat mee speelt?',
    options: [
      { value: 'geen', label: 'Nee, alleen dit' },
      { value: 'thuis', label: 'Ja, ook thuis of gezin' },
      { value: 'mentaal', label: 'Ja, ook mentale gezondheid' },
      { value: 'administratie', label: 'Ja, ook administratie' }
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

const planTemplates = {
  school: {
    title: 'School en onderwijs',
    intro: 'Bij schoolproblemen of een zorgvraag op school is het CLB vaak het eerste praktische aanspreekpunt. Het CLB helpt gratis bij leren, schoolloopbaan, gezondheid en psychosociaal functioneren.',
    firstService: 'CLB',
    firstRole: 'Eerste aanspreekpunt',
    firstAction: 'Neem contact op met de school of het CLB en vraag een gesprek of intake aan. Als je het zelf wilt doen, kan je het CLB ook rechtstreeks contacteren.',
    firstContact: 'Via het schoolsecretariaat, de leerkracht of de CLB-lijst in jouw gemeente of onderwijsaanbod',
    firstHow: 'Het CLB luistert naar de vraag, bespreekt de situatie met school en ouders en kan samen met jou kijken naar hulp, begeleiding of een doorverwijzing.',
    secondService: 'Schoolteam of zorgcoördinator',
    secondRole: 'Praktische ondersteuning op school',
    secondAction: 'Vraag of het schoolteam, de zorgcoördinator of een leerlingbegeleider een eerste stap kan zetten, zoals extra begeleiding of een opvolgafspraak.',
    secondContact: 'Via de school of de zorgcoördinator',
    steps: [
      'Bespreek de situatie met de leerkracht, de zorgcoördinator of de school.',
      'Vraag een afspraak met het CLB of een intake op school.',
      'Verzamel schoolrapporten, observaties, aantekeningen over het probleem en een korte uitleg van de situatie.',
      'Vraag welke ondersteuning er direct mogelijk is en of het CLB je kan doorverwijzen naar extra hulp als dat nodig is.'
    ],
    documents: ['Schoolrapport of observaties', 'Korte samenvatting van de situatie', 'Contactgegevens van de school of leerkracht'],
    forms: ['Intakeformulier van de school of het CLB', 'Toestemming om informatie te delen met school en ouders'],
    waiting: 'De wachttijd kan verschillen. Vraag altijd naar een eerste afspraak, een voorlopige check of een alternatieve hulpvorm als er direct iets nodig is.',
    timeline: ['Contact opnemen met school of CLB', 'Intake of gesprek', 'Documenten en informatie delen', 'Volgende stap of doorverwijzing'],
    sourceNote: 'Gebaseerd op informatie van Vlaanderen.be over het CLB: het CLB helpt gratis bij leren, schoolloopbaan, gezondheid en psychosociaal functioneren en werkt op verzoek van leerling, ouders of school.'
  },
  zorg: {
    title: 'Zorg en mentale gezondheid',
    intro: 'Een huisarts of een eerste hulpdienst is vaak het beste startpunt.',
    firstService: 'Huisarts of huisartspraktijk',
    firstRole: 'Eerste hulpverlener',
    firstAction: 'Maak een afspraak met de huisarts en vertel dat je hulp zoekt voor mentale gezondheid of welzijn.',
    firstContact: 'Via de huisartspraktijk',
    firstHow: 'De huisarts luistert, beoordeelt de situatie en kan doorverwijzen naar gespecialiseerde hulp.',
    secondService: 'CAW of gespecialiseerde hulp',
    secondRole: 'Extra ondersteuning of specialistische hulp',
    secondAction: 'Als er meer begeleiding nodig is, vraag naar een afspraak bij CAW of een gespecialiseerde dienst.',
    secondContact: 'Telefoon of website van CAW of de betreffende dienst',
    steps: [
      'Neem contact op met de huisarts.',
      'Vraag om een intake of een eerste consult.',
      'Noteer wat je ervaart, welke zorgen er zijn en wat je al hebt geprobeerd.',
      'Vraag naar wachttijd, doorverwijzing en welke documenten nodig zijn.'
    ],
    documents: ['Contactgegevens', 'Korte beschrijving van de situatie', 'Eerdere rapporten of verslagen'],
    forms: ['Aanvraag voor intake of consult', 'Toestemming voor gegevensuitwisseling'],
    waiting: 'Voor specialistische hulp kan de wachttijd langer zijn. Vraag naar een tussenoplossing of een voorlopige afspraak.',
    timeline: ['Contact maken', 'Eerste consult', 'Documenten delen', 'Doorverwijzing of wachttijd']
  },
  thuis: {
    title: 'Thuis, gezin of opvoeding',
    intro: 'Bij problemen thuis of in het gezin is een lokale dienst of een gezinsdienst vaak een goed startpunt.',
    firstService: 'Lokale dienst of gezinsondersteuning',
    firstRole: 'Eerste hulpverlener',
    firstAction: 'Neem contact op met een lokale dienst of gezinsondersteuning en vraag om een eerste gesprek.',
    firstContact: 'Via de lokale dienst of het OCMW',
    firstHow: 'De dienst bespreekt de situatie, kijkt naar wat nodig is en kan ondersteuning of doorverwijzing bieden.',
    secondService: 'CAW of welzijnswerk',
    secondRole: 'Extra ondersteuning bij stress, relaties of gezin',
    secondAction: 'Als de situatie complex is, vraag ook naar CAW of welzijnswerk.',
    secondContact: 'Telefoon of website van CAW of welzijnswerk',
    steps: [
      'Bespreek de situatie met een lokale dienst.',
      'Vraag welke ondersteuning thuis of in het gezin mogelijk is.',
      'Maak een korte lijst van wat er al is geprobeerd.',
      'Vraag welke documenten of formulieren nodig zijn voor de intake.'
    ],
    documents: ['Korte omschrijving van de situatie', 'Contactgegevens van betrokken personen', 'Notities over eerdere hulp'],
    forms: ['Intakeformulier', 'Toestemming om informatie te delen'],
    waiting: 'Soms is er een wachttijd. Vraag altijd of er een eerste gesprek of tijdelijke ondersteuning mogelijk is.',
    timeline: ['Contact opnemen', 'Eerste gesprek', 'Documenten klaarzetten', 'Ondersteuning of wachttijd']
  },
  administratie: {
    title: 'Administratie of aanvraag',
    intro: 'Bij administratieve vragen is een sociale dienst of een lokale ondersteuning vaak het juiste startpunt.',
    firstService: 'OCMW of sociale dienst',
    firstRole: 'Eerste hulpverlener',
    firstAction: 'Neem contact op met het OCMW of de sociale dienst en vraag welke aanvraag of erkenning nodig is.',
    firstContact: 'Via de gemeente of lokale sociale dienst',
    firstHow: 'De sociale dienst legt uit welke formulieren er nodig zijn, welke documenten je moet meenemen en hoe je een aanvraag start.',
    secondService: 'CAW of lokale dienst',
    secondRole: 'Ondersteuning bij complexere of meerdere aanvragen',
    secondAction: 'Als het traject complex wordt, vraag om extra ondersteuning bij CAW of een lokale dienst.',
    secondContact: 'Telefoon of website van CAW of lokale dienst',
    steps: [
      'Check welke aanvraag of erkenning nodig is.',
      'Vraag welke documenten en formulieren nodig zijn.',
      'Vraag een afspraak of een eerste check aan.',
      'Volg de aanvraag op en noteer wat nog openstaat.'
    ],
    documents: ['Identiteitsgegevens', 'Attesten of rapporten', 'Lijst met benodigde formulieren'],
    forms: ['Aanvraagformulier', 'Documentenchecklist'],
    waiting: 'Bij aanvragen kan de wachttijd verschillen. Vraag naar de status, de procedure en of er een tussentijdse update mogelijk is.',
    timeline: ['Aanvraag checken', 'Formulieren ophalen', 'Documenten indienen', 'Status volgen']
  }
};

const extraLabels = {
  geen: 'Geen extra thema',
  thuis: 'Ook thuis of gezin',
  mentaal: 'Ook mentale gezondheid',
  administratie: 'Ook administratie of aanvraag'
};

let currentQuestionIndex = 0;
let answers = {};

function getPersonalizedPlan(selectedAnswers) {
  const domain = selectedAnswers.domain || 'school';
  const plan = JSON.parse(JSON.stringify(planTemplates[domain] || planTemplates.school));
  const who = selectedAnswers.who || 'mijzelf';
  const extra = selectedAnswers.extra || 'geen';
  const phase = selectedAnswers.phase || 'begin';

  const phaseLabel = phase === 'vast' ? 'We zitten vast' : phase === 'bezig' ? 'We zijn al bezig' : 'We beginnen net';
  const whoLabel = who === 'kind' ? 'voor jouw kind of jongere' : who === 'cliënt' ? 'voor een client of bewoner' : 'voor jouzelf';

  let intro = plan.intro;
  let firstAction = plan.firstAction;
  let secondAction = plan.secondAction;
  let steps = [...plan.steps];
  let documents = [...plan.documents];
  let forms = [...plan.forms];
  let timeline = [...plan.timeline];

  if (who === 'kind') {
    intro += ' Omdat je een kind of jongere ondersteunt, is het handig om de situatie helder te beschrijven en samen met school of het CLB op te volgen.';
    steps.unshift('Noteer in één kort overzicht wat je ziet, wanneer het probleem optreedt en wat je al hebt geprobeerd.');
    documents.unshift('Overzicht van wat je hebt opgemerkt bij je kind');
  } else if (who === 'cliënt') {
    intro += ' Omdat je een client of bewoner ondersteunt, helpt het om de hulpvraag concreet te formuleren en de relevante stappen te volgen.';
    steps.unshift('Beschrijf de hulpvraag in heldere woorden, zodat de eerste contactpersoon direct begrijpt wat nodig is.');
  }

  if (phase === 'begin') {
    intro += ' Je staat nog aan het begin, dus de eersteprioriteit is om de juiste hulpverlener te bereiken en een eerste afspraak te regelen.';
    firstAction = `${firstAction} Begin met één korte aanvraag of afspraak, zodat er direct een eerste gesprek kan komen.`;
    steps = [
      'Maak een eerste contact met de school, het CLB of de juiste hulpverlener.',
      'Leg kort uit wat er speelt en wat je als eerste wilt bereiken.',
      'Vraag of er direct een intake of kennismaking mogelijk is.',
      'Vraag ook welke documenten of informatie de hulpverlener wil ontvangen.'
    ];
    timeline = ['Eerste contact', 'Korte intake', 'Documenten delen', 'Volgende stap bepalen'];
  } else if (phase === 'bezig') {
    intro += ' Je bent al aan de slag, dus het doel is nu om de voortgang te borgen en te checken of de huidige ondersteuning voldoende is.';
    firstAction = `${firstAction} Gebruik het bestaande contact en vraag of de hulpverlener de huidige aanpak kan evalueren.`;
    secondAction = `${secondAction} Als de situatie nog niet duidelijk is, vraag om een terugkommoment of extra begeleiding.`;
    steps = [
      'Bekijk wat er al is gedaan en welke afspraken er zijn.',
      'Vraag aan de hulpverlener of de aanpak nog passend is.',
      'Noteer wat goed werkt en waar het nog stroef gaat.',
      'Vraag of er een volgende afspraak of extra ondersteuning nodig is.'
    ];
    timeline = ['Huidige aanpak checken', 'Beoordelen wat werkt', 'Extra ondersteuning of afspraak', 'Volgende stap bepalen'];
  } else if (phase === 'vast') {
    intro += ' Je zit nu vast, dus het plan moet gericht zijn op een volgende stap, een doorverwijzing of een alternatief.';
    firstAction = `${firstAction} Vraag expliciet naar een volgende stap, een doorverwijzing of een alternatieve aanpak als de huidige route niet verder helpt.`;
    secondAction = `${secondAction} Vraag of er een andere hulpverlener of een extra ondersteuningstraject mogelijk is.`;
    steps = [
      'Benoem waar je precies vastloopt en wat er tot nu toe is geprobeerd.',
      'Vraag om een concrete volgende stap of een doorverwijzing.',
      'Bespreek of er een alternatieve hulpvorm of tijdelijk plan nodig is.',
      'Laat duidelijk weten welke vraag nu het belangrijkst is.'
    ];
    timeline = ['Probleem helder maken', 'Doorverwijzing of alternatief', 'Nieuwe afspraak', 'Evaluatie van de volgende stap'];
  }

  if (extra === 'thuis') {
    intro += ' Omdat thuis of gezin ook een rol spelen, is het verstandig om dat mee te nemen in het gesprek.';
    steps.push('Vraag of de hulpverlener ook kijkt naar de situatie thuis of in het gezin.');
    documents.push('Korte beschrijving van wat thuis of in het gezin speelt');
  } else if (extra === 'mentaal') {
    intro += ' Omdat mentale gezondheid ook meespeelt, is het logisch om die kant in het gesprek mee te nemen.';
    steps.push('Vraag of de hulpverlener ook kijkt naar stress, angst, gevoelens of mentale belasting.');
    documents.push('Korte beschrijving van stress, angst of andere mentale signalen');
  } else if (extra === 'administratie') {
    intro += ' Omdat administratie of een aanvraag ook meedoet, is het handig om die verplichtingen of formulieren direct mee te nemen.';
    steps.push('Vraag of de hulpverlener of dienst ook helpt met de benodigde formulieren of aanvraagstukken.');
    forms.push('Checklijst van benodigde documenten voor de aanvraag');
  }

  return {
    ...plan,
    intro,
    firstAction,
    secondAction,
    steps,
    documents,
    forms,
    timeline,
    phaseLabel,
    whoLabel,
    summaryLine: `${plan.title} · ${phaseLabel} · ${whoLabel}`
  };
}

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

  renderResult();
}

function renderResult() {
  const plan = getPersonalizedPlan(answers);
  const extra = answers.extra || 'geen';

  document.getElementById('questionBox').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';
  document.getElementById('resultTitle').textContent = 'Jouw persoonlijk plan';
  document.getElementById('resultSubtitle').textContent = `We hebben een concreet traject gemaakt voor ${plan.title.toLowerCase()} op basis van jouw situatie.`;

  const planBody = document.getElementById('planBody');
  planBody.innerHTML = `
    <div class="plan-summary">
      <div class="pill">${plan.title}</div>
      <p>${plan.intro}</p>
      <p><strong>Jouw situatie:</strong> ${plan.summaryLine}</p>
      <p><strong>Extra thema:</strong> ${extraLabels[extra] || extraLabels.geen}</p>
      <p><strong>Volgende stap:</strong> ${plan.firstAction}</p>
    </div>

    ${plan.sourceNote ? `
      <div class="info-block source-block">
        <h3>Bron en uitgangspunt</h3>
        <p>${plan.sourceNote}</p>
      </div>
    ` : ''}

    <div class="section-title">Wat moet je doen?</div>
    <ol class="step-list">
      ${plan.steps.map((step) => `<li class="step-item">${step}</li>`).join('')}
    </ol>

    <div class="card-grid">
      <div class="service-card">
        <h3>${plan.firstService}</h3>
        <p class="service-role">${plan.firstRole}</p>
        <p><strong>Wat je doet:</strong> ${plan.firstAction}</p>
        <p><strong>Contact:</strong> ${plan.firstContact}</p>
        <p><strong>Hoe het werkt:</strong> ${plan.firstHow}</p>
      </div>
      <div class="service-card">
        <h3>${plan.secondService}</h3>
        <p class="service-role">${plan.secondRole}</p>
        <p><strong>Wat je doet:</strong> ${plan.secondAction}</p>
        <p><strong>Contact:</strong> ${plan.secondContact}</p>
      </div>
    </div>

    <div class="info-block">
      <h3>Welke documenten heb je nodig?</h3>
      <ul class="doc-list">
        ${plan.documents.map((doc) => `<li>${doc}</li>`).join('')}
      </ul>
    </div>

    <div class="info-block">
      <h3>Welke formulieren of aanvragen?</h3>
      <ul class="doc-list">
        ${plan.forms.map((form) => `<li>${form}</li>`).join('')}
      </ul>
    </div>

    <div class="info-block">
      <h3>Wachttijden en alternatieven</h3>
      <p>${plan.waiting}</p>
    </div>

    <div class="section-title">Visueel schema</div>
    <div class="timeline">
      ${plan.timeline.map((item, index) => `
        <div class="timeline-item">
          <div class="timeline-badge">${index + 1}</div>
          <div class="timeline-text">${item}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function restartFlow() {
  currentQuestionIndex = 0;
  answers = {};
  renderQuestion();
}

if (typeof module !== 'undefined') {
  module.exports = {
    getPersonalizedPlan
  };
}

window.addEventListener('DOMContentLoaded', () => {
  renderQuestion();
  document.getElementById('restartButton').addEventListener('click', restartFlow);
});
