import { CourseUnit, StudyFolder, StudyMaterial, DynamicCard, QuizQuestion } from '../types';

export const TOTAL_ENCOUNTERS = 10;

export const COURSE_UNITS: CourseUnit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    title: "Esplorazione, Funzionamento e Sicurezza",
    fullTitle: "Modulo 1 — Esplorazione, Funzionamento e Sicurezza",
    encountersRange: "Incontri 1 – 3",
    dateStr: "Incontri 1, 2 e 3",
    dateShort: "Inc. 1–3",
    shortDesc: "Cosa puoi fare davvero con l'AI, come decide dietro le quinte, orientamento nei principali assistenti e regole di privacy",
    sections: [
      {
        id: 'sec-1-1',
        encounterNumber: 1,
        number: 'Incontro 1',
        title: "Cosa puoi fare davvero con l'AI",
        subtitle: "Applicazioni pratiche di ogni giorno:",
        keyPoints: [
          "Esplorazione guidata delle applicazioni utili nella vita quotidiana (scrittura, cucina, viaggi, burocrazia, tempo libero).",
          "Prime prove pratiche dirette senza bisogno di registrazione."
        ],
        calloutTitle: "Esempi dalla Vita Quotidiana:",
        calloutText: "Trasformare gli ingredienti rimasti in frigo in una ricetta, scrivere un messaggio elegante, progettare l'itinerario di una gita o chiarire un dubbio pratico in pochi secondi.",
        footerLabel: "Obiettivo Pratico",
        footerValue: "Prime prove guidate senza account"
      },
      {
        id: 'sec-1-2',
        encounterNumber: 2,
        number: 'Incontro 2',
        title: "Dietro le quinte — Come decide l'AI e perché a volte sbaglia",
        subtitle: "Comprendere il meccanismo e i rischi:",
        keyPoints: [
          "Differenza tra ricerca su internet e generazione di risposte.",
          "Il concetto di \"Scatola Nera\" e le allucinazioni (quando l'AI inventa informazioni con sicurezza).",
          "La regola d'oro: l'umano resta sempre al centro delle decisioni."
        ],
        calloutTitle: "Esempio di Allucinazione:",
        calloutText: "Un motore di ricerca cerca pagine reali; l'AI invece calcola la parola statisticamente più probabile. Se non sa un fatto, può inventarlo con tono convincente: verifica sempre!",
        footerLabel: "Scheda Comparativa",
        footerValue: "Ricerca vs Generazione",
        hasOpenDetail: true
      },
      {
        id: 'sec-1-3',
        encounterNumber: 3,
        number: 'Incontro 3',
        title: "Scegliere lo strumento e proteggere la Privacy",
        subtitle: "Assistenti principali e sicurezza dati:",
        keyPoints: [
          "Panoramica degli assistenti principali (ChatGPT, Gemini, Copilot) e orientamento nella schermata.",
          "Regole di sicurezza: quali dati personali non inserire mai e come configurare le impostazioni della privacy."
        ],
        calloutTitle: "La Regola del Cartellone Pubblico:",
        calloutText: "Non scrivere in chat password, codice fiscale, referti medici o nomi reali. Disattiva dalle impostazioni l'opzione di addestramento sui tuoi dati e usa sempre '+ Nuova Chat'.",
        footerLabel: "Strumenti & Privacy",
        footerValue: "ChatGPT, Gemini, Copilot al sicuro"
      }
    ]
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    title: "Saper Chiedere e Gestire i Testi",
    fullTitle: "Modulo 2 — Saper Chiedere e Gestire i Testi",
    encountersRange: "Incontri 4 – 6",
    dateStr: "Incontri 4, 5 e 6",
    dateShort: "Inc. 4–6",
    shortDesc: "L'arte del prompt efficace, traduzione dal burocratese e interrogazione intelligente dei propri PDF con NotebookLM",
    sections: [
      {
        id: 'sec-2-1',
        encounterNumber: 4,
        number: 'Incontro 4',
        title: "L'arte di fare le domande giuste (Il Prompt)",
        subtitle: "Dalla richiesta vaga all'istruzione efficace:",
        keyPoints: [
          "Perché le richieste generiche danno risposte vaghe.",
          "Come costruire un'istruzione chiara e completa indicando contesto, ruolo, obiettivo e formato."
        ],
        calloutTitle: "La Formula dei 4 Elementi:",
        calloutText: "Contesto (chi sei / situazione) + Ruolo (es. 'Agisci come un esperto paziente') + Obiettivo (cosa vuoi ottenere) + Formato (es. 'elenco di 5 punti semplici').",
        footerLabel: "Competenza Chiave",
        footerValue: "Prompt strutturato in 4 passi"
      },
      {
        id: 'sec-2-2',
        encounterNumber: 5,
        number: 'Incontro 5',
        title: "Email, Messaggi e Traduzione dal \"Burocratese\"",
        subtitle: "Scrittura pratica e semplificazione:",
        keyPoints: [
          "Adattare il tono di voce (informale, gentile, formale) in base al destinatario.",
          "Semplificare lettere complesse, bollette o avvisi amministrativi e scrivere comunicazioni formali."
        ],
        calloutTitle: "Comando Anti-Burocratese:",
        calloutText: "Incolla il testo difficile (togliendo i tuoi dati personali) e scrivi: \"Spiegami questo avviso in italiano semplice, come se lo spiegassi a un amico, elencando scadenze e azioni da fare\".",
        footerLabel: "Applicazione Diretta",
        footerValue: "Tono su misura e testi chiari"
      },
      {
        id: 'sec-2-3',
        encounterNumber: 6,
        number: 'Incontro 6',
        title: "Riassumere Documenti Lunghi e Interrogare i Propri File",
        subtitle: "Lavorare sui propri documenti:",
        keyPoints: [
          "Caricare PDF o testi lunghi per estrarre i punti chiave e le cose da fare.",
          "Introduzione a NotebookLM come spazio personale per fare domande solo sui propri documenti."
        ],
        calloutTitle: "Perché NotebookLM è Speciale:",
        calloutText: "A differenza di una chat generica, NotebookLM risponde basandosi solo sui PDF o file che hai caricato tu, riducendo drasticamente il rischio di invenzioni.",
        footerLabel: "Strumento Dedicato",
        footerValue: "PDF e NotebookLM personale"
      }
    ]
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    title: "Organizzazione, Dati e Creatività",
    fullTitle: "Modulo 3 — Organizzazione, Dati e Creatività",
    encountersRange: "Incontri 7 – 8",
    dateStr: "Incontri 7 e 8",
    dateShort: "Inc. 7–8",
    shortDesc: "Pianificazione pratica con vincoli reali, supporto su Excel/Fogli, lettura foto e scontrini, e trascrizione di note vocali",
    sections: [
      {
        id: 'sec-3-1',
        encounterNumber: 7,
        number: 'Incontro 7',
        title: "Superare il \"Foglio Bianco\" e Pianificare",
        subtitle: "Ideazione e organizzazione quotidiana:",
        keyPoints: [
          "Usare l'AI come partner per raccogliere idee nuove.",
          "Organizzare attività pratiche con vincoli reali (menu settimanali anti-spreco, liste della spesa, itinerari di viaggio)."
        ],
        calloutTitle: "Esempio di Pianificazione con Vincoli:",
        calloutText: "\"Preparami un menu per 5 cene per 2 persone, veloce (max 20 minuti), senza latticini, e scrivimi la lista della spesa già divisa per reparto del supermercato\".",
        footerLabel: "Creatività Pratica",
        footerValue: "Idee su misura e piani reali"
      },
      {
        id: 'sec-3-2',
        encounterNumber: 8,
        number: 'Incontro 8',
        title: "Oltre la Chat — Fogli di Calcolo, Immagini e Voce",
        subtitle: "Multimodalità per dati, foto e audio:",
        keyPoints: [
          "Farsi aiutare con semplici formule su Excel o Google Fogli senza studiarle a memoria.",
          "Leggere testi da foto e scontrini e trasformare note vocali in appunti ordinati."
        ],
        calloutTitle: "Dal Disordine all'Ordine in 1 Clic:",
        calloutText: "Scatta la foto a uno scontrino o a una tabella cartacea per farne estrarre gli importi, oppure detta a voce i tuoi pensieri per ottenere un elenco ordinato pronto da inviare.",
        footerLabel: "Multimodalità",
        footerValue: "Formule Excel, OCR foto e voce"
      }
    ]
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    title: "Senso Critico e Autonomia Finale",
    fullTitle: "Modulo 4 — Senso Critico e Autonomia Finale",
    encountersRange: "Incontri 9 – 10",
    dateStr: "Incontri 9 e 10",
    dateShort: "Inc. 9–10",
    shortDesc: "Riconoscere stereotipi e truffe digitali, diritto d'autore e laboratorio finale per padroneggiare un metodo autonomo",
    sections: [
      {
        id: 'sec-4-1',
        encounterNumber: 9,
        number: 'Incontro 9',
        title: "Pregiudizi, Truffe Online e Diritto d'Autore",
        subtitle: "Consapevolezza critica e difesa digitale:",
        keyPoints: [
          "Riconoscere gli stereotipi presenti nei dati dell'AI.",
          "Difendersi dalle nuove truffe digitali (email sospette, clonazione vocale) e regole base sull'uso corretto dei contenuti generati."
        ],
        calloutTitle: "Difesa Dalle Truffe & Bias:",
        calloutText: "I modelli riflettono i pregiudizi umani presenti su internet. Sul fronte sicurezza, se ricevi una telefonata urgente con richiesta di denaro, riattacca e richiama il numero salvato in rubrica.",
        footerLabel: "Tutela & Etica",
        footerValue: "Senso critico e uso responsabile"
      },
      {
        id: 'sec-4-2',
        encounterNumber: 10,
        number: 'Incontro 10',
        title: "Laboratorio Finale — Il Tuo Metodo Personale",
        subtitle: "Autonomia continua e caso pratico reale:",
        keyPoints: [
          "Uso di strumenti di supporto per generare istruzioni efficaci e imparare qualsiasi argomento in autonomia.",
          "Esercitazione riepilogativa completa su un caso pratico reale."
        ],
        calloutTitle: "Il Tuo Prompt Meta per Imparare:",
        calloutText: "\"Voglio imparare [argomento]. Fammi da tutor passo dopo passo, proponimi un esercizio pratico alla volta e aiutami a costruire le domande giuste per approfondire\".",
        footerLabel: "Traguardo Finale",
        footerValue: "Autonomia pratica su casi reali"
      }
    ]
  }
];

export const INITIAL_DYNAMIC_ITEMS: DynamicCard[] = [
  {
    id: 'demo-1',
    unitId: 'unit-1',
    column: '3',
    title: 'Orientamento rapido nella schermata della chat',
    description: 'A sinistra trovi la cronologia delle chat precedenti e il tasto "+ Nuova Chat". In basso c\'è la barra per scrivere, la graffetta per caricare un PDF o una foto e il microfono per dettare.',
    createdAt: Date.now() - 86400000,
    author: 'Docente LSA'
  },
  {
    id: 'demo-2',
    unitId: 'unit-1',
    column: '1',
    title: 'Prova subito in aula senza account',
    description: 'Esercizio di apertura: chiediamo all\'assistente 3 idee per una cena veloce con zucchine, uova e pane raffermo, poi trasformiamo la ricetta scelta in lista della spesa.',
    createdAt: Date.now() - 43200000,
    author: 'Docente LSA'
  }
];

export const STUDY_FOLDERS: StudyFolder[] = [
  { id: 'M1', label: "Modulo 1 — Esplorazione, Funzionamento e Sicurezza", description: "Incontri 1–3: usi quotidiani, scatola nera, allucinazioni e privacy" },
  { id: 'M2', label: "Modulo 2 — Saper Chiedere e Gestire i Testi", description: "Incontri 4–6: prompt, anti-burocratese, PDF e NotebookLM" },
  { id: 'M3', label: "Modulo 3 — Organizzazione, Dati e Creatività", description: "Incontri 7–8: pianificazione, Excel/Fogli, foto e note vocali" },
  { id: 'M4', label: "Modulo 4 — Senso Critico e Autonomia Finale", description: "Incontri 9–10: bias, truffe, copyright e laboratorio finale" }
];

export const INITIAL_STUDY_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    folder: 'M1',
    type: 'Scheda Incontri 1–2',
    title: "Ricerca Web vs AI Generativa & Scatola Nera",
    description: "Tavola comparativa per capire quando l'AI inventa (allucinazioni) e la regola d'oro del controllo umano."
  },
  {
    id: 'mat-2',
    folder: 'M1',
    type: 'Guida Privacy',
    title: 'Checklist Sicurezza su ChatGPT, Gemini e Copilot',
    description: 'Quali dati non inserire mai e come disattivare la cronologia/addestramento.'
  },
  {
    id: 'mat-3',
    folder: 'M2',
    type: 'Modello Prompt',
    title: "Schema 4 Elementi + Traduttore dal Burocratese",
    description: 'Esempi pronti per chiarire bollette, avvisi e scrivere email gentili o formali.'
  },
  {
    id: 'mat-4',
    folder: 'M2',
    type: 'Guida Pratica',
    title: 'Usare NotebookLM con i propri PDF',
    description: 'Passo dopo passo per caricare documenti lunghi e ottenere risposte citate dalle tue fonti.'
  },
  {
    id: 'mat-5',
    folder: 'M3',
    type: 'Laboratorio Dati',
    title: "Formule Excel/Fogli, Scontrini e Note Vocali",
    description: 'Prompt pronti per farsi scrivere formule, leggere foto e riordinare messaggi vocali.'
  },
  {
    id: 'mat-6',
    folder: 'M4',
    type: 'Vademecum Finale',
    title: "Riconoscere Stereotipi, Truffe Vocali & Metodo Personale",
    description: 'Guida alla difesa dalle truffe AI, regole sui contenuti generati e caso pratico riepilogativo.'
  }
];

export const RECOMMENDED_READINGS = [
  {
    type: 'Libro Fondamentale',
    title: "L'intelligenza artificiale",
    author: "Jerry Kaplan",
    desc: "Guida limpida e accessibile a tutti, senza tecnicismi, che spiega la storia e il futuro delle macchine che pensano.",
    tag: "Consigliato ai principianti"
  },
  {
    type: 'Libro Pratico',
    title: "Co-Intelligence",
    author: "Ethan Mollick",
    desc: "Come vivere e lavorare con l'AI. Quattro regole pratiche di buon senso per integrare i modelli nella vita di ogni giorno.",
    tag: "Metodo e produttività"
  },
  {
    type: 'Blog & Newsletter',
    title: "One Useful Thing",
    author: "Prof. Ethan Mollick",
    desc: "Articoli settimanali chiarissimi sulle novità dei modelli linguistici e come testarli sul campo.",
    tag: "Newsletter settimanale"
  },
  {
    type: 'Notiziario Settimanale',
    title: "The Batch",
    author: "Andrew Ng / DeepLearning.AI",
    desc: "I fatti più importanti della settimana nel mondo dell'AI spiegati con equilibrio e rigore.",
    tag: "Aggiornamento continuo"
  }
];

export const SELF_CHECK_QUIZ: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual è la differenza principale tra una ricerca su Google e una risposta generata da ChatGPT o Gemini?",
    options: [
      "La ricerca trova pagine web esistenti; l'AI genera testo nuovo parola per parola calcolando la probabilità (e può sbagliare)",
      "Non c'è alcuna differenza: entrambi leggono l'enciclopedia cartacea",
      "La ricerca su internet è sempre a pagamento, mentre l'AI non inventa mai nulla",
      "L'AI funziona solo se il computer è scollegato da internet"
    ],
    correctIndex: 0,
    explanation: "Esatto! Un motore di ricerca cerca documenti reali già pubblicati. L'AI generativa invece costruisce la risposta sul momento prevedendo le parole più probabili, motivo per cui può produrre allucinazioni."
  },
  {
    id: 2,
    question: "Quali quattro elementi rendono davvero efficace un prompt (richiesta all'AI)?",
    options: [
      "Scrivere tutto in maiuscolo, mettere molti punti esclamativi, usare l'inglese e scrivere una sola parola",
      "Contesto, Ruolo, Obiettivo e Formato della risposta desiderata",
      "Inserire sempre il proprio codice fiscale, indirizzo di casa, password e numero di telefono",
      "Chiedere 'dimmi tutto' senza specificare cosa ci serve"
    ],
    correctIndex: 1,
    explanation: "Perfetto! Specificando Contesto, Ruolo, Obiettivo e Formato eviti risposte vaghe e ottieni esattamente ciò che ti serve al primo colpo."
  },
  {
    id: 3,
    question: "Perché NotebookLM è particolarmente utile quando devi studiare o riassumere un tuo documento PDF lungo?",
    options: [
      "Perché stampa automaticamente i fogli sulla stampante di casa",
      "Perché lavora in uno spazio chiuso rispondendo esclusivamente in base ai file che hai caricato tu",
      "Perché cancella tutte le parole difficili dal PDF originale",
      "Perché traduce solo dal latino all'italiano"
    ],
    correctIndex: 1,
    explanation: "Bravissimo! NotebookLM ancora le sue risposte alle tue fonti caricate, mostrando anche i riferimenti precisi nel testo ed evitando invenzioni esterne."
  },
  {
    id: 4,
    question: "Come puoi usare l'AI per farti aiutare con Excel o Google Fogli senza studiare le formule a memoria?",
    options: [
      "Descrivendo a parole cosa c'è nelle colonne (es. A e B) e chiedendo la formula pronta da copiare",
      "Non è possibile: l'AI non sa leggere numeri o tabelle",
      "Bisogna prima imparare il linguaggio di programmazione C++",
      "Chiedendo all'AI di indovinare i numeri al posto nostro"
    ],
    correctIndex: 0,
    explanation: "Esatto! Basta spiegare in italiano semplice cosa vuoi calcolare e in quali celle si trovano i dati per ricevere subito la formula esatta e la spiegazione passo passo."
  },
  {
    id: 5,
    question: "Se ricevi una telefonata o un vocale con la voce di un familiare che chiede soldi urgenti, qual è la regola di sicurezza migliore?",
    options: [
      "Fare subito il bonifico perché la voce sembra identica alla sua",
      "Riattaccare subito e richiamare tu stesso il numero salvato in rubrica (o verificare con una parola d'ordine di famiglia)",
      "Rispondere inviando la foto della carta d'identità",
      "Chiedere a ChatGPT se la voce è vera"
    ],
    correctIndex: 1,
    explanation: "Ottima difesa! Oggi la clonazione vocale AI può imitare una voce reale partendo da pochi secondi di audio sui social. Richiamare il contatto diretto interrompe subito la truffa."
  }
];

export const TOKEN_SIMULATION_PRESETS = [
  {
    phrase: "Il gatto è seduto sul",
    candidates: [
      { word: "tappeto", probability: 84 },
      { word: "divano", probability: 9 },
      { word: "tavolo", probability: 5 },
      { word: "tetto", probability: 2 }
    ],
    explanation: "Nei testi italiani di addestramento, la parola 'tappeto' è statisticamente la compagna più frequente di questa frase classica."
  },
  {
    phrase: "A colazione preferisco bere un",
    candidates: [
      { word: "caffè", probability: 78 },
      { word: "cappuccino", probability: 14 },
      { word: "tè", probability: 6 },
      { word: "succo", probability: 2 }
    ],
    explanation: "La cultura gastronomica italiana riflessa nei testi privilegia 'caffè', seguito da 'cappuccino'."
  },
  {
    phrase: "Il monumento più celebre di Roma è il",
    candidates: [
      { word: "Colosseo", probability: 93 },
      { word: "Pantheon", probability: 4 },
      { word: "Vaticano", probability: 2 },
      { word: "Foro", probability: 1 }
    ],
    explanation: "La correlazione geografica e turistica assegna al 'Colosseo' una probabilità schiacciante."
  },
  {
    phrase: "Per accendere la luce premiamo l'",
    candidates: [
      { word: "interruttore", probability: 95 },
      { word: "accendino", probability: 3 },
      { word: "app", probability: 2 }
    ],
    explanation: "L'AI associa il verbo accendere e il sostantivo luce all'oggetto fisico canonico."
  }
];
