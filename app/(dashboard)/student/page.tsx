import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WelcomeCard } from "@/components/student/WelcomeCard"
import { StatsCards } from "@/components/student/StatsCards"
import { ProgressSection } from "@/components/student/ProgressSection"
import { PendingTasks } from "@/components/student/PendingTasks"
import { LatestCorrections } from "@/components/student/LatestCorrections"
import { MiniRanking } from "@/components/student/MiniRanking"

export default async function StudentDashboard() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // 1. Fetch Student Profile & Level Info
  const { data: student } = await supabase
    .from("students")
    .select("*, profiles(*)")
    .eq("id", user.id)
    .single()

  if (!student) return <div>Caricamento dati studente...</div>

  // 2-7. Parallel Fetch Data
  const [
    { count: writingsCount },
    { data: corrections },
    { count: completedTasks },
    { data: evolutionData },
    { data: radarCorrections },
    { data: pendingTasks },
    { data: latestCorrections },
    { data: topStudents },
    { data: rankData, error: rankError }
  ] = await Promise.all([
    supabase.from("writings").select("*", { count: "exact", head: true }).eq("student_id", user.id),
    supabase.from("corrections").select("overall_score, detected_level, writings!inner(student_id)").eq("writings.student_id", user.id),
    supabase.from("tasks").select("*", { count: "exact", head: true }).eq("student_id", user.id).eq("status", "completed"),
    supabase.from("progress_history").select("date, writing_score, detected_level").eq("student_id", user.id).order("date", { ascending: true }),
    supabase.from("corrections").select("score_coherence, score_vocabulary, score_grammar, score_task_completion, writings!inner(student_id)").eq("writings.student_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("tasks").select("*").eq("student_id", user.id).eq("status", "pending").order("due_date", { ascending: true }).limit(3),
    supabase.from("corrections").select("*, writings!inner(student_id, title, writing_type)").eq("writings.student_id", user.id).order("created_at", { ascending: false }).limit(3),
    supabase.from("students").select("id, xp_points, profiles(full_name, avatar_url)").order("xp_points", { ascending: false }).limit(3),
    supabase.rpc('get_student_rank', { student_uuid: user.id })
  ])

  const avgScore = corrections && corrections.length > 0
    ? Math.round(corrections.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / corrections.length)
    : 0

  const radarData = radarCorrections && radarCorrections.length > 0
    ? [
        { subject: 'Coerenza', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_coherence || 0), 0) / radarCorrections.length), fullMark: 25 },
        { subject: 'Lessico', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_vocabulary || 0), 0) / radarCorrections.length), fullMark: 25 },
        { subject: 'Grammatica', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_grammar || 0), 0) / radarCorrections.length), fullMark: 25 },
        { subject: 'Compito', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_task_completion || 0), 0) / radarCorrections.length), fullMark: 25 },
      ]
    : []

  const userRank = rankError ? { rank: 0, diff: 0 } : (rankData || { rank: 0, diff: 0 })

  return (
    // Sin blobs decorativos fixed/blur: en una pantalla con tanta densidad
    // de datos (stats, gráficos, ranking) restan jerarquía en vez de sumar
    // atmósfera. Fondo plano y limpio.
    <div className="max-w-7xl mx-auto space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      <WelcomeCard
        name={student.profiles.full_name}
        targetLevel={student.target_level}
        currentLevel={student.current_level}
        streak={student.streak_days}
        xp={student.xp_points}
      />

      {/* Las stats van antes de las tareas: contexto rápido de "¿cómo voy?"
          antes de mostrar qué falta hacer — el orden natural en que un
          estudiante lee su propio progreso. */}
      <StatsCards
        writings={writingsCount || 0}
        avgScore={avgScore}
        completedTasks={completedTasks || 0}
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-8 space-y-6">
          <PendingTasks tasks={pendingTasks || []} />
          <ProgressSection evolutionData={evolutionData || []} radarData={radarData} />
        </div>

        <aside className="xl:col-span-4 space-y-6">
          <LatestCorrections corrections={latestCorrections || []} />
          <MiniRanking
            topStudents={topStudents || []}
            userRank={userRank}
          />
        </aside>
      </div>
    </div>
  )
}
