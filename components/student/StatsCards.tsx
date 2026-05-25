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
    if (start === end) return

    let totalMiliseconds = 1000
    let incrementTime = (totalMiliseconds / end)

    let timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, incrementTime)

    return () => clearInterval(timer)
  }, [value])

  return (
    <Card className="hover:shadow-md transition-shadow border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{count}{suffix}</p>
          <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
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
    { label: "Textos enviados", value: writings, icon: PenLine, color: "bg-primary" },
    { label: "Promedio puntaje", value: avgScore, icon: Star, color: "bg-accent", suffix: "/100" },
    { label: "Tareas completadas", value: completedTasks, icon: CheckCircle2, color: "bg-blue-500" },
    { label: "Racha actual", value: streak, icon: Flame, color: "bg-secondary" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  )
}
