"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Achievement {
  id: string
  title: string
  icon: string
  description: string
  unlocked: boolean
}

const ALL_ACHIEVEMENTS = [
  { id: 'first_step', title: 'Primo passo', icon: '🎯', description: 'Hai inviato il tuo primo testo' },
  { id: 'on_fire', title: 'In fiamme', icon: '🔥', description: '7 giorni di striscia' },
  { id: 'studious', title: 'Studioso/a', icon: '📚', description: '10 testi inviati' },
  { id: 'perseverant', title: 'Perseverante', icon: '💪', description: '25 testi inviati' },
  { id: 'excellence', title: 'Eccellenza', icon: '⭐', description: 'Hai ottenuto 90+ in un testo' },
  { id: 'ascending', title: 'In ascesa', icon: '🚀', description: 'Sei salito di 2 livelli in un mese' },
  { id: 'podium', title: 'Top 3', icon: '👑', description: 'Sei arrivato sul podio' },
  { id: 'champion', title: 'Campione/essa', icon: '🏆', description: 'Sei arrivato al primo posto' },
  { id: 'applied', title: 'Applicato/a', icon: '✅', description: 'Hai completato 10 compiti' },
  { id: 'master', title: 'Maestro/a', icon: '🎓', description: 'Hai raggiunto il tuo livello obiettivo' },
]

interface AchievementsGridProps {
  unlockedIds: string[]
}

export function AchievementsGrid({ unlockedIds }: AchievementsGridProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Traguardi</h3>
         <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
           {unlockedIds.length} / {ALL_ACHIEVEMENTS.length} Sbloccati
         </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {ALL_ACHIEVEMENTS.map((achievement, i) => {
          const isUnlocked = unlockedIds.includes(achievement.id)

          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="relative group"
            >
              <Card className={cn(
                "h-full border-2 transition-all duration-500 overflow-hidden",
                isUnlocked
                  ? "bg-gray-800 border-accent/30 shadow-[0_0_20px_rgba(245,166,35,0.1)] hover:scale-105"
                  : "bg-gray-900/50 border-white/5 opacity-40"
              )}>
                <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                  <div className={cn(
                    "text-4xl filter drop-shadow-md mb-1",
                    isUnlocked ? "grayscale-0" : "grayscale grayscale-100 opacity-50"
                  )}>
                    {achievement.icon}
                  </div>
                  <div>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-tighter leading-none mb-1",
                      isUnlocked ? "text-accent" : "text-gray-600"
                    )}>
                      {achievement.title}
                    </p>
                    <p className="text-[9px] text-gray-500 font-medium leading-tight">
                      {achievement.description}
                    </p>
                  </div>

                  {isUnlocked && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                       <div className="absolute top-[-100%] left-[-100%] w-[50%] h-[300%] bg-white/10 rotate-[25deg] group-hover:translate-x-[500%] transition-transform duration-1000" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
