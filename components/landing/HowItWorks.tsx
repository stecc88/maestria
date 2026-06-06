"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "1️⃣",
    text: "Registrati con il codice del tuo insegnante (o come studente libero)"
  },
  {
    number: "2️⃣",
    text: "Scrivi il tuo testo in italiano"
  },
  {
    number: "3️⃣",
    text: "L'IA lo analizza secondo i criteri internazionali di valutazione"
  },
  {
    number: "4️⃣",
    text: "Ricevi un feedback dettagliato: punti di forza, errori e suggerimenti"
  },
  {
    number: "5️⃣",
    text: "Il tuo insegnante genera esercizi basati sui tuoi errori reali"
  },
  {
    number: "6️⃣",
    text: "Migliori, guadagni punti e scali la classifica!"
  }
]

export default function HowItWorks() {
  return (
    <section className="py-24 bg-cream overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Come funziona
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-6 relative"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl z-10 shadow-sm border border-primary/10">
                  {step.number}
                </div>
                <div className="pt-2">
                  <p className="text-xl font-body font-medium text-foreground leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
