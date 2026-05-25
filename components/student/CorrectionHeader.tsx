"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface CorrectionHeaderProps {
  level: string
  targetLevel: string
  score: number
  examCompliant: boolean
  xpEarned: number
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
    <div className="relative space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="bg-primary text-white text-6xl font-display font-bold w-24 h-24 flex items-center justify-center rounded-2xl shadow-xl shadow-primary/20"
            >
              {level}
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Nivel detectado</h2>
              <div className="flex flex-wrap gap-2 mt-1">
                {examCompliant ? (
                  <Badge className="bg-primary text-white border-none gap-1">
                    <CheckCircle2 className="h-3 w-3" /> ✅ Cumple estándares
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" /> ⚠️ Necesita más trabajo para {targetLevel}
                  </Badge>
                )}
                <Badge variant="secondary" className="bg-accent text-white border-none gap-1">
                  <Sparkles className="h-3 w-3" /> +{xpEarned} XP
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-7xl font-display font-bold text-gray-900">{count}</span>
          <span className="text-2xl font-bold text-gray-400 mt-4">/100</span>
        </div>
      </div>

      {/* Stamp Effect */}
      <motion.div
        initial={{ scale: 3, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 0.1, rotate: -15 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="absolute top-0 right-1/4 pointer-events-none select-none"
      >
        <div className="border-8 border-primary p-4 rounded-xl">
          <span className="text-8xl font-display font-bold text-primary uppercase">Approvato</span>
        </div>
      </motion.div>
    </div>
  )
}
