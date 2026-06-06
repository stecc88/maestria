import { Mail, MessageSquare, BookText, Image as ImageIcon, Lightbulb, AlertCircle, PenTool, FileEdit } from "lucide-react"

export interface GuideContent {
  id: string
  title: string
  type: string
  level: string
  icon: any
  description: string
  structure: string[]
  connectors: string[]
  commonErrors: string[]
  example: {
    title: string
    content: string
  }
}

export const WRITING_GUIDES: GuideContent[] = [
  {
    id: "formal_email_b1",
    title: "Email formale - B1",
    type: "email_formal",
    level: "B1",
    icon: Mail,
    description: "Impara a scrivere email per situazioni ufficiali, lavorative o istituzionali.",
    structure: [
      "Apertura: 'Gentile Sig./Sig.ra [Cognome],' o 'Egregio Sig.,' per molto rispetto.",
      "Motivo: 'Le scrivo per informarLa che...' / 'Vi scrivo per richiedere...'",
      "Sviluppo: Spiegare il motivo con chiarezza in paragrafi brevi.",
      "Conclusione: 'Resto in attesa di una Sua risposta...' / 'La ringrazio anticipatamente...'",
      "Commiato: 'Cordiali saluti,' o 'Distinti saluti,'"
    ],
    connectors: ["poiché", "tuttavia", "inoltre", "in seguito a", "Le chiedo di"],
    commonErrors: [
      "Confondere 'tu' con 'Lei' (usare un registro informale)",
      "Mischiare formule di apertura formali con saluti informali",
      "Non concordare il participio passato con l'oggetto diretto"
    ],
    example: {
      title: "Richiesta di informazioni su un corso",
      content: "Gentile Direttore,\n\nLe scrivo per richiedere informazioni dettagliate sul corso di lingua italiana che inizierà a settembre. Sarei interessato a conoscere gli orari e il costo totale.\n\nResto in attesa di una Sua risposta.\n\nCordiali saluti,\nMarco Rossi"
    }
  },
  {
    id: "informal_email_b1",
    title: "Email informale - B1",
    type: "email_informal",
    level: "B1",
    icon: MessageSquare,
    description: "Perfetto per comunicare con amici, famiglia o conoscenti stretti.",
    structure: [
      "Apertura: 'Caro/a [Nome]!' o 'Ciao [Nome],'",
      "Gancio: Riferimento a qualcosa di precedente o chiedere come sta.",
      "Sviluppo: Raccontare novità, aneddoti o piani futuri.",
      "Chiusura: Fare una domanda per mantenere lo scambio.",
      "Saluto: 'Un abbraccio,' / 'A presto,' / 'Tanti saluti,'"
    ],
    connectors: ["poi", "però", "quindi", "comunque", "tra l'altro", "sai che"],
    commonErrors: [
      "Essere troppo formali nel saluto o nel commiato",
      "Non usare punti esclamativi per dare calore",
      "Dimenticare di chiedere dell'altra persona"
    ],
    example: {
      title: "Raccontando i piani per le vacanze",
      content: "Ciao Giulia!\n\nCome stai? Spero tutto bene. Ti scrivo perché finalmente ho deciso dove andare in vacanza: andrò in Sicilia! Sai che amo il mare siciliano.\n\nE tu? Cosa farai ad agosto? Fammi sapere!\n\nUn abbraccio,\nPaolo"
    }
  },
  {
    id: "narrativo_b1",
    title: "Testo narrativo - B1",
    type: "narrativo",
    level: "B1",
    icon: BookText,
    description: "Racconta storie o aneddoti seguendo un ordine cronologico chiaro.",
    structure: [
      "Introduzione: Presentare personaggi, luogo e tempo (usare l'imperfetto).",
      "Sviluppo: Narrare i fatti principali (passato prossimo).",
      "Climax: Il momento più importante o sorprendente del racconto.",
      "Conclusione: Come termina la storia e una breve riflessione."
    ],
    connectors: ["prima", "poi", "dopo", "improvvisamente", "alla fine", "nel frattempo"],
    commonErrors: [
      "Confondere l'Imperfetto (descrizione) con il Passato Prossimo (azione)",
      "Mancanza di descrizione iniziale per ambientare la storia",
      "Ripetizione eccessiva di connettori base come 'e' o 'poi'"
    ],
    example: {
      title: "Un giorno indimenticabile a Roma",
      content: "C'era una volta un ragazzo che voleva visitare Roma. Un giorno, mentre camminava vicino al Colosseo, ha incontrato un vecchio amico che non vedeva da anni. È stata una sorpresa incredibile!\n\nAbbiamo mangiato insieme e parlato tutto il giorno. Non dimenticherò mai quella giornata."
    }
  },
  {
    id: "descriptivo_b1",
    title: "Testo descrittivo - B1",
    type: "descriptivo",
    level: "B1",
    icon: ImageIcon,
    description: "Descrivi luoghi, persone o situazioni con dettaglio e precisione.",
    structure: [
      "Presentazione: Introdurre il tema o l'oggetto della descrizione.",
      "Dettagli: Descrivere dal generale allo specifico.",
      "Impressioni: Menzionare sensazioni o sentimenti evocati.",
      "Valutazione: Conclusione con un'opinione personale."
    ],
    connectors: ["si trova", "è caratterizzato da", "si distingue per", "mi colpisce", "esteticamente"],
    commonErrors: [
      "Mancata concordanza in genere e numero degli aggettivi",
      "Vocabolario limitato a parole generiche come 'bello' o 'buono'",
      "Menzionare solo aspetti fisici senza includere impressioni personali"
    ],
    example: {
      title: "Il mio luogo preferito: Firenze",
      content: "Firenze si trova in Toscana ed è caratterizzata da una bellezza senza tempo. Mi colpisce sempre la maestosità del Duomo. È una città che profuma di arte e storia. Per me, è il posto più affascinante del mondo."
    }
  },
  {
    id: "argumentativo_b2",
    title: "Testo argomentativo - B2",
    type: "argumentativo",
    level: "B2",
    icon: Lightbulb,
    description: "Impara a difendere una tesi con argomenti solidi e controargomentazioni.",
    structure: [
      "Introduzione: Presentare la tesi in modo chiaro e diretto.",
      "Argomenti: Esporre almeno due punti a favore con esempi.",
      "Controargomentazione: Presentare la posizione contraria e confutarla.",
      "Conclusione: Sintesi dei punti e riaffermazione della tesi."
    ],
    connectors: ["tuttavia", "d'altra parte", "in primo luogo", "inoltre", "di conseguenza", "nonostante ciò"],
    commonErrors: [
      "Mancanza di una controargomentazione (necessaria al livello B2)",
      "Uso di connettori solo di livello B1",
      "Non dividere chiaramente le idee in paragrafi"
    ],
    example: {
      title: "L'uso della tecnologia nell'educazione",
      content: "In primo luogo, la tecnologia permette un accesso rapido alle informazioni. Tuttavia, alcuni sostengono che possa distrarre gli studenti. D'altra parte, se usata correttamente, è uno strumento indispensabile oggi."
    }
  },
  {
    id: "reclamo_b1",
    title: "Richiesta / Reclamo - B1",
    type: "reclamo",
    level: "B1",
    icon: AlertCircle,
    description: "Impara a lamentarti o a richiedere qualcosa formalmente in modo efficace.",
    structure: [
      "Identificazione: 'Con riferimento a [evento], mi trovo a segnalare...'",
      "Descrizione: Dettagliare il problema con dati specifici (date, fatture).",
      "Inconvenienti: Spiegare come il problema ti ha condizionato.",
      "Richiesta concreta: 'La prego di provvedere al più presto a...'",
      "Commiato formale."
    ],
    connectors: ["purtroppo", "a causa di", "pertanto", "sollecitamente", "ritengo che"],
    commonErrors: [
      "Tono troppo aggressivo o maleducato",
      "Mancanza di dati concreti a supporto del reclamo",
      "Non specificare quale soluzione ci si aspetta dal destinatario"
    ],
    example: {
      title: "Reclamo per un prodotto danneggiato",
      content: "Egregio Servizio Clienti,\n\nCon riferimento all'ordine n. 12345, mi trovo a segnalare che il prodotto è arrivato danneggiato. Pertanto, La prego di provvedere alla sostituzione dell'articolo il prima possibile.\n\nCordiali saluti,\nLuigi Bianchi"
    }
  }
]
