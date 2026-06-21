import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { ProfileClient } from "@/components/student/ProfileClient"

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const adminSupabase = createAdminClient()

  const [profileResult, studentResult, writingsCountResult, tasksCountResult] = await Promise.all([
    adminSupabase.from("profiles").select("*").eq("id", user.id).single(),
    adminSupabase
      .from("students")
      .select("*, teachers:teacher_id(profiles(full_name))")
      .eq("id", user.id)
      .single(),
    adminSupabase
      .from("writings")
      .select("*", { count: "exact", head: true })
      .eq("student_id", user.id),
    adminSupabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("student_id", user.id)
      .eq("status", "completed"),
  ])

  const { data: profile } = profileResult
  const { data: student } = studentResult
  const { count: writingsCount } = writingsCountResult
  const { count: tasksCount } = tasksCountResult

  if (!profile || !student) redirect("/student")

  const teacherProfile = Array.isArray(student.teachers) ? student.teachers[0] : student.teachers
  const teacherName = teacherProfile?.profiles?.full_name || null

  return (
    <ProfileClient
      profile={profile}
      student={student}
      teacherName={teacherName}
      writingsCount={writingsCount || 0}
      tasksCount={tasksCount || 0}
    />
  )
}
