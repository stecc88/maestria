import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { WelcomeCard } from "@/components/student/WelcomeCard"
import { StatsCards } from "@/components/student/StatsCards"
import { EvolutionChart } from "@/components/student/EvolutionChart"
import { RadarChart } from "@/components/student/RadarChart"
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
    <div className="relative min-h-screen">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10 py-6 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-stretch">
          <div className="xl:col-span-8 space-y-10">
            <WelcomeCard
              name={student.profiles.full_name}
              targetLevel={student.target_level}
              currentLevel={student.current_level}
              streak={student.streak_days}
              xp={student.xp_points}
            />

            <StatsCards
              writings={writingsCount || 0}
              avgScore={avgScore}
              completedTasks={completedTasks || 0}
              streak={student.streak_days}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
              <div className="h-full">
                <EvolutionChart data={evolutionData || []} />
              </div>
              <div className="h-full">
                <RadarChart data={radarData} />
              </div>
            </div>
          </div>

          <aside className="xl:col-span-4 space-y-10 h-full">
            <div className="h-full flex flex-col gap-10">
              <MiniRanking
                topStudents={topStudents || []}
                userRank={userRank}
              />
              <PendingTasks tasks={pendingTasks || []} />
              <LatestCorrections corrections={latestCorrections || []} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
