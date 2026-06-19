import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { StudentList } from "@/components/teacher/StudentList"

export default async function TeacherStudentsPage() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Check if user is teacher
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== 'teacher') {
    redirect("/")
  }

  // Fetch courses for this teacher
  const { data: courses } = await adminSupabase
    .from("courses")
    .select("*")
    .eq("teacher_id", user.id)
    .order("name")

  // Fetch all students for this teacher using admin client to bypass RLS on profiles
  const { data: students } = await adminSupabase
    .from("students")
    .select("*, profiles(*)")
    .eq("teacher_id", user.id)

  return (
    <div className="animate-in fade-in duration-700">
      <StudentList
        initialStudents={students || []}
        courses={courses || []}
      />
    </div>
  )
}
