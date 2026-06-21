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
  A1: "bg-slate-400 shadow-slate-100",
  A2: "bg-emerald-500 shadow-emerald-100",
  B1: "bg-sky-500 shadow-sky-100",
  B2: "bg-amber-500 shadow-amber-100",
  C1: "bg-indigo-600 shadow-indigo-100",
  C2: "bg-rose-500 shadow-rose-100",
}

export function CorrectionHeader({ level, targetLevel, score, examCompliant, xpEarned }: CorrectionHeaderProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = score
    if (start === end) return
    const duration = 1000
    const increment = end / (duration / 16)

    let timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="relative bg-card rounded-[2rem] p-8 md:p-12 border border-border shadow-sm overflow-hidden">
      {/* Diagonal Watermark Stamp */}
      <motion.div
        initial={{ scale: 2, opacity: 0, rotate: -25 }}
        animate={{ scale: 1, opacity: 0.05, rotate: -20 }}
        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
        className="absolute -right-16 -top-16 md:right-8 md:top-8 pointer-events-none select-none z-0"
      >
        <div className={cn(
          "border-[12px] p-8 md:p-14 rounded-[3rem]",
          examCompliant ? "border-primary text-primary" : "border-secondary text-secondary"
        )}>
          <span className="text-8xl md:text-[10rem] font-display font-black uppercase tracking-tighter">
            {examCompliant ? "Approvato" : "Rivedere"}
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        {/* Left: Level Badge */}
        <div className="flex items-center gap-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "text-white text-5xl md:text-6xl font-display font-bold w-28 h-28 md:w-36 md:h-36 flex items-center justify-center rounded-[2rem] shadow-2xl transition-all",
              levelColors[level] || "bg-gray-400"
            )}
          >
            {level}
          </motion.div>
          <div className="space-y-2">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Esito Valutazione</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground leading-tight">Analisi Finale</h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {examCompliant ? (
                <Badge className="bg-primary/10 text-primary border-none gap-1.5 px-4 py-1.5 rounded-full font-bold text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Conforme
                </Badge>
              ) : (
                <Badge className="bg-secondary/10 text-secondary border-none gap-1.5 px-4 py-1.5 rounded-full font-bold text-[11px]">
                  <AlertCircle className="h-3.5 w-3.5" /> Da migliorare
                </Badge>
              )}
              <Badge variant="outline" className="border-border text-muted-foreground gap-1.5 px-4 py-1.5 rounded-full font-bold text-[11px]">
                Target: {targetLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Center: Large Score */}
        <div className="flex flex-col items-center lg:items-start justify-center">
            <div className="flex items-baseline">
                <span className="text-7xl md:text-[8rem] font-display font-black text-foreground tracking-tighter leading-none">{count}</span>
                <span className="text-xl md:text-2xl font-bold text-gray-300 ml-2">/100</span>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] lg:ml-2">Punteggio Complessivo</p>
        </div>

        {/* Right: XP Earned */}
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col items-center lg:items-end justify-center bg-accent/5 border border-accent/10 rounded-3xl p-6 px-10"
        >
          <div className="flex items-center gap-3 text-accent mb-1">
             <Sparkles className="h-6 w-6 animate-pulse" />
             <span className="text-3xl md:text-4xl font-black">+{xpEarned} XP</span>
          </div>
          <p className="text-[10px] font-black text-accent/60 uppercase tracking-widest mt-1">Reward acquisita</p>
        </motion.div>
      </div>
    </div>
  )
}
