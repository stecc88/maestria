import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RankingHeader } from "@/components/student/RankingHeader"
import { Podium } from "@/components/student/Podium"
import { RankingTable } from "@/components/student/RankingTable"
import { Users } from "lucide-react"
import { AchievementsGrid } from "@/components/student/AchievementsGrid"
import { Card } from "@/components/ui/card"
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

      <div className="max-w-5xl mx-auto space-y-12">
        <RankingHeader
          rank={myRank}
          xp={me?.xp_points || 0}
          xpToNext={xpToNext}
        />

        <div className="space-y-8">
           <WeeklyChallenges />
           {myTeacherId ? (
             <ClassRanking
               students={classStudents || []}
               teacherName={teacherName}
               userId={user.id}
             />
           ) : (
             <Card className="bg-gray-900 border-gray-800 text-white p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center">
                   <Users className="h-10 w-10 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold">Nessuna classe attiva</h3>
                <p className="text-gray-400 max-w-sm">Unisciti a una classe inserendo il codice del tuo docente nel profilo per competere con i tuoi compagni.</p>
             </Card>
           )}
        </div>

        <AchievementsGrid unlockedIds={me?.achievements || []} />

        <section className="pt-16 space-y-12">
           <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter">Classifica Globale</h2>
              <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
              <p className="text-gray-500 uppercase tracking-[0.2em] text-[10px] font-black">Aggiornato ogni minuto</p>
           </div>

           <Podium topStudents={students.slice(0, 3)} />
           <RankingTable students={students.slice(0, 20)} userId={user.id} />
        </section>
      </div>
    </div>
  )
}
