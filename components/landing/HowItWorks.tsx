"use client"

import { motion } from "framer-motion"

const steps = [
  {
    number: "1️⃣",
    text: "Registrate con el código de tu profesor (o como alumno libre)"
  },
  {
    number: "2️⃣",
    text: "Escribí tu texto en italiano"
  },
  {
    number: "3️⃣",
    text: "La IA lo analiza según criterios internacionales de evaluación"
  },
  {
    number: "4️⃣",
    text: "Recibís feedback detallado: fortalezas, errores y sugerencias"
  },
  {
    number: "5️⃣",
    text: "Tu profesor genera ejercicios basados en tus errores reales"
  },
  {
    number: "6️⃣",
    text: "¡Mejorás, ganás puntos y subís en el ranking!"
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
            Cómo funciona
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
