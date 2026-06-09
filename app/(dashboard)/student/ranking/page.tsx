import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RankingHeader } from "@/components/student/RankingHeader"
import { Podium } from "@/components/student/Podium"
import { RankingTable } from "@/components/student/RankingTable"
import { AchievementsGrid } from "@/components/student/AchievementsGrid"
import { ClassRanking } from "@/components/student/ClassRanking"
import { WeeklyChallenges } from "@/components/student/WeeklyChallenges"
import { getLevelFromXP } from "@/lib/utils/levels"

export default async function RankingPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 1. Fetch Global Ranking
  const { data: students } = await supabase
    .from("students")
    .select("id, xp_points, streak_days, target_level, teacher_id, achievements, profiles(full_name, avatar_url)")
    .order("xp_points", { ascending: false })

  if (!students) return <div>Caricamento classifica...</div>

  // 2. My Data
  const me = students.find(s => s.id === user.id)
  const myRank = students.findIndex(s => s.id === user.id) + 1
  const xpToNext = me ? (getLevelFromXP(me.xp_points).next?.minXp || me.xp_points) - me.xp_points : 0

  // 3. Class Ranking (students with same teacher)
  const myTeacherId = me?.teacher_id
  const { data: classStudents } = await supabase
    .from("students")
    .select("id, xp_points, profiles(full_name, avatar_url), teachers:teacher_id(profiles(full_name))")
    .eq("teacher_id", myTeacherId || "")
    .order("xp_points", { ascending: false })

  const teacherName = (classStudents?.[0]?.teachers as any)?.profiles?.full_name || "il tuo insegnante"

  return (
    <div className="min-h-screen bg-[#0F0F0F] -m-4 md:-m-8 p-4 md:p-8 text-white space-y-12 pb-20">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          Hall of Fame
        </h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Competi con studenti da tutto il mondo 🇮🇹</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-12">
          <RankingHeader
            rank={myRank}
            xp={me?.xp_points || 0}
            xpToNext={xpToNext}
          />

          <AchievementsGrid unlockedIds={me?.achievements || []} />

          <section>
             <Podium topStudents={students.slice(0, 3)} />
          </section>

          <section className="space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Classifica Globale</h3>
                <span className="text-[10px] font-black text-gray-600 uppercase">Aggiornato un momento fa</span>
             </div>
             <RankingTable students={students.slice(0, 20)} userId={user.id} />
          </section>
        </div>

        <div className="space-y-8">
           <WeeklyChallenges />
           {myTeacherId && (
             <ClassRanking
               students={classStudents || []}
               teacherName={teacherName}
               userId={user.id}
             />
           )}
        </div>
      </div>
    </div>
  )
}
