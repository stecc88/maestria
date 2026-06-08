"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame, Sparkles, Target, Zap } from "lucide-react"

interface WelcomeCardProps {
  name: string
  targetLevel: string
  currentLevel?: string
  streak: number
  xp: number
}

export function WelcomeCard({ name, targetLevel, currentLevel, streak, xp }: WelcomeCardProps) {
  const nextLevelXp = 1000
  const progress = (xp / nextLevelXp) * 100

  return (
    <Card className="overflow-hidden border-none bg-white premium-shadow relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

      <CardContent className="p-6 md:p-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2 tracking-tight">
                Bentornato, {name.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
                Continua il tuo percorso verso la padronanza dell&apos;italiano. Oggi è un ottimo giorno per scrivere.
              </p>
            </motion.div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Obiettivo:</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">{targetLevel}</Badge>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Attuale:</span>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold">{currentLevel || 'A1'}</Badge>
              </div>
              <div className="flex items-center gap-2 bg-secondary/5 border border-secondary/10 rounded-xl px-4 py-2">
                <Flame className="h-4 w-4 text-secondary fill-secondary" />
                <span className="text-xs font-black text-secondary uppercase tracking-widest">{streak} Giorni</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-gray-100 lg:pl-10">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Prossimo livello</span>
                 </div>
                 <span className="text-sm font-bold text-gray-900">{xp} <span className="text-gray-300">/</span> {nextLevelXp} XP</span>
              </div>

              <div className="space-y-2">
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] text-center">
                  Ti mancano {nextLevelXp - xp} XP per diventare un <span className="text-primary font-black">Praticante</span>
                </p>
              </div>

              <div className="pt-2">
                 <button className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-black/10 text-sm">
                    Inizia a scrivere ora
                 </button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating background element */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.03] pointer-events-none select-none overflow-hidden">
           <span className="text-[12rem] font-display font-black leading-none italic">IT</span>
        </div>
      </CardContent>
    </Card>
  )
}
