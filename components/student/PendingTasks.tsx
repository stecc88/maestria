"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils/date"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface PendingTasksProps {
  tasks: any[]
}

const TYPE_COLORS: Record<string, string> = {
  "scrittura": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "completamento": "bg-blue-50 text-blue-600 border-blue-100",
  "trasformazione": "bg-purple-50 text-purple-600 border-purple-100",
  "riscrittura": "bg-orange-50 text-orange-600 border-orange-100",
}

export function PendingTasks({ tasks }: PendingTasksProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Card className="border-none shadow-xl shadow-gray-200/50 bg-card overflow-hidden rounded-[2rem] group hover:shadow-2xl transition-all duration-500 flex flex-col">
      <CardHeader className="pb-4 border-b border-gray-50 flex flex-row items-center justify-between px-6 bg-gradient-to-r from-white to-gray-50/50 shrink-0">
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2.5">
          <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:rotate-12 transition-transform">
            <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <span>Compiti Sospesi</span>
        </CardTitle>
        <Link
          href="/student/tasks"
          className="text-[10px] font-black text-primary transition-colors bg-primary/5 px-3 py-1 rounded-full border border-primary/10 shadow-sm"
        >
          TUTTI
        </Link>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {tasks.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {tasks.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-5 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-white transition-all group/item relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black text-foreground leading-snug mb-2 group-hover/item:text-blue-600 transition-colors flex items-center gap-2">
                      {task.title}
                      {i === 0 && <Sparkles className="h-3 w-3 text-accent animate-pulse" />}
                    </h4>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border shadow-sm",
                        TYPE_COLORS[task.exercise_type] || "bg-muted text-muted-foreground border-border"
                      )}>
                        {task.exercise_type}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground">
                        <div className="p-1 bg-muted rounded-md">
                          <Calendar className="h-2.5 w-2.5" />
                        </div>
                        <span>{mounted ? formatDate(task.due_date, 'd MMM') : '...'}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/student/tasks/${task.id}`}>
                    <Button
                      size="icon"
                      className="rounded-xl bg-muted hover:bg-blue-600 text-muted-foreground hover:text-white h-10 w-10 transition-all shadow-sm group-hover/item:shadow-lg group-hover/item:-translate-y-1"
                    >
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-16 w-16 bg-muted rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-border"
            >
              <ClipboardList className="h-8 w-8 text-gray-200" />
            </motion.div>
            <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Sei in pari! 🚀</p>
            <p className="text-[10px] text-gray-300 font-bold mt-1">Nessun compito in scadenza</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
