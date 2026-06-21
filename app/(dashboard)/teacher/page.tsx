import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { TeacherStats } from "@/components/teacher/TeacherStats"
import { ActivityBarChart } from "@/components/teacher/ActivityBarChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Bell,
  Users,
  Calendar,
  Sparkles,
  GraduationCap
} from "lucide-react"
import Link from "next/link"
import { subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { SafeRelativeTime } from "@/components/ui/safe-relative-time"

export default async function TeacherDashboard() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [
    { data: teacher },
    { data: students },
    { data: notifications }
  ] = await Promise.all([
    adminSupabase.from("teachers").select("*, profiles(*)").eq("id", user.id).single(),
    adminSupabase.from("students").select("*, profiles(*)").eq("teacher_id", user.id),
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5)
  ])

  if (!teacher) return <div className="p-20 text-center animate-pulse text-muted-foreground font-bold uppercase tracking-widest">Caricamento...</div>

  const activeThisWeek = students?.filter(s => s.last_activity && new Date(s.last_activity) > subDays(new Date(), 7)).length || 0

  const [
    { data: teacherWritings },
    { data: teacherTasks }
  ] = await Promise.all([
    adminSupabase.from("writings").select("id, submitted_at, corrections(overall_score)").in("student_id", students?.map(s => s.id) || []),
    adminSupabase.from("tasks").select("id, status, completed_at").eq("teacher_id", user.id)
  ])

  const writingsThisWeek = teacherWritings?.filter(w => new Date(w.submitted_at) > subDays(new Date(), 7)).length || 0
  const tasksCompletedMonth = teacherTasks?.filter(t => t.status === 'completed' && t.completed_at && new Date(t.completed_at) > subDays(new Date(), 30)).length || 0

  const scores = teacherWritings?.flatMap(w => w.corrections).map((c: any) => c.overall_score).filter(s => s !== undefined) || []
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  const activityData = Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i)
    const dateStr = date.toISOString().split('T')[0]

    return {
      date: date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
      scritti: teacherWritings?.filter(w => w.submitted_at.startsWith(dateStr)).length || 0,
      compiti: teacherTasks?.filter(t => t.completed_at?.startsWith(dateStr)).length || 0
    }
  })

  const profile = Array.isArray(teacher.profiles) ? teacher.profiles[0] : teacher.profiles;
  const teacherFirstName = profile?.full_name?.split(' ')[0] || "Professore";

  return (
    <div className="relative min-h-screen">
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[30%] h-[30%] bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20">
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Pannello Docente</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Bentornato, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Prof. {teacherFirstName}</span> 👋
            </h1>
            <p className="text-muted-foreground font-bold text-lg max-w-2xl leading-relaxed">
              Gestisci la tua classe, monitora i progressi e genera nuove sfide per i tuoi studenti.
            </p>
          </div>
          <div className="flex items-center gap-4 p-5 bg-card rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 group hover:scale-105 transition-transform duration-300">
            <div className="p-3 bg-primary/10 rounded-2xl group-hover:rotate-12 transition-transform">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Codice Classe</p>
              <p className="text-2xl font-black text-primary font-display">{teacher.teacher_code}</p>
            </div>
          </div>
        </header>

        <TeacherStats
          stats={{
            activeStudents: activeThisWeek,
            writingsThisWeek: writingsThisWeek,
            tasksCompletedMonth: tasksCompletedMonth,
            avgScore: avgScore
          }}
          teacherCode={teacher.teacher_code}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <ActivityBarChart data={activityData} />

            <Card className="border-none shadow-xl shadow-gray-200/50 bg-card overflow-hidden rounded-[2rem] group">
              <CardHeader className="pb-4 border-b border-gray-50 flex flex-row items-center justify-between px-8 bg-gradient-to-r from-white to-gray-50/30">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg group-hover:rotate-12 transition-transform">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <span>Attività Recente Studenti</span>
                </CardTitle>
                <Link href="/teacher/students">
                  <Button variant="ghost" size="sm" className="text-[10px] font-black text-primary transition-colors bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10 shadow-sm">
                    VEDI TUTTI
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] border-b border-gray-50 bg-gray-50/20">
                        <th className="px-8 py-5">Studente</th>
                        <th className="px-8 py-5">Livello</th>
                        <th className="px-8 py-5">Ultimo Accesso</th>
                        <th className="px-8 py-5 text-right">Dettagli</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students?.slice(0, 5).map((student) => {
                        const lastSeen = student.last_activity ? new Date(student.last_activity) : null
                        const diffDays = lastSeen ? Math.floor((new Date().getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24)) : 999
                        const sProfile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
                        const sFullName = sProfile?.full_name || "Studente";
                        const sAvatarUrl = sProfile?.avatar_url;

                        return (
                          <tr key={student.id} className="hover:bg-primary/5 transition-all group/row">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-11 w-11 border-2 border-white shadow-md ring-2 ring-gray-50 group-hover/row:ring-primary/20 transition-all">
                                  <AvatarImage src={sAvatarUrl} />
                                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                                    {sFullName.split(' ').map((n:any) => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-black text-foreground group-hover/row:text-primary transition-colors truncate max-w-[150px]">
                                  {sFullName}
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <Badge variant="outline" className="bg-blue-50/50 text-blue-600 text-[10px] font-black uppercase tracking-widest border-blue-100 rounded-lg px-2.5 py-1 shadow-sm">
                                {student.current_level || student.target_level}
                              </Badge>
                            </td>
                            <td className="px-8 py-5 text-xs font-bold text-muted-foreground">
                               <div className="flex items-center gap-2.5">
                                  <div className={cn(
                                    "w-2 h-2 rounded-full ring-4 ring-white shadow-sm",
                                    diffDays < 3 ? "bg-primary" : diffDays < 7 ? "bg-accent" : "bg-secondary"
                                  )} />
                                  <SafeRelativeTime date={student.last_activity} placeholder="Mai" />
                               </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <Link href={`/teacher/students/${student.id}`}>
                                <Button size="icon" className="rounded-xl bg-muted hover:bg-primary text-muted-foreground hover:text-white h-10 w-10 transition-all shadow-sm group-hover/row:shadow-lg group-hover/row:-translate-y-1">
                                  <ChevronRight className="h-5 w-5" />
                                </Button>
                              </Link>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-10">
             <Card className="border-none shadow-xl shadow-gray-200/50 bg-card overflow-hidden rounded-[2rem] group">
               <CardHeader className="pb-4 border-b border-gray-50 flex flex-row items-center justify-between px-6 bg-gradient-to-r from-white to-gray-50/30">
                 <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2.5">
                   <div className="p-1.5 bg-accent/10 rounded-lg group-hover:rotate-12 transition-transform">
                     <Bell className="h-3.5 w-3.5 text-accent" />
                   </div>
                   <span>Notifiche</span>
                 </CardTitle>
                 <Link href="/teacher/notifications">
                    <Button variant="ghost" size="sm" className="text-[10px] font-black text-primary transition-colors bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
                      TUTTE
                    </Button>
                 </Link>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-gray-50">
                     {notifications?.map((n, i) => (
                       <div key={n.id} className="p-6 hover:bg-accent/5 transition-all group/n">
                          <p className="text-sm font-black text-foreground group-hover/n:text-primary transition-colors leading-snug">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground font-medium mt-2 line-clamp-2 leading-relaxed">{n.message}</p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-4 font-black uppercase tracking-widest">
                             <div className="p-1 bg-muted rounded-md">
                               <Calendar className="h-3 w-3" />
                             </div>
                             <SafeRelativeTime date={n.created_at} />
                          </div>
                       </div>
                     ))}
                     {notifications?.length === 0 && (
                       <div className="p-16 text-center">
                          <Bell className="h-10 w-10 text-gray-100 mx-auto mb-4" />
                          <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Nessuna notifica</p>
                       </div>
                     )}
                  </div>
               </CardContent>
             </Card>

             <Card className="border-none shadow-2xl shadow-primary/20 bg-gray-900 text-white overflow-hidden rounded-[2.5rem] relative group">
                <div className="absolute -top-10 -right-10 p-6 opacity-10 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                  <Sparkles className="h-40 w-40" />
                </div>
                <CardContent className="p-10 relative z-10 space-y-6">
                  <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Sparkles className="h-8 w-8 text-white fill-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-2 tracking-tight">Compiti IA ✨</h4>
                    <p className="text-muted-foreground text-sm font-bold leading-relaxed">
                      Genera esercizi mirati in pochi secondi analizzando automaticamente gli errori dei tuoi studenti.
                    </p>
                  </div>
                  <Link href="/teacher/tasks" className="block">
                    <Button className="w-full bg-card text-foreground hover:bg-muted font-black h-14 rounded-2xl text-xs tracking-[0.2em] shadow-xl group-hover:translate-y-[-2px] transition-all">
                       VAI AI COMPITI
                    </Button>
                  </Link>
                </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
