"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, Clock, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

const CHALLENGES = [
  { id: 1, title: 'Enviá 3 textos esta semana', current: 1, target: 3, reward: 150 },
  { id: 2, title: 'Completá 2 tareas esta semana', current: 0, target: 2, reward: 100 },
  { id: 3, title: 'Conseguí 80+ en un texto', current: 0, target: 1, reward: 200 },
]

export function WeeklyChallenges() {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
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
    <Card className="bg-gray-900 border-gray-800 text-white shadow-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent fill-accent" />
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Desafíos semanales</h3>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase">
             <Clock className="h-3 w-3" />
             Faltan {timeLeft}
          </div>
        </div>

        <div className="space-y-6">
          {CHALLENGES.map((challenge) => {
            const progress = (challenge.current / challenge.target) * 100
            const isCompleted = challenge.current >= challenge.target

            return (
              <div key={challenge.id} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-200">{challenge.title}</p>
                    <p className="text-xs font-black text-primary mt-0.5">+{challenge.reward} XP Recompensa</p>
                  </div>
                  <span className="text-xs font-black text-gray-500">{challenge.current} / {challenge.target}</span>
                </div>

                <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <motion.div
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     className="absolute inset-y-0 left-0 bg-primary"
                   />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
