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
    title: "Email formal - B1",
    type: "email_formal",
    level: "B1",
    icon: Mail,
    description: "Aprendé a escribir emails para situaciones oficiales, laborales o institucionales.",
    structure: [
      "Apertura: 'Gentile Sig./Sig.ra [Cognome],' o 'Egregio Sig.,' para mucho respeto.",
      "Motivo: 'Le scrivo per informarLa che...' / 'Vi scrivo per richiedere...'",
      "Desarrollo: Explicar el motivo con claridad en párrafos cortos.",
      "Conclusión: 'Resto in attesa di una Sua risposta...' / 'La ringrazio anticipatamente...'",
      "Despedida: 'Cordiali saluti,' o 'Distinti saluti,'"
    ],
    connectors: ["poiché", "tuttavia", "inoltre", "in seguito a", "Le chiedo di"],
    commonErrors: [
      "Confundir 'tu' con 'Lei' (usar registro informal)",
      "Mezclar fórmulas de apertura formal con despedida informal",
      "No concordar el participio pasado con el objeto directo"
    ],
    example: {
      title: "Solicitud de información sobre curso",
      content: "Gentile Direttore,\n\nLe scrivo per richiedere informazioni dettagliate sul corso di lingua italiana che inizierà a settembre. Sarei interessato a conoscere gli orari e il costo totale.\n\nResto in attesa di una Sua risposta.\n\nCordiali saluti,\nMarco Rossi"
    }
  },
  {
    id: "informal_email_b1",
    title: "Email informal - B1",
    type: "email_informal",
    level: "B1",
    icon: MessageSquare,
    description: "Perfecto para comunicarte con amigos, familia o conocidos cercanos.",
    structure: [
      "Apertura: 'Caro/a [Nome]!' o 'Ciao [Nome],'",
      "Enganche: Referencia a algo previo o preguntar cómo está.",
      "Desarrollo: Contar novedades, anécdotas o planes futuros.",
      "Cierre: Hacer una pregunta para mantener el intercambio.",
      "Despedida: 'Un abbraccio,' / 'A presto,' / 'Tanti saluti,'"
    ],
    connectors: ["poi", "però", "quindi", "comunque", "tra l'altro", "sai che"],
    commonErrors: [
      "Ser demasiado formal en el saludo o despedida",
      "No usar signos de exclamación para dar calidez",
      "Olvidar preguntar por la otra persona"
    ],
    example: {
      title: "Contando planes de vacaciones",
      content: "Ciao Giulia!\n\nCome stai? Spero tutto bene. Ti scrivo perché finalmente ho deciso dove andare in vacanza: andrò in Sicilia! Sai che amo il mare siciliano.\n\nE tu? Cosa farai ad agosto? Fammi sapere!\n\nUn abbraccio,\nPaolo"
    }
  },
  {
    id: "narrativo_b1",
    title: "Texto narrativo - B1",
    type: "narrativo",
    level: "B1",
    icon: BookText,
    description: "Contá historias o anécdotas siguiendo un orden cronológico claro.",
    structure: [
      "Introducción: Presentar personajes, lugar y tiempo (usar imperfecto).",
      "Desarrollo: Narrar los hechos principales (passato prossimo).",
      "Clímax: El momento más importante o sorprendente del relato.",
      "Desenlace: Cómo termina la historia y una breve reflexión."
    ],
    connectors: ["prima", "poi", "dopo", "improvvisamente", "alla fine", "nel frattempo"],
    commonErrors: [
      "Confundir Imperfetto (descripción) con Passato Prossimo (acción)",
      "Falta de descripción inicial para ambientar la historia",
      "Repetición excesiva de conectores básicos como 'e' o 'poi'"
    ],
    example: {
      title: "Un día inolvidable en Roma",
      content: "C'era una volta un ragazzo che voleva visitare Roma. Un giorno, mentre camminava vicino al Colosseo, ha incontrato un vecchio amico che non vedeva da anni. È stata una sorpresa incredibile!\n\nAbbiamo mangiato insieme e parlato tutto il giorno. Non dimenticherò mai quella giornata."
    }
  },
  {
    id: "descriptivo_b1",
    title: "Texto descriptivo - B1",
    type: "descriptivo",
    level: "B1",
    icon: ImageIcon,
    description: "Describí lugares, personas o situaciones con detalle y precisión.",
    structure: [
      "Presentación: Introducir el tema u objeto de la descripción.",
      "Detalles: Describir de lo general a lo específico.",
      "Impresiones: Mencionar sensaciones o sentimientos que evoca.",
      "Valoración: Conclusión con una opinión personal."
    ],
    connectors: ["si trova", "è caratterizzato da", "si distingue per", "mi colpisce", "esteticamente"],
    commonErrors: [
      "Falta de concordancia en género y número de los adjetivos",
      "Vocabulario limitado a palabras genéricas como 'bello' o 'buono'",
      "Mencionar solo aspectos físicos sin incluir impresiones personales"
    ],
    example: {
      title: "Mi lugar favorito: Florencia",
      content: "Firenze si trova in Toscana ed è caratterizzata da una bellezza senza tempo. Mi colpisce sempre la maestosità del Duomo. È una città che profuma di arte e storia. Per me, è il posto più affascinante del mondo."
    }
  },
  {
    id: "argumentativo_b2",
    title: "Texto argumentativo - B2",
    type: "argumentativo",
    level: "B2",
    icon: Lightbulb,
    description: "Aprendé a defender una tesis con argumentos sólidos y contraargumentos.",
    structure: [
      "Introducción: Presentar la tesis de forma clara y directa.",
      "Argumentos: Exponer al menos dos puntos a favor con ejemplos.",
      "Contraargumento: Presentar la posición contraria y refutarla.",
      "Conclusión: Síntesis de los puntos y reafirmación de la tesis."
    ],
    connectors: ["tuttavia", "d'altra parte", "in primo luogo", "inoltre", "di conseguenza", "nonostante ciò"],
    commonErrors: [
      "Falta de un contraargumento (necesario en nivel B2)",
      "Uso de conectores solo de nivel B1",
      "No dividir claramente las ideas en párrafos"
    ],
    example: {
      title: "El uso de la tecnología en la educación",
      content: "In primo luogo, la tecnologia permette un accesso rapido alle informazioni. Tuttavia, alcuni sostengono che possa distrarre gli studenti. D'altra parte, se usata correttamente, è uno strumento indispensabile oggi."
    }
  },
  {
    id: "reclamo_b1",
    title: "Solicitud / Reclamo - B1",
    type: "reclamo",
    level: "B1",
    icon: AlertCircle,
    description: "Aprendé a quejarte o solicitar algo formalmente de manera efectiva.",
    structure: [
      "Identificación: 'Con riferimento a [evento], mi trovo a segnalare...'",
      "Descripción: Detallar el problema con datos específicos (fechas, facturas).",
      "Inconvenientes: Explicar cómo te afectó el problema.",
      "Solicitud concreta: 'La prego di provvedere al più presto a...'",
      "Despedida formal."
    ],
    connectors: ["purtroppo", "a causa di", "pertanto", "sollecitamente", "ritengo che"],
    commonErrors: [
      "Tono demasiado agresivo o maleducado",
      "Falta de datos concretos que respalden el reclamo",
      "No especificar qué solución se espera del destinatario"
    ],
    example: {
      title: "Reclamo por un producto dañado",
      content: "Egregio Servizio Clienti,\n\nCon riferimento all'ordine n. 12345, mi trovo a segnalare che il prodotto è arrivato danneggiato. Pertanto, La prego di provvedere alla sostituzione dell'articolo il prima possibile.\n\nCordiali saluti,\nLuigi Bianchi"
    }
  }
]
