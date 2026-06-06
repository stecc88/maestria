"use client"

import { motion } from "framer-motion"
import {
  GraduationCap,
  BarChart3,
  BookOpen,
  Users,
  Trophy,
  LineChart
} from "lucide-react"

const features = [
  {
    title: "Correzione intelligente",
    description: "L'IA valuta il tuo scritto secondo i più esigenti standard internazionali di italiano",
    icon: GraduationCap
  },
  {
    title: "Il tuo livello esatto",
    description: "Dopo ogni scritto saprai esattamente a che livello sei: A1, A2, B1, B2, C1 o C2",
    icon: BarChart3
  },
  {
    title: "Guide alla scrittura",
    description: "Impara a strutturare email, narrazioni e testi argomentativi in base al tuo livello",
    icon: BookOpen
  },
  {
    title: "Compiti dell'insegnante",
    description: "Il tuo insegnante genera esercizi personalizzati basati sui TUOI errori specifici",
    icon: Users
  },
  {
    title: "Classifica e sfide",
    description: "Competi con i tuoi compagni, guadagna punti e scala la classifica settimanale",
    icon: Trophy
  },
  {
    title: "Segui il tuo progresso",
    description: "Grafici visivi che mostrano come migliori ogni settimana",
    icon: LineChart
  }
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Tutto ciò di cui hai bisogno per progredire
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-primary/5 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-display font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
