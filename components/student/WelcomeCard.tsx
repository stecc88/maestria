"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getLevelFromXP } from "@/lib/utils/levels"

interface WelcomeCardProps {
  name: string
  targetLevel: string
  currentLevel?: string
  streak: number
  xp: number
}

const LEVEL_COLORS: Record<string, string> = {
  "A1": "bg-gray-500",
  "A2": "bg-emerald-500",
  "B1": "bg-blue-500",
  "B2": "bg-purple-500",
  "C1": "bg-orange-500",
  "C2": "bg-red-500",
}

/**
 * Header compacto del dashboard. Antes era una card gigante con saludo,
 * 3 chips informativos, barra de XP y CTA — mucha carga visual para ser
 * lo primero que ve el alumno. Ahora es una sola fila: identidad + progreso
 * de nivel + acción principal, sin información duplicada con StatsCards.
 */
export function WelcomeCard({ name, targetLevel, currentLevel = "A1", streak, xp }: WelcomeCardProps) {
  const levelInfo = getLevelFromXP(xp)
  const nextLevelXp = levelInfo.next ? levelInfo.next.minXp : levelInfo.current.minXp
  const progress = levelInfo.progress
  const firstName = name.split(' ')[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border rounded-3xl p-6 premium-shadow"
    >
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
          Ciao, {firstName} 👋
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge className={cn("font-black border-none text-white", LEVEL_COLORS[currentLevel] || "bg-blue-500")}>
            {currentLevel}
          </Badge>
          <span className="text-xs text-muted-foreground font-bold">→ obiettivo</span>
          <Badge variant="outline" className={cn("font-black border-2", LEVEL_COLORS[targetLevel] || "bg-primary")}>
            {targetLevel}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
        <div className="flex-1 min-w-[180px] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground">
            <span>{levelInfo.current.name}</span>
            <span>{xp}/{nextLevelXp} XP</span>
          </div>
          <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        <Link href="/student/write">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto h-full bg-foreground text-background font-black px-6 py-3 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg transition-all hover-pop"
          >
            <Sparkles className="h-4 w-4" />
            Scrivi ora
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}
