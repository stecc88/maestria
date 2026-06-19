"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface CorrectionHeaderProps {
  level: string
  targetLevel: string
  score: number
  examCompliant: boolean
  xpEarned: number
}

const LEVEL_STYLES: Record<string, string> = {
  A1: "bg-gray-400",
  A2: "bg-emerald-500",
  B1: "bg-blue-500",
  B2: "bg-secondary",
  C1: "bg-purple-500",
  C2: "bg-accent",
}

export function CorrectionHeader({ level, targetLevel, score, examCompliant, xpEarned }: CorrectionHeaderProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1000
    const stepTime = 16
    const steps = duration / stepTime
    const increment = score / steps

    const timer = setInterval(() => {
      start += increment
      if (start >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [score])

  return (
    <div className="relative bg-white rounded-3xl p-6 md:p-9 border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
      <div
        className="absolute -right-6 -top-6 md:right-6 md:top-6 pointer-events-none select-none z-0"
        style={{ opacity: 0.06, transform: 'rotate(-18deg)' }}
      >
        <div className={cn(
          "border-[10px] p-4 md:p-8 rounded-3xl",
          examCompliant ? "border-primary text-primary" : "border-secondary text-secondary"
        )}>
          <span className="text-5xl md:text-7xl font-display font-black uppercase tracking-tighter">
            {examCompliant ? "Approvato" : "Da Rivedere"}
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">

        <div className="flex items-center gap-4">
          <div className={cn(
            "text-white text-4xl md:text-5xl font-display font-bold w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-2xl shadow-lg shrink-0",
            LEVEL_STYLES[level] || "bg-gray-400"
          )}>
            {level}
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Livello rilevato</p>
            <h2 className="text-xl md:text-2xl font-display font-bold text-gray-900 leading-tight">Valutazione Finale</h2>
            <Badge className={cn(
              "mt-2 gap-1.5 px-3 py-1 rounded-full font-bold border-none text-[11px]",
              examCompliant ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
            )}>
              {examCompliant ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              {examCompliant ? "Conforme" : "Da migliorare"}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-baseline">
            <span className="text-6xl md:text-7xl font-display font-black text-gray-900 tracking-tighter tabular-nums">
              {displayScore}
            </span>
            <span className="text-xl md:text-2xl font-bold text-gray-300 ml-1">/100</span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">Punteggio Globale</p>
        </div>

        <div className="flex flex-col items-center justify-center bg-accent/5 border border-accent/10 rounded-2xl p-5 px-7">
          <div className="flex items-center gap-2 text-accent mb-1">
            <Sparkles className="h-5 w-5 animate-pulse" />
            <span className="text-2xl md:text-3xl font-black">+{xpEarned} XP</span>
          </div>
          <p className="text-[9px] font-bold text-accent/60 uppercase tracking-widest">Esperienza acquisita</p>
        </div>

      </div>
    </div>
  )
}
