"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CorrectionHeaderProps {
  level: string
  targetLevel: string
  score: number
  examCompliant: boolean
  xpEarned: number
}

const levelColors: Record<string, string> = {
  A1: "bg-gray-400 shadow-gray-200",
  A2: "bg-green-400 shadow-green-200",
  B1: "bg-blue-500 shadow-blue-200",
  B2: "bg-orange-500 shadow-orange-200",
  C1: "bg-purple-600 shadow-purple-200",
  C2: "bg-yellow-500 shadow-yellow-200",
}

export function CorrectionHeader({ level, targetLevel, score, examCompliant, xpEarned }: CorrectionHeaderProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = score
    if (start === end) return
    let timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, 20)
    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="relative bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm overflow-hidden">
      {/* Diagonal Watermark Stamp */}
      <motion.div
        initial={{ scale: 2, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 0.08, rotate: -20 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="absolute -right-10 -top-10 md:right-10 md:top-10 pointer-events-none select-none z-0"
      >
        <div className={cn(
          "border-[12px] p-6 md:p-10 rounded-3xl",
          examCompliant ? "border-primary text-primary" : "border-secondary text-secondary"
        )}>
          <span className="text-7xl md:text-9xl font-display font-black uppercase tracking-tighter">
            {examCompliant ? "Approvato" : "Da Rivedere"}
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
        {/* Left: Level Badge */}
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "text-white text-6xl font-display font-bold w-32 h-32 flex items-center justify-center rounded-3xl shadow-2xl transition-all",
              levelColors[level] || "bg-gray-400"
            )}
          >
            {level}
          </motion.div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Livello Rilevato</p>
            <h2 className="text-3xl font-display font-bold text-gray-900 leading-none">Valutazione Finale</h2>
            <div className="flex flex-wrap gap-2 mt-4">
              {examCompliant ? (
                <Badge className="bg-primary/10 text-primary border-none gap-1.5 px-4 py-1.5 rounded-full font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Conforme
                </Badge>
              ) : (
                <Badge className="bg-secondary/10 text-secondary border-none gap-1.5 px-4 py-1.5 rounded-full font-bold">
                  <AlertCircle className="h-4 w-4" /> Da migliorare
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Center: Large Score */}
        <div className="flex flex-col items-center md:items-start justify-center">
            <div className="flex items-baseline">
                <span className="text-8xl md:text-9xl font-display font-black text-gray-900 tracking-tighter">{count}</span>
                <span className="text-2xl md:text-3xl font-bold text-gray-300 ml-2">/100</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-[-10px] md:ml-2">Punteggio Globale</p>
        </div>

        {/* Right: XP Earned */}
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col items-center md:items-end justify-center bg-accent/5 border border-accent/10 rounded-2xl p-6 px-8"
        >
          <div className="flex items-center gap-3 text-accent mb-1">
             <Sparkles className="h-6 w-6 animate-pulse" />
             <span className="text-3xl font-black">+{xpEarned} XP</span>
          </div>
          <p className="text-[10px] font-bold text-accent/60 uppercase tracking-widest">Esperienza acquisita</p>
        </motion.div>
      </div>
    </div>
  )
}
