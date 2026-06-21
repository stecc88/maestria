"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Trophy } from "lucide-react"
import { getLevelFromXP } from "@/lib/utils/levels"

interface RankingHeaderProps {
  rank: number
  xp: number
  xpToNext: number
}

export function RankingHeader({ rank, xp, xpToNext }: RankingHeaderProps) {
  const { current, next, progress } = getLevelFromXP(xp)

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary/20 border-gray-800 text-white overflow-hidden relative group">
      <CardContent className="p-8 md:p-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-center md:justify-start gap-4"
            >
              <div className="text-6xl md:text-8xl font-display font-black text-white/10 absolute -top-4 -left-4 pointer-events-none">
                #{rank}
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Posizione in classifica</p>
                <h2 className="text-5xl md:text-7xl font-display font-black text-white mt-1">
                  #{rank}
                </h2>
              </div>
            </motion.div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Badge className="bg-primary text-white border-none py-1.5 px-4 text-sm font-bold gap-2">
                <Sparkles className="h-4 w-4" /> {xp} XP
              </Badge>
              <Badge variant="outline" className="border-accent text-accent font-bold py-1.5 px-4 text-sm gap-2">
                {current.badge} {current.name}
              </Badge>
            </div>
          </div>

          <div className="w-full md:w-80 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase">Prossimo livello</p>
                 <p className="text-lg font-bold text-accent">{next?.name || 'Maestro'}</p>
              </div>
              <p className="text-xs font-bold text-gray-400">+{xpToNext} XP per salire</p>
            </div>

            <div className="space-y-2">
              <div className="relative h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_rgba(245,166,35,0.5)]"
                />
              </div>
              <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                <span>{current.minXp} XP</span>
                <span>{next?.minXp || 'MAX'} XP</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Background Decorative */}
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Trophy className="h-40 w-48 text-white" />
      </div>
    </Card>
  )
}
