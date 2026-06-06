"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { it } from "date-fns/locale"
import Link from "next/link"

interface PendingTasksProps {
  tasks: any[]
}

export function PendingTasks({ tasks }: PendingTasksProps) {
  return (
    <Card className="border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-500" />
            <span>Compiti in sospeso</span>
          </div>
          <Link href="/student/tasks" className="text-xs text-primary font-medium hover:underline">
            Vedi tutti →
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-hide">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="min-w-[280px] p-4 rounded-xl border border-gray-50 bg-white hover:border-primary/20 transition-colors shadow-sm snap-center"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight mb-1">{task.title}</h4>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-[10px] uppercase tracking-wider">
                      {task.exercise_type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{task.due_date ? format(new Date(task.due_date), 'd MMM', { locale: it }) : 'Senza data'}</span>
                  </div>
                  <Link href={`/student/tasks/${task.id}`}>
                    <Button size="xs" variant="outline" className="text-[11px] h-7 gap-1">
                      Inizia <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 italic">Il tuo insegnante non ha ancora generato compiti per te</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
