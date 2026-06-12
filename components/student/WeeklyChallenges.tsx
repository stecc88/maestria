"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Clock, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

const CHALLENGES = [
  { id: 1, title: 'Invia 3 testi questa settimana', current: 1, target: 3, reward: 150 },
  { id: 2, title: 'Completa 2 compiti questa settimana', current: 0, target: 2, reward: 100 },
  { id: 3, title: 'Ottieni 80+ in un testo', current: 0, target: 1, reward: 200 },
]

import { cn } from "@/lib/utils"

export function WeeklyChallenges() {
  const [timeLeft, setTimeLeft] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const updateCountdown = () => {
      const now = new Date()
      const nextMonday = new Date()
      nextMonday.setDate(now.getDate() + ((7 - now.getDay()) % 7 || 7))
      nextMonday.setHours(0, 0, 0, 0)

      const diff = nextMonday.getTime() - now.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)

      setTimeLeft(`${days}d ${hours}h ${minutes}m`)
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 60000)
    return () => clearInterval(timer)
  }, [])

  return (
    <Card className="bg-white/[0.02] border-white/5 text-white shadow-2xl rounded-[2rem] overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-accent/10 rounded-xl">
               <Zap className="h-5 w-5 text-accent fill-accent" />
            </div>
            <h3 className="font-display font-bold text-xl text-white">Sfide Settimanali</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest border border-white/5 min-w-[120px] justify-center">
             <Clock className="h-3.5 w-3.5" />
             Scade in: {mounted ? timeLeft : "..."}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CHALLENGES.map((challenge) => {
            const progress = (challenge.current / challenge.target) * 100
            const isCompleted = challenge.current >= challenge.target

            return (
              <div key={challenge.id} className="w-full flex items-center justify-between gap-6 bg-white/[0.03] p-5 rounded-2xl border border-white/5 transition-all hover:bg-white/[0.05] group">
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-100 leading-tight group-hover:text-white transition-colors">{challenge.title}</p>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">+{challenge.reward} XP Bonus</p>
                  </div>

                  <div className="space-y-2 max-w-xs">
                    <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                        <span>Progresso</span>
                        <span className={isCompleted ? "text-primary" : ""}>{challenge.current} / {challenge.target}</span>
                    </div>
                    <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_10px_rgba(0,146,70,0.3)]"
                        />
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                  isCompleted ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/5 text-gray-600"
                )}>
                  {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Zap className="h-5 w-5 opacity-20" />}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
