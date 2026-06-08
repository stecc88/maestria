"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { PenLine, Star, CheckCircle2, Flame } from "lucide-react"
import { useEffect, useState } from "react"

interface StatCardProps {
  label: string
  value: number
  icon: any
  color: string
  suffix?: string
}

function StatCard({ label, value, icon: Icon, color, suffix = "" }: StatCardProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const end = value
    if (start === end) {
      setCount(value)
      return
    }

    let totalMiliseconds = 800
    let incrementTime = Math.max((totalMiliseconds / (end || 1)), 20)

    let timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 ')} shrink-0`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 group-hover:text-gray-500 transition-colors">
            {label}
          </p>
          <p className="text-2xl font-display font-bold text-gray-900 leading-none">
            {count}{suffix}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface StatsCardsProps {
  writings: number
  avgScore: number
  completedTasks: number
  streak: number
}

export function StatsCards({ writings, avgScore, completedTasks, streak }: StatsCardsProps) {
  const stats = [
    { label: "Scritti", value: writings, icon: PenLine, color: "bg-primary" },
    { label: "Punteggio", value: avgScore, icon: Star, color: "bg-accent", suffix: "" },
    { label: "Compiti", value: completedTasks, icon: CheckCircle2, color: "bg-blue-500" },
    { label: "Streak", value: streak, icon: Flame, color: "bg-secondary" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  )
}
