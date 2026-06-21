"use client"

import { motion } from "framer-motion"
import { Sparkles, PenLine, Cpu, MessageCircle, Target, Trophy } from "lucide-react"

const steps = [
  {
    icon: Target,
    title: "Iscrizione Semplice",
    text: "Registrati con il codice del tuo docente o come studente libero in pochi secondi.",
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    icon: PenLine,
    title: "Libera la tua Penna",
    text: "Scrivi un testo libero o segui le tracce proposte per il tuo livello QCER.",
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    icon: Cpu,
    title: "Analisi Neurale",
    text: "L'IA analizza coerenza, lessico e grammatica seguendo gli standard internazionali.",
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    icon: MessageCircle,
    title: "Feedback Immediato",
    text: "Ricevi subito consigli pedagogici, correzioni inline e la tua valutazione in centesimi.",
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    icon: Sparkles,
    title: "Esercizi Mirati",
    text: "Il tuo docente riceve i dati e genera compiti basati sui tuoi errori reali.",
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    icon: Trophy,
    title: "Scala la Vetta",
    text: "Guadagna XP, sblocca obiettivi e diventa el numero uno della Hall of Fame.",
    color: "text-primary",
    bg: "bg-primary/10"
  }
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-32 bg-gray-50/50 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute top-0 right-0 p-32 opacity-5 pointer-events-none">
         <Sparkles className="h-96 w-96 text-primary" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            <Target className="h-4 w-4" /> Flusso di Apprendimento
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
            Come <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Funziona</span>
          </h2>
          <p className="text-muted-foreground font-bold text-lg max-w-2xl mx-auto">
            Un ciclo continuo di scrittura, analisi e miglioramento progettato per portarti all&apos;eccellenza linguistica.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent -translate-y-1/2 hidden lg:block -z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative z-10"
            >
              <div className="group bg-card p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-white hover:border-primary/20 transition-all duration-500 h-full">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 ${step.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}>
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <div className="flex-1 h-px bg-muted" />
                  <span className="text-4xl font-black text-gray-100 group-hover:text-primary/10 transition-colors">0{i + 1}</span>
                </div>

                <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  {step.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks;
