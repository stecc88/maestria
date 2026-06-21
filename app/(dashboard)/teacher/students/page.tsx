import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { TeacherStudentsClient } from "@/components/teacher/TeacherStudentsClient"

export default async function TeacherStudentsPage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Parallelize profile check, students fetch and courses fetch
  const [profileRes, studentsRes, coursesRes] = await Promise.all([
    adminSupabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single(),
    adminSupabase
      .from("students")
      .select("*, profiles(*)")
      .eq("teacher_id", user.id),
    adminSupabase
      .from("courses")
      .select("id, name")
      .eq("teacher_id", user.id)
      .order("name")
  ])

  const { data: profile } = profileRes
  const { data: students } = studentsRes
  const { data: courses } = coursesRes

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
