"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Flame } from "lucide-react"

interface WelcomeCardProps {
  name: string
  targetLevel: string
  currentLevel?: string
  streak: number
  xp: number
}

export function WelcomeCard({ name, targetLevel, currentLevel, streak, xp }: WelcomeCardProps) {
  const nextLevelXp = 1000 // Placeholder
  const progress = (xp / nextLevelXp) * 100

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl">
      <CardContent className="p-8 relative">
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Benvenuto, {name.split(' ')[0]}! 🇮🇹
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
                <span className="text-sm font-medium">Nivel objetivo:</span>
                <Badge className="bg-accent text-white border-none">{targetLevel}</Badge>
              </div>
              {currentLevel && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1">
                  <span className="text-sm font-medium">Nivel actual:</span>
                  <Badge className="bg-blue-500 text-white border-none">{currentLevel}</Badge>
                </div>
              )}
              <div className="flex items-center gap-2 bg-secondary/80 backdrop-blur-sm rounded-full px-4 py-1">
                <Flame className="h-4 w-4 fill-white" />
                <span className="text-sm font-bold">{streak} días consecutivos</span>
              </div>
            </div>

            <div className="max-w-md space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span>Progreso al siguiente nivel</span>
                <span>{xp} / {nextLevelXp} XP</span>
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <div className="text-9xl font-display font-bold">IT</div>
        </div>
      </CardContent>
    </Card>
  )
}
