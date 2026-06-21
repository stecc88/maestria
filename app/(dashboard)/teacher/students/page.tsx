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
      .select("*, profiles(*), writings(submitted_at, corrections(overall_score)), tasks(status)")
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

  // Derivar puntajes reales recientes por alumno (últimos 5, orden cronológico)
  const studentsWithScores = (students || []).map((student: any) => {
    const writings = Array.isArray(student.writings) ? student.writings : []
    const scoredWritings = writings
      .filter((w: any) => w.corrections?.[0]?.overall_score != null || w.corrections?.overall_score != null)
      .map((w: any) => {
        const correction = Array.isArray(w.corrections) ? w.corrections[0] : w.corrections
        return { score: correction?.overall_score ?? 0, date: w.submitted_at }
      })
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-5)

    const tasks = Array.isArray(student.tasks) ? student.tasks : []
    const completedTasks = tasks.filter((t: any) => t.status === "completed").length

    const { writings: _omit, tasks: _omitTasks, ...rest } = student
    return {
      ...rest,
      recentScores: scoredWritings.map((s: any) => s.score),
      taskStats: { completed: completedTasks, total: tasks.length },
    }
  })

  return (
    <TeacherStudentsClient
      initialStudents={studentsWithScores}
      initialCourses={courses || []}
    />
  )
}
