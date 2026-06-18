"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"

const levels = [
  {
    id: "A1",
    name: "Principiante",
    description: "Prime parole e frasi elementari per iniziare el tuo viaggio.",
    gradient: "from-gray-400 to-gray-600",
    bg: "bg-gray-50"
  },
  {
    id: "A2",
    name: "Elementare",
    description: "Messaggi brevi e conversazioni semplici di vita quotidiana.",
    gradient: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50/50"
  },
  {
    id: "B1",
    name: "Intermedio",
    description: "Gestione autonoma di situazioni comuni e viaggi in Italia.",
    gradient: "from-blue-400 to-blue-600",
    bg: "bg-blue-50/50"
  },
  {
    id: "B2",
    name: "Intermedio Superiore",
    description: "Testi complessi e discussioni su temi astratti o tecnici.",
    gradient: "from-purple-400 to-purple-600",
    bg: "bg-purple-50/50"
  },
  {
    id: "C1",
    name: "Avanzato",
    description: "Espressione fluida, precisa e naturale in contesti sociali o professionali.",
    gradient: "from-orange-400 to-orange-600",
    bg: "bg-orange-50/50"
  },
  {
    id: "C2",
    name: "Padronanza",
    description: "Dominio totale della lingua, comprendendo sfumature e registri elevati.",
    gradient: "from-red-400 to-red-600",
    bg: "bg-red-50/50"
  }
]

export default function Levels() {
  return (
    <section id="levels" className="py-32 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4" /> Quadro Comune Europeo
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
            Percorso <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Personalizzato</span>
          </h2>
          <p className="text-gray-500 font-bold text-lg max-w-2xl mx-auto">
            La nostra IA analizza i tuoi testi per determinare el tuo livello QCER esatto e aiutarti a salire verso la padronanza.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8 }}
              className={cn(
                "group relative p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden transition-all duration-500",
                level.bg
              )}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`, ...({ '--tw-gradient-from': level.gradient.split(' ')[0].replace('from-', ''), '--tw-gradient-to': level.gradient.split(' ')[1].replace('to-', '') } as any) }} />

              <div className="flex items-center justify-between mb-8">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg bg-gradient-to-br", level.gradient)}>
                  {level.id}
                </div>
                <div className="h-px flex-1 mx-6 bg-gray-200 group-hover:bg-primary/20 transition-colors" />
                <Sparkles className="h-5 w-5 text-gray-200 group-hover:text-accent transition-colors" />
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
                {level.name}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {level.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
