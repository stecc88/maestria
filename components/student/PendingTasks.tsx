"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar, ArrowRight } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils/date"

interface PendingTasksProps {
  tasks: any[]
}

export function PendingTasks({ tasks }: PendingTasksProps) {
  return (
    <Card className="border-none shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
          <ClipboardList className="h-3.5 w-3.5 text-blue-500" />
          <span>Compiti Sospesi</span>
        </CardTitle>
        <Link href="/student/tasks" className="text-[10px] font-bold text-primary hover:underline">
          TUTTI →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {tasks.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 hover:bg-gray-50/50 transition-colors group">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-primary transition-colors">
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest px-1.5 py-0 border-none">
                        {task.exercise_type}
                      </Badge>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(task.due_date, 'd MMM')}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/student/tasks/${task.id}`}>
                    <Button size="icon-sm" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary h-8 w-8">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="h-10 w-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClipboardList className="h-5 w-5 text-gray-300" />
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nessun compito</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
