import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { TeacherStudentsClient } from "@/components/teacher/TeacherStudentsClient"

export default async function TeacherStudentsPage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Parallelize profile check and students fetch
  const [profileRes, studentsRes] = await Promise.all([
    adminSupabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single(),
    adminSupabase
      .from("students")
      .select("*, profiles(*)")
      .eq("teacher_id", user.id)
  ])

  const { data: profile } = profileRes
  const { data: students } = studentsRes

  if (profile?.role !== 'teacher') {
    redirect("/")
  }

  return (
    <TeacherStudentsClient
      initialStudents={students || []}
      initialCourses={courses || []}
    />
  )
}
