import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RankingHeader } from "@/components/student/RankingHeader"
import { Podium } from "@/components/student/Podium"
import { RankingTable } from "@/components/student/RankingTable"
import { Users, Trophy, Sparkles, Medal } from "lucide-react"
import { AchievementsGrid } from "@/components/student/AchievementsGrid"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
    <div className="relative min-h-screen">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 py-10 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-32">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-3 bg-accent/10 text-accent px-4 py-2 rounded-2xl border border-accent/20">
              <Trophy className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Hall of Fame</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight">
              Classifiche <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">& Premi</span> 🏆
            </h1>
            <p className="text-gray-500 font-bold text-lg max-w-2xl leading-relaxed">
              Scala la vetta, sblocca obiettivi unici e competi con studenti da tutto il mondo. 🇮🇹
            </p>
          </div>
        </header>

        <div className="space-y-16">
          <RankingHeader
            rank={myRank}
            xp={me?.xp_points || 0}
            xpToNext={xpToNext}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             <div className="lg:col-span-8 space-y-12">
               <WeeklyChallenges />

               <section className="space-y-8 pt-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-900 rounded-2xl shadow-xl shadow-gray-900/20">
                      <Medal className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-gray-900 tracking-tight">Classifica Globale</h2>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">Aggiornato in tempo reale • 🇮🇹 Global</p>
                    </div>
                  </div>

                  <Podium topStudents={students.slice(0, 3)} />
                  <RankingTable students={students.slice(0, 20)} userId={user.id} />
               </section>
             </div>

             <aside className="lg:col-span-4 space-y-12">
               {myTeacherId ? (
                 <ClassRanking
                   students={classStudents || []}
                   teacherName={teacherName}
                   userId={user.id}
                 />
               ) : (
                 <Card className="bg-white border-none shadow-xl shadow-gray-200/50 p-10 flex flex-col items-center justify-center text-center space-y-6 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white -z-10" />
                    <div className="h-20 w-20 bg-gray-100 rounded-[1.5rem] flex items-center justify-center group-hover:rotate-6 transition-transform shadow-inner">
                       <Users className="h-10 w-10 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">Nessuna classe attiva</h3>
                      <p className="text-gray-400 text-sm font-bold leading-relaxed">
                        Unisciti a una classe inserendo el codice del tuo docente nel profilo per sfidare i tuoi compagni.
                      </p>
                    </div>
                    <Link href="/student/profile" className="w-full">
                      <Button className="w-full bg-primary hover:bg-primary-dark font-black rounded-2xl py-6 shadow-lg shadow-primary/20">
                        VAI AL PROFILO
                      </Button>
                    </Link>
                 </Card>
               )}

               <AchievementsGrid unlockedIds={me?.achievements || []} />
             </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
