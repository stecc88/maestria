"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ClipboardList, Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
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
            <span>Tareas pendientes</span>
          </div>
          <Link href="/student/tasks" className="text-xs text-primary font-medium hover:underline">
            Ver todas →
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-gray-50 bg-white hover:border-primary/20 transition-colors shadow-sm"
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
                  <span>{task.due_date ? format(new Date(task.due_date), 'd MMM', { locale: es }) : 'Sin fecha'}</span>
                </div>
                <Link href={`/student/tasks/${task.id}`}>
                  <Button size="xs" variant="outline" className="text-[11px] h-7 gap-1">
                    Comenzar <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500 italic">Tu profesor aún no generó tareas para vos</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
