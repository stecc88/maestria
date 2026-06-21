"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, ArrowRight, GraduationCap } from "lucide-react"

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
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20 mb-8"
            >
              <Sparkles className="h-5 w-5 fill-primary" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">L&apos;italiano non è mai stato così semplice</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter text-gray-900"
            >
              Domina <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient">l&apos;italiano.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-500 font-bold mb-12 max-w-xl leading-relaxed"
            >
              L&apos;IA che corregge i tuoi testi come un esaminatore professionista, rileva il tuo livello <span className="text-gray-900 font-black">A1-C2</span> e crea un piano su misura.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-5 mb-12"
            >
              <Link href="/register">
                <Button className="bg-gray-900 hover:bg-black text-white text-lg px-10 py-8 h-auto rounded-[1.5rem] shadow-2xl shadow-gray-900/20 relative group overflow-hidden transition-all border-none">
                  <span className="relative z-10 font-black uppercase tracking-widest">Inizia ora — gratis</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Button>
              </Link>
              <Link href="#teachers">
                <Button variant="ghost" className="text-lg px-10 py-8 h-auto font-black uppercase tracking-widest hover:bg-primary/5 transition-colors flex items-center gap-2">
                  Sono un docente <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8"
            >
              {[
                "Nessuna carta",
                "Livelli A1-C2",
                "Certificazioni CILS"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm font-black text-gray-400 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            {/* Animated Flag */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -top-12 -right-8 text-7xl z-20 drop-shadow-2xl"
            >
              🇮🇹
            </motion.div>

            {/* Document Decoration */}
            <div className="relative bg-white rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-10 md:p-12 border border-gray-50 min-h-[450px] overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-accent/5 opacity-50" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                   </div>
                   <div className="h-3 w-32 bg-gray-100 rounded-full animate-pulse" />
                </div>

                <div className="space-y-4">
                  <p className="text-gray-800 text-xl md:text-2xl font-medium leading-relaxed italic">
                    Caro professore, <br />
                    Ti scrivo per <span className="relative inline-block text-secondary font-black">
                      ringrazziarti
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 2, duration: 0.5 }}
                        className="absolute bottom-0 left-0 h-1 bg-secondary rounded-full"
                      />
                    </span> della lezione di ieri. Mi è
                    <span className="relative inline-block ml-2 text-primary font-black">
                      piaciuto
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 3, duration: 0.5 }}
                        className="absolute bottom-0 left-0 h-1 bg-primary rounded-full"
                      />
                    </span> molto il tema dell&apos;arte.
                  </p>
                </div>

                {/* Correction Bubbles */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.5 }}
                  className="absolute right-[-10px] top-[140px] bg-gray-900 text-white p-5 rounded-2xl text-xs font-black shadow-2xl max-w-[180px] border border-white/10"
                >
                   <span className="text-secondary mb-1 block">CORREZIONE:</span>
                   &quot;ringraziarti&quot; (una sola &apos;z&apos;)
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 3.5 }}
                  className="absolute left-[-10px] bottom-[80px] bg-white text-gray-900 p-5 rounded-2xl text-xs font-black shadow-2xl max-w-[200px] border border-gray-100"
                >
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-primary">LIVELLO B1</span>
                   </div>
                   Consiglio: usa il congiuntivo per elevare il registro.
                </motion.div>

                <div className="pt-12 space-y-3">
                  <div className="h-3 w-full bg-gray-50 rounded-full animate-pulse delay-75" />
                  <div className="h-3 w-5/6 bg-gray-50 rounded-full animate-pulse delay-100" />
                  <div className="h-3 w-4/6 bg-gray-50 rounded-full animate-pulse delay-150" />
                </div>
              </div>

              {/* Floating Decoration */}
              <div className="absolute -bottom-20 -right-20 bg-accent w-64 h-64 rounded-full blur-[100px] opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-700" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
