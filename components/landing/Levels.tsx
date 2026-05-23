"use client"

import { motion } from "framer-motion"

const levels = [
  {
    id: "A1",
    name: "Principiante",
    description: "Primeras palabras y oraciones básicas",
    color: "bg-gray-100",
    textColor: "text-gray-600",
    borderColor: "border-gray-200"
  },
  {
    id: "A2",
    name: "Básico",
    description: "Mensajes cortos y conversaciones simples",
    color: "bg-green-100",
    textColor: "text-green-700",
    borderColor: "border-green-200"
  },
  {
    id: "B1",
    name: "Intermedio",
    description: "Me desenvuelvo en situaciones cotidianas",
    color: "bg-blue-100",
    textColor: "text-blue-700",
    borderColor: "border-blue-200"
  },
  {
    id: "B2",
    name: "Intermedio alto",
    description: "Textos complejos y discusiones",
    color: "bg-orange-100",
    textColor: "text-orange-700",
    borderColor: "border-orange-200"
  },
  {
    id: "C1",
    name: "Avanzado",
    description: "Casi nativo, expresión precisa",
    color: "bg-purple-100",
    textColor: "text-purple-700",
    borderColor: "border-purple-200"
  },
  {
    id: "C2",
    name: "Maestría",
    description: "Dominio total del idioma",
    color: "bg-yellow-100",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200"
  }
]

export default function Levels() {
  return (
    <section id="levels" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            ¿En qué nivel estás?
          </h2>
          <div className="w-24 h-1 bg-accent rounded-full" />
        </motion.div>

        <div className="space-y-4">
          {levels.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
              className={`flex flex-col md:flex-row items-center p-6 rounded-2xl border ${level.borderColor} ${level.color} transition-all hover:scale-[1.01] hover:shadow-md`}
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 md:mb-0 md:mr-8">
                <span className={`text-2xl font-display font-bold ${level.textColor}`}>
                  {level.id}
                </span>
              </div>
              <div className="text-center md:text-left flex-grow">
                <h3 className={`text-xl font-display font-bold mb-1 ${level.textColor}`}>
                  {level.name}
                </h3>
                <p className="font-body text-foreground/80">
                  {level.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
