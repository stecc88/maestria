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

  // 2. Fetch Stats
  const { count: writingsCount } = await supabase
    .from("writings")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user.id)

  // Fix: Join with writings to ensure we only get scores for the current student
  const { data: corrections } = await supabase
    .from("corrections")
    .select("overall_score, detected_level, writings!inner(student_id)")
    .eq("writings.student_id", user.id)

  const avgScore = corrections && corrections.length > 0
    ? Math.round(corrections.reduce((acc, curr) => acc + (curr.overall_score || 0), 0) / corrections.length)
    : 0

  const { count: completedTasks } = await supabase
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user.id)
    .eq("status", "completed")

  // 3. Fetch Evolution History (Progress History)
  const { data: evolutionData } = await supabase
    .from("progress_history")
    .select("date, writing_score, detected_level")
    .eq("student_id", user.id)
    .order("date", { ascending: true })

  // 4. Fetch Radar Data (Avg of last 5 corrections for current student)
  const { data: radarCorrections } = await supabase
    .from("corrections")
    .select("score_coherence, score_vocabulary, score_grammar, score_task_completion, writings!inner(student_id)")
    .eq("writings.student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const radarData = radarCorrections && radarCorrections.length > 0
    ? [
        { subject: 'Coerenza', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_coherence || 0), 0) / radarCorrections.length), fullMark: 25 },
        { subject: 'Lessico', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_vocabulary || 0), 0) / radarCorrections.length), fullMark: 25 },
        { subject: 'Grammatica', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_grammar || 0), 0) / radarCorrections.length), fullMark: 25 },
        { subject: 'Compito', A: Math.round(radarCorrections.reduce((a, b) => a + (b.score_task_completion || 0), 0) / radarCorrections.length), fullMark: 25 },
      ]
    : []

  // 5. Fetch Pending Tasks
  const { data: pendingTasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("student_id", user.id)
    .eq("status", "pending")
    .order("due_date", { ascending: true })
    .limit(3)

  // 6. Fetch Latest Corrections
  const { data: latestCorrections } = await supabase
    .from("corrections")
    .select("*, writings!inner(student_id, title, writing_type)")
    .eq("writings.student_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  // 7. Fetch Ranking (Top 3 + User Position)
  const { data: topStudents } = await supabase
    .from("students")
    .select("id, xp_points, profiles(full_name, avatar_url)")
    .order("xp_points", { ascending: false })
    .limit(3)

  // Get user rank (with error handling)
  const { data: rankData, error: rankError } = await supabase.rpc('get_student_rank', { student_uuid: user.id })
  const userRank = rankError ? { rank: 0, diff: 0 } : (rankData || { rank: 0, diff: 0 })

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EvolutionChart data={evolutionData || []} />
            <RadarChart data={radarData} />
          </div>
        </div>

        <div className="space-y-8">
          <MiniRanking
            topStudents={topStudents || []}
            userRank={userRank}
          />
          <PendingTasks tasks={pendingTasks || []} />
          <LatestCorrections corrections={latestCorrections || []} />
        </div>
      </div>
    </div>
  )
}
