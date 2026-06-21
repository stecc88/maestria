"use client"

import { motion } from "framer-motion"
import {
  GraduationCap,
  BarChart3,
  BookOpen,
  Users,
  Trophy,
  LineChart,
  Sparkles
} from "lucide-react"

const features = [
  {
    title: "Correzione Intelligente",
    description: "L'IA valuta i tuoi testi secondo i più esigenti standard internazionali (CILS/CELI).",
    icon: GraduationCap,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    title: "Livello QCER Esatto",
    description: "Saprai esattamente se il tuo scritto è A1, B2 o C2 grazie al nostro motore neurale.",
    icon: BarChart3,
    color: "text-blue-500",
    bg: "bg-blue-50"
  },
  {
    title: "Guide ai Generi",
    description: "Impara a scrivere email formali, saggi e narrazioni con modelli pronti all'uso.",
    icon: BookOpen,
    color: "text-purple-500",
    bg: "bg-purple-50"
  },
  {
    title: "Supporto Docenti",
    description: "Ricevi compiti mirati dal tuo insegnante per superare le tue lacune specifiche.",
    icon: Users,
    color: "text-orange-500",
    bg: "bg-orange-50"
  },
  {
    title: "Gamification",
    description: "Scala la Hall of Fame, guadagna XP e sblocca trofei mentre impari l'italiano.",
    icon: Trophy,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    title: "Analytics Avanzate",
    description: "Monitora i tuoi progressi nel tempo con grafici dettagliati sulla tua evoluzione.",
    icon: LineChart,
    color: "text-primary",
    bg: "bg-primary/10"
  }
]

export default function Features() {
  return (
    <section id="features" className="py-32 bg-card relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" /> Innovazione Didattica
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tight">
            Tutto per la tua <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Eccellenza</span>
          </h2>
          <p className="text-muted-foreground font-bold text-lg max-w-2xl mx-auto">
            Abbiamo unito la potenza dell&apos;intelligenza artificiale con la pedagogia italiana per offrirti un&apos;esperienza di apprendimento senza precedenti.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-card p-10 rounded-[2.5rem] shadow-xl shadow-gray-100/50 border border-gray-50 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-[0.03] transition-opacity">
                 <feature.icon className="h-32 w-32" />
              </div>

              <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-inner`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black mb-4 text-foreground tracking-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px]" />
      </div>
    </section>
  )
}
