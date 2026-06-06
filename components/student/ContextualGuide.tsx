"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Lightbulb, AlertTriangle, ListChecks } from "lucide-react"

interface GuideData {
  structure: string[]
  connectors: string[]
  commonErrors: string[]
}

const guides: Record<string, GuideData> = {
  'email_formal_B1': {
    structure: [
      "Mittente e destinatario (formale)",
      "Oggetto chiaro",
      "Formula di apertura (Gentile Signore/a...)",
      "Corpo del testo diviso in paragrafi",
      "Ringraziamenti e chiusura (Cordiali saluti)"
    ],
    connectors: [
      "In riferimento a...",
      "Le scrivo per informarla che...",
      "Inoltre,",
      "Resto in attesa di un Suo riscontro",
      "Ringraziando per l'attenzione"
    ],
    commonErrors: [
      "Confondere 'tu' con 'Lei'",
      "Usare formule troppo amichevoli (Ciao)",
      "Non concordare il participio passato con l'oggetto diretto"
    ]
  },
  'email_informal_B1': {
    structure: [
      "Saluto iniziale (Caro/a [Nome],)",
      "Introduzione e come stai",
      "Messaggio principale",
      "Saluti finali (Un abbraccio, A presto)"
    ],
    connectors: [
      "Ti scrivo perché...",
      "Volevo dirti che...",
      "A proposito,",
      "Spero di sentirti presto",
      "Fammi sapere cosa ne pensi"
    ],
    commonErrors: [
      "Dimenticare la virgola dopo il saluto iniziale",
      "Usare un tono troppo freddo",
      "Errori di ortografia comuni (po', fa, è)"
    ]
  },
  'narrativo_B1': {
    structure: [
      "Introduzione (tempo e luogo)",
      "Evento scatenante",
      "Sviluppo della storia",
      "Conclusione/Riflessione finale"
    ],
    connectors: [
      "Tutto è iniziato quando...",
      "All'improvviso,",
      "Mentre stavo...",
      "Alla fine,",
      "Non dimenticherò mai che..."
    ],
    commonErrors: [
      "Alternanza imperfetto/passato prossimo",
      "Mancanza di aggettivi descrittivi",
      "Ripetizione eccessiva di 'e' o 'poi'"
    ]
  },
  'descriptivo_B1': {
    structure: [
      "Introduzione all'oggetto/persona/luogo",
      "Aspetto fisico o generale",
      "Dettagli specifici o caratteristiche",
      "Opinione personale o sentimenti"
    ],
    connectors: [
      "Si trova a...",
      "È caratterizzato da...",
      "Sembra che...",
      "Quello che mi piace di più è...",
      "Dal punto di vista estetico..."
    ],
    commonErrors: [
      "Concordanza genere/numero degli aggettivi",
      "Vocabolario limitato",
      "Mancanza di avverbi di grado (molto, abbastanza, piuttosto)"
    ]
  }
}

interface ContextualGuideProps {
  type: string
  level: string
}

export function ContextualGuide({ type, level }: ContextualGuideProps) {
  const guideKey = `${type}_${level}`
  const guide = guides[guideKey] || guides[`${type}_B1`] || null

  const typeLabels: Record<string, string> = {
    email_formal: "Email formale",
    email_informal: "Email informale",
    narrativo: "Testo narrativo",
    descriptivo: "Testo descrittivo",
    argumentativo: "Testo argomentativo",
    reclamo: "Reclamo",
    articulo: "Articolo di opinione",
    libre: "Scrittura libera"
  }

  if (!guide) {
    return (
      <Card className="border-dashed border-gray-200 bg-gray-50/50">
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Seleziona un tipo di testo per vedere suggerimenti di scrittura</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="bg-primary/5 pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-primary-dark">
            < BookOpen className="h-5 w-5" />
            Guida per {typeLabels[type] || type} ({level})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <section>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
              <ListChecks className="h-4 w-4 text-primary" />
              Struttura consigliata
            </h4>
            <ul className="space-y-2">
              {guide.structure.map((item, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
              <Lightbulb className="h-4 w-4 text-accent" />
              Connettori utili
            </h4>
            <div className="flex flex-wrap gap-2">
              {guide.connectors.map((item, i) => (
                <Badge key={i} variant="secondary" className="bg-cream border-accent/20 text-gray-700 font-medium italic">
                  {item}
                </Badge>
              ))}
            </div>
          </section>

          <section>
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
              <AlertTriangle className="h-4 w-4 text-secondary" />
              Errori comuni da evitare
            </h4>
            <ul className="space-y-2">
              {guide.commonErrors.map((item, i) => (
                <li key={i} className="text-xs text-secondary-dark flex items-start gap-2 bg-secondary/5 p-2 rounded-lg">
                  <span className="font-bold shrink-0">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-accent-dark mb-1">Pro-tip dell&apos;esaminatore</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Prova a variare l&apos;inizio delle tue frasi e usa sinonimi per non ripetere parole base come &quot;fare&quot; o &quot;andare&quot;.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
