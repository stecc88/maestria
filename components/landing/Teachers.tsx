"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Users } from "lucide-react"

export default function Teachers() {
  const features = [
    "Codice unico per l'iscrizione dei tuoi studenti con te",
    "Pannello di controllo con l'evoluzione individuale di ogni studente",
    "Generazione di compiti personalizzati con IA in pochi secondi",
    "Notifiche quando uno studente completa un compito"
  ]

  return (
    <section id="teachers" className="py-24 bg-primary-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Per insegnanti di italiano
            </h2>
            <p className="text-xl text-white/80 font-body mb-10 leading-relaxed">
              Gestisci la tua classe, monitora l&apos;evoluzione di ogni studente e genera compiti con l&apos;IA in un clic.
            </p>

            <div className="space-y-4 mb-10">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                  <span className="font-body text-lg">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="/register">
              <Button className="bg-white text-primary-dark hover:bg-cream text-lg px-8 py-6 h-auto font-body font-bold transition-all shadow-xl btn-shiny">
                <span className="relative z-10 text-primary-dark">Registrati come insegnante &rarr;</span>
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 aspect-video flex items-center justify-center">
               <div className="text-center">
                 <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center">
                   <Users className="w-10 h-10 text-white" />
                 </div>
                 <p className="font-display text-2xl font-bold">Pannello di Controllo</p>
                 <p className="font-body text-white/60">Monitoraggio in tempo reale</p>
               </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full blur-3xl opacity-30" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent rounded-full blur-3xl opacity-20" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
