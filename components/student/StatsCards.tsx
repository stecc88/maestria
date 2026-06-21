"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { PenLine, Star, CheckCircle2, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number
  icon: any
  color: string
  gradient: string
  suffix?: string
  delay?: number
}

function StatCard({ label, value, icon: Icon, color, gradient, suffix = "", delay = 0 }: StatCardProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) {
      setCount(value)
      return
    }

    let totalMiliseconds = 1000
    let incrementTime = Math.max((totalMiliseconds / (end || 1)), 20)

    let timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="h-full"
    >
      <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-card overflow-hidden group relative">
        <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", gradient)} />

        <CardContent className="h-full p-6 flex flex-col items-center justify-center text-center gap-4 relative z-10">
          <div className={cn(
            "p-4 rounded-2xl shrink-0 transition-all duration-500 group-hover:rotate-6 shadow-sm",
            color.replace('bg-', 'bg-opacity-10 '),
            gradient
          )}>
            <Icon className={cn("h-7 w-7 text-white")} />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.15em] leading-none group-hover:text-muted-foreground transition-colors">
                {label}
              </p>
              <TrendingUp className="h-3 w-3 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-4xl font-black text-foreground leading-none tracking-tight">
              {count}{suffix}
            </p>
          </div>
        </CardContent>

        {/* Decorative corner element */}
        <div className={cn("absolute -bottom-4 -right-4 w-12 h-12 rounded-full opacity-[0.05] group-hover:scale-150 transition-transform", color)} />
      </Card>
    </motion.div>
  )
}

interface StatsCardsProps {
  writings: number
  avgScore: number
  completedTasks: number
}

export function StatsCards({ writings, avgScore, completedTasks }: StatsCardsProps) {
  const stats = [
    {
      label: "Testi Scritti",
      value: writings,
      icon: PenLine,
      color: "bg-emerald-500",
      gradient: "from-emerald-400 to-emerald-600"
    },
    {
      label: "Media Voti",
      value: avgScore,
      icon: Star,
      color: "bg-accent",
      gradient: "from-orange-400 to-orange-600",
      suffix: "%"
    },
    {
      label: "Task Completate",
      value: completedTasks,
      icon: CheckCircle2,
      color: "bg-blue-500",
      gradient: "from-blue-400 to-blue-600"
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-stretch">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} delay={i * 0.1} />
      ))}
    </div>
  )
}
