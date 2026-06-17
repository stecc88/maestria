import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { ClipboardList } from "lucide-react"
import TeacherTasksList from "../components/TeacherTasksList"

export default async function TeacherTasksPage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch Tasks with Student profiles and Submissions using admin client
  const { data: tasks } = await adminSupabase
    .from("tasks")
    .select(`
      *,
      students (
        id,
        target_level,
        profiles (
          full_name,
          avatar_url
        )
      ),
      task_submissions (
        ai_score,
        ai_feedback,
        submitted_at
      ),
      corrections (
        error_categories
      )
    `)
    .eq("teacher_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <ClipboardList className="h-8 w-8 text-primary" />
          Compiti Generati
        </h1>
        <p className="text-gray-500 mt-1">Gestisci e controlla il progresso dei compiti che hai assegnato.</p>
      </header>

      <TeacherTasksList initialTasks={tasks || []} />
    </div>
  )
}
