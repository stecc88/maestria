import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ClipboardList } from "lucide-react"
import TeacherTasksList from "../components/TeacherTasksList"

export default async function TeacherTasksPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch Tasks with Student profiles
  const { data: tasks } = await supabase
    .from("tasks")
    .select(`
      *,
      students (
        id,
        profiles (
          full_name,
          avatar_url
        )
      )
    `)
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          Tareas Generadas
        </h1>
        <p className="text-gray-500 mt-1">Administra y revisa el progreso de las tareas que has asignado.</p>
      </header>

      <TeacherTasksList initialTasks={tasks || []} />
    </div>
  )
}
