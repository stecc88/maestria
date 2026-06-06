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

  // Fetch Teacher and Profile Data
  const { data: teacher } = await adminSupabase
    .from("teachers")
    .select("*, profiles(*)")
    .eq("id", user.id)
    .single()

  if (!teacher) redirect("/teacher")

  // Fetch Stats
  const { count: studentCount } = await adminSupabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user.id)

  const { count: taskCount } = await adminSupabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("teacher_id", user.id)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900 flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          Mio Profilo
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
