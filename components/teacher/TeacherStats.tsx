"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, CheckCircle2, TrendingUp, Copy, Sparkles, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TeacherStatsProps {
  stats: {
    activeStudents: number
    writingsThisWeek: number
    tasksCompletedMonth: number
    avgScore: number
  }
  teacherCode: string
}

export function TeacherStats({ stats, teacherCode }: TeacherStatsProps) {
  const copyCode = () => {
    navigator.clipboard.writeText(teacherCode)
    toast.success("Codice copiato!")
  }

  const items = [
    {
      label: "Studenti attivi",
      value: stats.activeStudents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      label: "Scritti (sett.)",
      value: stats.writingsThisWeek,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      gradient: "from-emerald-400 to-emerald-600"
    },
    {
      label: "Compiti completati",
      value: stats.tasksCompletedMonth,
      icon: CheckCircle2,
      color: "text-secondary",
      bg: "bg-secondary/10",
      gradient: "from-red-400 to-red-600"
    },
    {
      label: "Punteggio medio",
      value: `${stats.avgScore}%`,
      icon: TrendingUp,
      color: "text-accent",
      bg: "bg-accent/10",
      gradient: "from-orange-400 to-orange-600"
    },
  ]

  return (
    <div className="space-y-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-white to-accent/5 opacity-50" />

        <div className="relative z-10 space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Zap className="h-4 w-4 text-primary fill-primary" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Accesso Rapido</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Il tuo codice classe docente</h2>
          <p className="text-gray-500 font-bold">Condividi questo codice per far iscrivere i tuoi studenti con te.</p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-gray-900 px-8 py-5 rounded-2xl shadow-2xl text-3xl font-black text-white tracking-[0.3em] font-display border-2 border-white/10 group-hover:scale-105 transition-transform duration-500">
            {teacherCode}
          </div>
          <Button
            size="icon"
            className="h-16 w-16 rounded-2xl bg-primary hover:bg-primary-dark shadow-lg shadow-primary/20 transition-all active:scale-95"
            onClick={copyCode}
            title="Copia codice"
          >
            <Copy className="h-6 w-6 text-white" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Card className="group relative overflow-hidden border-none shadow-xl shadow-gray-200/50 bg-white rounded-[2rem] hover:shadow-2xl transition-all duration-500">
              <div className={cn("absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", item.gradient)} />
              <CardContent className="p-8">
                <div className={cn("p-4 rounded-2xl w-fit mb-6 transition-all duration-500 group-hover:rotate-6 shadow-inner", item.bg, item.color)}>
                  <item.icon className="h-7 w-7" />
                </div>
                <p className="text-4xl font-black text-gray-900 tracking-tight leading-none">{item.value}</p>
                <div className="flex items-center gap-2 mt-3">
                   <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.15em]">{item.label}</p>
                   <div className="h-1 w-4 bg-gray-100 rounded-full group-hover:w-8 group-hover:bg-primary transition-all duration-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
