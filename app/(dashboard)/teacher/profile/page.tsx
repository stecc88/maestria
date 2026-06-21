import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { User, ShieldCheck } from "lucide-react"
import TeacherProfileForm from "../components/TeacherProfileForm"

export default async function TeacherProfilePage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch Teacher, Profile Data and Stats in parallel
  const [teacherResult, studentCountResult, taskCountResult] = await Promise.all([
    adminSupabase
      .from("teachers")
      .select("*, profiles(*)")
      .eq("id", user.id)
      .single(),
    adminSupabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", user.id),
    adminSupabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("teacher_id", user.id),
  ])

  const { data: teacher } = teacherResult
  const { count: studentCount } = studentCountResult
  const { count: taskCount } = taskCountResult

  if (!teacher) redirect("/teacher")

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Profilo
        </h1>
        <p className="text-gray-500 mt-1">Gestisci le tue informazioni personali e controlla le tue statistiche generali.</p>
      </header>

      <TeacherProfileForm
        teacher={teacher}
        stats={{
          studentCount: studentCount || 0,
          taskCount: taskCount || 0
        }}
      />
    </div>
  )
}
