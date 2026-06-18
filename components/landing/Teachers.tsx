"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Users, ArrowRight, Sparkles } from "lucide-react"

export default function Teachers() {
  const features = [
    "Codice classe univoco per i tuoi studenti",
    "Monitoraggio evoluzione individuale in tempo reale",
    "Generazione esercizi con IA basata sugli errori comuni",
    "Report dettagliati su competenze e aree di miglioramento"
  ]

  return (
    <section id="teachers" className="py-32 bg-gray-900 text-white overflow-hidden relative">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 text-white px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Pannello Docenti</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
              Strumenti Avanzati per <span className="text-primary italic">Professionisti</span> della Lingua
            </h2>

            <p className="text-xl text-gray-400 font-bold leading-relaxed max-w-xl">
              Gestisci la tua classe con precisione chirurgica. Lascia che l&apos;IA si occupi dell&apos;analisi tecnica, mentre tu ti concentri sulla crescita dei tuoi studenti.
            </p>

            <div className="space-y-5">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-medium text-gray-200">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="pt-6">
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary-dark text-white text-lg px-10 py-8 h-auto rounded-[1.5rem] font-black uppercase tracking-widest transition-all shadow-2xl shadow-primary/20 group border-none">
                  <span className="relative z-10 flex items-center gap-3">
                    DIVENTA UN DOCENTE <ArrowRight className="h-5 w-5" />
                  </span>
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.4)] overflow-hidden group">
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

               <div className="relative z-10 space-y-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-black tracking-widest text-xs">DASHBOARD DOCENTE</span>
                    </div>
                    <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-8 w-8 rounded-full border-2 border-gray-900 bg-gray-800" />
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-32 bg-white/5 rounded-[1.5rem] border border-white/5 p-6 space-y-4">
                       <div className="h-2 w-12 bg-primary/40 rounded-full" />
                       <div className="h-8 w-20 bg-white/10 rounded-lg" />
                    </div>
                    <div className="h-32 bg-white/5 rounded-[1.5rem] border border-white/5 p-6 space-y-4">
                       <div className="h-2 w-12 bg-blue-500/40 rounded-full" />
                       <div className="h-8 w-20 bg-white/10 rounded-lg" />
                    </div>
                  </div>

                  <div className="h-48 bg-white/5 rounded-[2rem] border border-white/5 p-8 flex items-center justify-center">
                     <div className="text-center space-y-3">
                        <Users className="h-10 w-10 text-gray-500 mx-auto" />
                        <p className="text-xs font-black text-gray-500 tracking-[0.2em] uppercase">Monitoraggio Attivo</p>
                     </div>
                  </div>
               </div>

               {/* Decorative Pulse */}
               <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-pulse" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
