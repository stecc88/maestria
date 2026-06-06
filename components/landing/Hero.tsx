"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6"
            >
              Domina l&apos;italiano. <br />
              <span className="text-primary text-4xl md:text-6xl">Un testo alla volta.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground font-body mb-10 max-w-lg"
            >
              L&apos;IA che corregge i tuoi scritti come un esaminatore professionista, rileva il tuo livello da A1 a C2 e crea un piano personalizzato per migliorare ogni giorno.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary-dark text-white text-lg px-8 py-6 h-auto shadow-xl shadow-primary/20 relative group overflow-hidden transition-all">
                  <span className="relative z-10 font-body font-bold">Inizia ora — è gratis</span>
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-[-20deg]" />
                </Button>
              </Link>
              <Link href="#teachers">
                <Button variant="ghost" className="text-lg px-8 py-6 h-auto font-body font-medium hover:bg-primary/5 transition-colors">
                  Sono un insegnante &rarr;
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-6"
            >
              {[
                "Nessuna carta di credito",
                "Livelli A1-C2",
                "Per studenti e insegnanti"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-body text-secondary font-medium">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <div className="relative">
            {/* Animated Flag */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-10 -right-4 text-5xl z-20"
            >
              🇮🇹
            </motion.div>

            {/* Document Decoration */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-primary/5 min-h-[400px]">
              <div className="space-y-4 font-body">
                <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
                <div className="space-y-2">
                  <p className="text-foreground leading-relaxed">
                    Caro professore, <br />
                    Ti scrivo per <span className="relative inline-block">
                      ringrazziarti
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-secondary"
                      />
                    </span> della lezione di ieri. Mi è
                    <span className="relative inline-block ml-1">
                      piaciuto
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 2, duration: 0.5 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-secondary"
                      />
                    </span> molto il tema dell&apos;arte.
                  </p>
                </div>

                {/* Correction Bubbles */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="absolute right-[-20px] top-[100px] bg-secondary text-white p-3 rounded-lg text-xs shadow-lg max-w-[150px]"
                >
                   &quot;ringraziarti&quot; (una sola &apos;z&apos;)
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.5 }}
                  className="absolute left-[-20px] bottom-[100px] bg-primary text-white p-3 rounded-lg text-xs shadow-lg max-w-[150px]"
                >
                   Livello rilevato: B1. Consiglio: usa il congiuntivo.
                </motion.div>

                <div className="h-4 w-full bg-muted rounded animate-pulse delay-75" />
                <div className="h-4 w-5/6 bg-muted rounded animate-pulse delay-100" />
                <div className="h-4 w-4/6 bg-muted rounded animate-pulse delay-150" />
              </div>

              {/* Floating Decoration */}
              <div className="absolute -bottom-6 -right-6 bg-accent w-24 h-24 rounded-full blur-3xl opacity-20 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
