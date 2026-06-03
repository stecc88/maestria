import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { User, ShieldCheck } from "lucide-react"
import TeacherProfileForm from "../components/TeacherProfileForm"

export default async function TeacherProfilePage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch Teacher and Profile Data
  const { data: teacher } = await supabase
    .from("teachers")
    .select("*, profiles(*)")
    .eq("id", user.id)
    .single()

  if (!teacher) redirect("/teacher")

  // Fetch Stats
  const { count: studentCount } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user.id)

  const { count: taskCount } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user.id)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Mi Perfil
        </h1>
        <p className="text-gray-500 mt-1">Gestiona tu información personal y revisa tus estadísticas generales.</p>
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
