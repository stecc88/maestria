"use client"

import React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, FileText, CheckCircle2, TrendingUp, Copy } from "lucide-react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"

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
    { label: "Studenti attivi", value: stats.activeStudents, icon: Users, color: "bg-blue-500" },
    { label: "Scritti (settimana)", value: stats.writingsThisWeek, icon: FileText, color: "bg-primary" },
    { label: "Compiti completati", value: stats.tasksCompletedMonth, icon: CheckCircle2, color: "bg-secondary" },
    { label: "Punteggio medio", value: `${stats.avgScore}/100`, icon: TrendingUp, color: "bg-accent" },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Il tuo codice studente</h2>
          <p className="text-sm text-gray-500">Condividi questo codice affinché i tuoi studenti possano iscriversi con te.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-cream px-6 py-3 rounded-2xl border-2 border-dashed border-primary/30 text-2xl font-display font-black text-primary tracking-widest">
            {teacherCode}
          </div>
          <Button size="icon" variant="outline" className="h-12 w-12 rounded-2xl" onClick={copyCode}>
            <Copy className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-gray-100 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className={`${item.color} bg-opacity-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.color.replace('bg-', 'text-')}`} />
                </div>
                <p className="text-3xl font-black text-gray-900">{item.value}</p>
                <p className="text-xs font-bold text-gray-400 uppercase mt-1">{item.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
