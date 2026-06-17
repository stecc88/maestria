import {
  ImageIcon,
  BookText,
  Info,
  ListChecks,
  Lightbulb,
  PenTool,
  FileText,
  User,
  Home,
  MapPin,
  Utensils,
  AlertCircle,
  MessageSquare,
  FileEdit,
  ClipboardList,
  Mail,
  Star
} from "lucide-react"

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
  // --- TIPO DESCRITTIVO ---
  {
    id: "descrivere_persona_a1",
    title: "Descrivere una persona - A1",
    type: "descrittivo",
    level: "A1",
    icon: User,
    description: "Impara a presentare te stesso o un amico usando verbi ed aggettivi semplici.",
    structure: [
      "Dati personali: Nome, età, nazionalità.",
      "Aspetto fisico: Altezza, capelli, occhi.",
      "Carattere: Qualche aggettivo semplice (simpatico, allegro).",
      "Interessi: Cosa ama fare nel tempo libero."
    ],
    connectors: ["e", "anche", "ma", "perché"],
    commonErrors: [
      "Dimenticare il verbo essere (es. 'Lui alto')",
      "Sbagliare la concordanza degli aggettivi (es. 'Maria è simpatico')",
      "Confondere 'avere' ed 'essere' per l'età"
    ],
    example: {
      title: "Il mio migliore amico",
      content: "Il mio migliore amico si chiama Luca. Lui ha 20 anni ed è italiano. Luca è alto e ha i capelli castani. È molto simpatico e allegro. Gli piace giocare a calcio e ascoltare la musica."
    }
  },
  {
    id: "descrivere_citta_b1",
    title: "Descrivere la propria città - B1",
    type: "descrittivo",
    level: "B1",
    icon: MapPin,
    description: "Descrivi dove vivi includendo aspetti storici, culturali e opinioni personali.",
    structure: [
      "Introduzione: Nome e posizione geografica.",
      "Caratteristiche: Monumenti, piazze, atmosfera.",
      "Vita in città: Cosa offre agli abitanti e ai turisti.",
      "Opinione personale: Cosa ti piace e cosa cambieresti."
    ],
    connectors: ["si trova", "inoltre", "nonostante", "tuttavia", "per quanto riguarda"],
    commonErrors: [
      "Usare solo aggettivi banali (bello, grande)",
      "Non concordare il participio passato con 'si'",
      "Mancanza di connettori testuali per legare i paragrafi"
    ],
    example: {
      title: "Vivere a Firenze",
      content: "Firenze si trova nel cuore della Toscana ed è conosciuta in tutto il mondo per la sua arte. Il centro storico è caratterizzato da monumenti unici come il Duomo. Tuttavia, a volte è troppo affollata di turisti. Nonostante questo, amo vivere qui per l'atmosfera magica che si respira."
    }
  },

  // --- TIPO NARRATIVO ---
  {
    id: "esperienza_personale_a2",
    title: "Raccontare un'esperienza - A2",
    type: "narrativo",
    level: "A2",
    icon: BookText,
    description: "Racconta un evento passato usando correttamente il passato prossimo.",
    structure: [
      "Quando e dove: Introduzione temporale e spaziale.",
      "Eventi: Cosa è successo in ordine cronologico.",
      "Emozioni: Come ti sei sentito.",
      "Conclusione: Come è finita l'esperienza."
    ],
    connectors: ["prima", "poi", "dopo", "alla fine"],
    commonErrors: [
      "Sbagliare l'ausiliare (essere/avere) nel passato prossimo",
      "Dimenticare la concordanza del participio con l'ausiliare essere",
      "Usare solo il presente indicativo"
    ],
    example: {
      title: "Una domenica al mare",
      content: "Domenica scorsa sono andato al mare con i miei amici. Siamo partiti presto la mattina. Abbiamo fatto il bagno e abbiamo mangiato un gelato. Mi sono divertito molto perché il tempo era bellissimo. Siamo tornati a casa stanchi ma felici."
    }
  },
  {
    id: "racconto_viaggio_b2",
    title: "Raccontare un viaggio - B2",
    type: "narrativo",
    level: "B2",
    icon: PenTool,
    description: "Scrivi un resoconto dettagliato di un viaggio, alternando narrazione e descrizione.",
    structure: [
      "Preparazione: Il motivo del viaggio e le aspettative.",
      "Cronaca del viaggio: Alternanza di azioni (passato prossimo) e descrizioni (imperfetto).",
      "Aneddoto: Un episodio specifico o inaspettato.",
      "Riflessione: Cosa ti ha lasciato questa esperienza."
    ],
    connectors: ["nel frattempo", "improvvisamente", "mentre", "di conseguenza", "non appena"],
    commonErrors: [
      "Mancata alternanza tra passato prossimo e imperfetto",
      "Uso ripetitivo di 'e poi'",
      "Mancanza di precisione lessicale nel descrivere i luoghi"
    ],
    example: {
      title: "In cammino verso Santiago",
      content: "Mentre camminavo lungo i sentieri della Galizia, sentivo una pace profonda. Il viaggio era faticoso, ma ogni passo ne valeva la pena. Un pomeriggio, mentre cercavo un ostello, ho incontrato un pellegrino brasiliano. Abbiamo parlato per ore della vita. Quel viaggio non è stato solo una vacanza, ma una vera scoperta di me stesso."
    }
  },

  // --- TIPO ESPOSITIVO ---
  {
    id: "curriculum_vitae_b1",
    title: "Scrivere un CV - B1",
    type: "espositivo",
    level: "B1",
    icon: FileText,
    description: "Organizza le tue informazioni professionali e formative in modo chiaro.",
    structure: [
      "Dati di contatto: Recapiti principali.",
      "Esperienza lavorativa: In ordine cronologico inverso.",
      "Istruzione: Scuole e università frequentate.",
      "Competenze: Lingue, informatica, soft skills."
    ],
    connectors: ["esperto in", "capacità di", "responsabile di", "conoscenza di"],
    commonErrors: [
      "Troppe frasi lunghe (meglio usare elenchi puntati)",
      "Linguaggio troppo informale",
      "Mancanza di date precise"
    ],
    example: {
      title: "Profilo Professionale",
      content: "Sono un giovane laureato in economia con una forte passione per il marketing. Ho lavorato come stagista presso un'agenzia pubblicitaria, dove ero responsabile della gestione dei social media. Ho un'ottima conoscenza dell'inglese e una buona capacità di lavorare in team."
    }
  },
  {
    id: "relazione_argomento_c1",
    title: "Scrivere una relazione - C1",
    type: "espositivo",
    level: "C1",
    icon: ClipboardList,
    description: "Presenta un argomento complesso in modo oggettivo e strutturato.",
    structure: [
      "Abstract: Sintesi dell'argomento trattato.",
      "Introduzione: Contesto e obiettivi della relazione.",
      "Analisi: Presentazione dei dati o dei fatti principali.",
      "Conclusione: Sintesi finale e possibili sviluppi."
    ],
    connectors: ["in base a quanto esposto", "si evince che", "per quanto concerne", "alla luce di ciò"],
    commonErrors: [
      "Inserire opinioni personali (il testo deve essere oggettivo)",
      "Usare un registro troppo basso",
      "Mancanza di una struttura logica rigorosa"
    ],
    example: {
      title: "L'impatto dello smart working",
      content: "Alla luce dei dati raccolti nell'ultimo triennio, si evince che lo smart working ha incrementato la produttività del 15%. Per quanto concerne il benessere dei dipendenti, la flessibilità oraria risulta essere il fattore determinante. In conclusione, il modello ibrido appare come la soluzione più sostenibile per il futuro aziendale."
    }
  },

  // --- TIPO REGOLATIVO ---
  {
    id: "scrivere_ricetta_a2",
    title: "Scrivere una ricetta - A2",
    type: "regolativo",
    level: "A2",
    icon: Utensils,
    description: "Dai istruzioni chiare usando l'imperativo o l'infinito.",
    structure: [
      "Ingredienti: Lista con quantità.",
      "Preparazione: Passaggi in ordine cronologico.",
      "Consiglio: Un tocco finale o come servire il piatto."
    ],
    connectors: ["prima", "poi", "infine", "quindi"],
    commonErrors: [
      "Confondere le persone dell'imperativo (tu/voi)",
      "Mancanza di precisione nei verbi di cucina (tagliare, cuocere, mescolare)",
      "Non usare l'ordine cronologico"
    ],
    example: {
      title: "Pasta al pomodoro semplice",
      content: "Ingredienti: 100g di pasta, passata di pomodoro, olio, sale. Preparazione: Prima, cuoci la pasta in acqua salata. Poi, scalda il pomodoro in una padella con un po' d'olio. Infine, mescola la pasta con il sugo e servi caldo."
    }
  },

  // --- TIPO ARGOMENTATIVO ---
  {
    id: "esprimere_opinione_b1",
    title: "Esprimere un'opinione - B1",
    type: "argomentativo",
    level: "B1",
    icon: Lightbulb,
    description: "Esprimi il tuo punto di vista su un tema quotidiano.",
    structure: [
      "Introduzione: Presenta il tema.",
      "Opinione: Dì chiaramente cosa ne pensi.",
      "Motivazione: Fornisci almeno due ragioni.",
      "Conclusione: Ribadisci la tua posizione."
    ],
    connectors: ["secondo me", "penso che", "credo che", "a mio avviso", "infatti"],
    commonErrors: [
      "Non usare il congiuntivo dopo 'penso che' (anche se opzionale a B1, è consigliato)",
      "Non motivare la propria opinione",
      "Essere troppo ripetitivi"
    ],
    example: {
      title: "I social network: pro e contro",
      content: "Secondo me i social network sono utili per restare in contatto con gli amici. Infatti, permettono di condividere foto e messaggi velocemente. Tuttavia, credo che si passi troppo tempo al telefono. In conclusione, sono strumenti positivi se usati con moderazione."
    }
  },
  {
    id: "lettera_reclamo_b2",
    title: "Lettera di reclamo - B2",
    type: "argomentativo",
    level: "B2",
    icon: AlertCircle,
    description: "Reclama formalmente per un disservizio, argomentando le tue ragioni.",
    structure: [
      "Mittente e Destinatario: Formato formale.",
      "Oggetto: Breve e chiaro.",
      "Esposizione: Cosa è successo di spiacevole.",
      "Argomentazione: Perché il servizio non è stato soddisfacente.",
      "Richiesta: Cosa pretendi (rimborso, scuse, riparazione)."
    ],
    connectors: ["malgrado ciò", "pertanto", "si rende necessario", "esigo"],
    commonErrors: [
      "Usare un tono troppo aggressivo",
      "Mancanza di riferimenti precisi (date, numeri d'ordine)",
      "Non concludere con una richiesta chiara"
    ],
    example: {
      title: "Reclamo per ritardo aereo",
      content: "Spettabile Compagnia Aerea, vi scrivo per esprimere il mio forte disappunto riguardo al volo del 10 maggio. Malgrado la puntualità promessa, il ritardo è stato di oltre cinque ore. Pertanto, esigo un rimborso come previsto dalla normativa vigente. In attesa di un vostro riscontro, distinti saluti."
    }
  },
  {
    id: "descrivere_casa_a1",
    title: "Descrivere la propria casa - A1",
    type: "descrittivo",
    level: "A1",
    icon: Home,
    description: "Impara a descrivere gli ambienti della tua casa e dove si trovano i mobili.",
    structure: [
      "Presentazione: 'La mia casa è...' (grande, piccola, moderna).",
      "Stanze: 'Ci sono tre stanze: la cucina, il soggiorno...'.",
      "Posizione: 'In cucina c'è un tavolo...'.",
      "Opinione: 'Mi piace la mia casa perché...'"
    ],
    connectors: ["c'è / ci sono", "vicino a", "sopra", "sotto"],
    commonErrors: [
      "Confundere 'c'è' con 'è'",
      "Mancata concordanza plurale (es. 'Ci sono tre stanza')",
      "Dimenticare gli articoli determinativi"
    ],
    example: {
      title: "La mia casa a Roma",
      content: "La mia casa è piccola ma molto luminosa. C'è un grande soggiorno con un divano blu. Vicino al soggiorno c'è la cucina. Mi piace molto la mia casa perché è molto accogliente."
    }
  },
  {
    id: "diario_personale_a2",
    title: "Scrivere un diario - A2",
    type: "narrativo",
    level: "A2",
    icon: BookText,
    description: "Annota i tuoi pensieri e le tue attività quotidiane in forma di diario.",
    structure: [
      "Data e Saluto: 'Caro diario,'.",
      "Narrazione: 'Oggi ho fatto molte cose...'.",
      "Riflessione: 'Sono contento perché...'.",
      "Chiusura: 'A domani,' o 'Buonanotte,'."
    ],
    connectors: ["stamattina", "pomeriggio", "alla fine", "finalmente"],
    commonErrors: [
      "Dimenticare il saluto iniziale al diario",
      "Usare solo il presente",
      "Non esprimere sentimenti personali"
    ],
    example: {
      title: "Caro Diario",
      content: "15 Giugno 2026. Caro diario, oggi è stata una giornata faticosa ma bella. Stamattina sono andata a scuola e ho preso un bel voto in italiano! Finalmente ho capito il passato prossimo. Ora sono stanca e vado a dormire. A domani!"
    }
  },
  {
    id: "scrivere_avviso_b1",
    title: "Scrivere un avviso - B1",
    type: "regolativo",
    level: "B1",
    icon: Info,
    description: "Crea comunicazioni chiare per condomini, uffici o spazi pubblici.",
    structure: [
      "Titolo: 'AVVISO' o 'COMUNICAZIONE'.",
      "Destinatari: 'Si informano i signori condomini che...'.",
      "Dettagli: Date, orari e motivi.",
      "Istruzioni: 'Si prega di...' o 'È vietato...'.",
      "Firma: 'L'amministrazione'."
    ],
    connectors: ["si prega di", "si informa che", "entro e non oltre", "per ulteriori informazioni"],
    commonErrors: [
      "Tono troppo informale",
      "Mancanza di chiarezza sulle date",
      "Dimenticare i contatti per chiarimenti"
    ],
    example: {
      title: "Manutenzione Ascensore",
      content: "AVVISO. Si informano i signori condomini che lunedì 22 giugno l'ascensore non sarà funzionante per lavori di manutenzione dalle ore 9:00 alle 12:00. Si prega di usare le scale. Ci scusiamo per il disagio. L'amministratore."
    }
  },
  {
    id: "recensione_film_c1",
    title: "Scrivere una recensione - C1",
    type: "argomentativo",
    level: "C1",
    icon: Star,
    description: "Analizza criticamente un'opera culturale usando un lessico sofisticato.",
    structure: [
      "Introduzione: Dati tecnici (regista, anno, genere).",
      "Sinossi: Breve riassunto senza spoiler.",
      "Analisi critica: Interpretazione dei temi e della tecnica.",
      "Verdetto: Raccomandazione e voto finale."
    ],
    connectors: ["una magistrale interpretazione", "la trama si dipana", "al netto di", "un'opera imprescindibile"],
    commonErrors: [
      "Troppa trama e poca critica",
      "Uso di aggettivi troppo generici",
      "Mancanza di coesione tra i paragrafi"
    ],
    example: {
      title: "Recensione: La Grande Bellezza",
      content: "Il capolavoro di Sorrentino è una magistrale interpretazione della decadenza romana. La trama si dipana attraverso lo sguardo disilluso di Jep Gambardella. Al netto di alcune lunghezze, rimane un'opera imprescindibile del cinema contemporaneo. Voto: 9/10."
    }
  },
  {
    id: "tesi_argomentativa_c2",
    title: "Difendere una tesi - C2",
    type: "argomentativo",
    level: "C2",
    icon: Lightbulb,
    description: "Produci un testo accademico o professionale di alta complessità.",
    structure: [
      "Introduzione: Enunciazione del problema e della tesi.",
      "Argomentazione: Prove logiche e dati a supporto.",
      "Dialettica: Confutazione delle antitesi più forti.",
      "Sintesi: Risoluzione del conflitto e conclusioni di ampio respiro."
    ],
    connectors: ["fermo restando che", "va da sé che", "alla luce di tali premesse", "ergo"],
    commonErrors: [
      "Incoerenza logica",
      "Registro non adeguatamente elevato",
      "Mancata gestione delle sfumature di significato"
    ],
    example: {
      title: "L'etica nell'Intelligenza Artificiale",
      content: "Alla luce di tali premesse, va da sé che l'integrazione dell'IA richieda un quadro etico rigoroso. Fermo restando che l'innovazione non possa essere frenata, ergo è compito del legislatore garantire che l'algoritmo rimanga al servizio dell'umanità e non viceversa."
    }
  },
  {
    id: "descrivere_esperienza_b2",
    title: "Descrivere un'esperienza - B2",
    type: "descrittivo",
    level: "B2",
    icon: ImageIcon,
    description: "Descrivi un evento vissuto con ricchezza di dettagli sensoriali ed emotivi.",
    structure: [
      "Contesto: Quando, dove e con chi.",
      "Svolgimento: Descrizione dinamica degli eventi.",
      "Sensazioni: Uso di aggettivi evocativi per suoni, odori, emozioni.",
      "Conclusione: L'impatto duraturo dell'esperienza."
    ],
    connectors: ["si stagliava", "un'atmosfera rarefatta", "percepivo", "inevitabilmente"],
    commonErrors: [
      "Essere troppo piatti nella descrizione",
      "Mancanza di varietà lessicale",
      "Non collegare le descrizioni fisiche a quelle emotive"
    ],
    example: {
      title: "Un concerto sotto le stelle",
      content: "La musica si stagliava nitida contro il silenzio della notte. Percepivo ogni vibrazione del violino mentre un'atmosfera rarefatta avvolgeva il pubblico. È stata un'esperienza che, inevitabilmente, ha cambiato il mio modo di ascoltare l'arte."
    }
  },
  {
    id: "istruzioni_procedura_b1",
    title: "Scrivere istruzioni - B1",
    type: "regolativo",
    level: "B1",
    icon: ListChecks,
    description: "Impara a spiegare come fare qualcosa in modo sequenziale e logico.",
    structure: [
      "Scopo: Cosa si andrà a realizzare.",
      "Fasi: Elenco numerato delle azioni.",
      "Avvertenze: Cosa non fare o a cosa prestare attenzione.",
      "Verifica: Come capire se il risultato è corretto."
    ],
    connectors: ["innanzitutto", "successivamente", "nel caso in cui", "assicurarsi di"],
    commonErrors: [
      "Saltare passaggi logici",
      "Usare un linguaggio ambiguo",
      "Dimenticare le norme di sicurezza o avvertenze"
    ],
    example: {
      title: "Come montare uno scaffale",
      content: "Innanzitutto, verifica di avere tutte le viti. Successivamente, unisci i due pannelli laterali alla base. Assicurarsi di stringere bene ogni bullone. Nel caso in cui lo scaffale traballi, controlla il livellamento dei piedini."
    }
  },
  {
    id: "email_informativa_b1",
    title: "Email informativa - B1",
    type: "espositivo",
    level: "B1",
    icon: Mail,
    description: "Comunica dati o fatti in modo professionale e oggettivo.",
    structure: [
      "Oggetto: Sintesi del contenuto.",
      "Saluto: Formale o semi-formale.",
      "Corpo: Presentazione chiara delle informazioni.",
      "Disponibilità: Offerta di ulteriori chiarimenti.",
      "Saluto finale."
    ],
    connectors: ["con la presente si comunica", "si allega", "per quanto riguarda", "in merito a"],
    commonErrors: [
      "Mischiare informazioni utili con opinioni personali",
      "Essere troppo prolissi",
      "Dimenticare l'oggetto della mail"
    ],
    example: {
      title: "Aggiornamento orari ufficio",
      content: "Con la presente si comunica che, a partire dal prossimo lunedì, l'ufficio osserverà il nuovo orario estivo. Si allega il dettaglio delle aperture. Per quanto riguarda le urgenze, restiamo a disposizione via email. Cordiali saluti."
    }
  }
]
