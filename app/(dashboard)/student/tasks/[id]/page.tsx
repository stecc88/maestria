"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TheoryCard } from "@/components/student/TheoryCard"
import { ExerciseArea } from "@/components/student/ExerciseArea"
import { TaskResultDisplay } from "@/components/student/TaskResultDisplay"
import {
  User,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import toast from "react-hot-toast"

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [task, setTask] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    const fetchTask = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          teachers:teacher_id(profiles(full_name)),
          corrections:correction_id(error_categories, writings(title))
        `)
        .eq("id", params.id)
        .single()

      if (error || !data) {
        toast.error("No se pudo cargar la tarea")
        router.push("/student/tasks")
        return
      }

      setTask(data)
      setIsLoading(false)

      // If pending, mark as started
      if (data.status === 'pending') {
        await supabase
          .from("tasks")
          .update({ status: 'started', started_at: new Date().toISOString() })
          .eq("id", data.id)
      }
    }

    fetchTask()
  }, [params.id, router])

  const handleSubmit = async (content: string) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/check-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: task.id,
          content,
          error_categories: task.corrections?.error_categories,
          exercise_instructions: task.exercise_instructions
        }),
      })

      const data = await response.json()
      if (data.score !== undefined) {
        setResult(data)
        // Scroll to top to see results
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        throw new Error(data.error || "Error al corregir el ejercicio")
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium font-display">Caricamento attività...</p>
      </div>
    )
  }

  if (result) {
    return <TaskResultDisplay result={result} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
      <header className="space-y-4">
        <Link href="/student/tasks">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary gap-1 -ml-2">
            <ChevronLeft className="h-4 w-4" /> Volver a mis tareas
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <User className="h-4 w-4 text-primary" />
                Prof. {task.teachers?.profiles?.full_name}
              </span>
              <div className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5 text-sm text-secondary font-bold">
                <AlertCircle className="h-4 w-4" />
                Enfoque: {Object.values(task.corrections?.error_categories || {}).join(', ') || 'General'}
              </span>
            </div>
          </div>

          {task.correction_id && (
            <Link href={`/student/corrections/${task.correction_id}`}>
               <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 gap-2 rounded-xl font-bold">
                 Ver texto original <ExternalLink className="h-4 w-4" />
               </Button>
            </Link>
          )}
        </div>
      </header>

      <div className="space-y-12">
        <TheoryCard explanation={task.theory_explanation} />

        <ExerciseArea
          type={task.exercise_type}
          instructions={task.exercise_instructions}
          content={task.exercise_content}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
