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
  Clock,
  Users,
  Calendar,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, subDays } from "date-fns"
import { it } from "date-fns/locale"
import { cn } from "@/lib/utils"

export default async function TeacherDashboard() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: teacher } = await adminSupabase
    .from("teachers")
    .select("*, profiles(*)")
    .eq("id", user.id)
    .single()

  if (!teacher) return <div className="p-20 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Caricamento...</div>

  const { data: students } = await adminSupabase
    .from("students")
    .select("*, profiles(*)")
    .eq("teacher_id", user.id)

  const activeThisWeek = students?.filter(s => s.last_activity && new Date(s.last_activity) > subDays(new Date(), 7)).length || 0

  const activityData = Array.from({ length: 14 }).map((_, i) => ({
    date: subDays(new Date(), 13 - i).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
    scritti: Math.floor(Math.random() * 5),
    compiti: Math.floor(Math.random() * 3)
  }))

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 tracking-tight mb-2">
            Benvenuto, Prof. {teacher.profiles.full_name.split(' ')[0]}
          </h1>
          <p className="text-gray-500 font-medium">Gestisci i tuoi studenti e monitora i loro progressi.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Il tuo codice:</span>
          <span className="text-sm font-display font-bold text-primary">{teacher.teacher_code}</span>
        </div>
      </header>

      <TeacherStats
        stats={{
          activeStudents: activeThisWeek,
          writingsThisWeek: 12,
          tasksCompletedMonth: 8,
          avgScore: 74
        }}
        teacherCode={teacher.teacher_code}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <ActivityBarChart data={activityData} />

          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Attività Studenti</span>
              </CardTitle>
              <Link href="/teacher/students">
                <Button variant="ghost" size="sm" className="text-[10px] font-bold text-primary hover:bg-primary/5 h-7 px-3">VEDI TUTTI</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50/50">
                      <th className="px-6 py-4">Studente</th>
                      <th className="px-6 py-4">Livello</th>
                      <th className="px-6 py-4">Ultimo accesso</th>
                      <th className="px-6 py-4 text-right">Azione</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students?.slice(0, 5).map((student) => {
                      const lastSeen = student.last_activity ? new Date(student.last_activity) : null
                      const diffDays = lastSeen ? Math.floor((new Date().getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24)) : 999

                      return (
                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-gray-100">
                                <AvatarImage src={student.profiles.avatar_url} />
                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                                  {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors truncate max-w-[150px]">
                                {student.profiles.full_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border-none rounded-lg">
                              {student.current_level || student.target_level}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-xs font-medium text-gray-500">
                             <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-1.5 h-1.5 rounded-full ring-2 ring-white shadow-sm",
                                  diffDays < 3 ? "bg-primary" : diffDays < 7 ? "bg-accent" : "bg-secondary"
                                )} />
                                {lastSeen ? formatDistanceToNow(lastSeen, { addSuffix: true, locale: it }) : 'Mai'}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Link href={`/teacher/students/${student.id}`}>
                              <Button size="icon-sm" variant="ghost" className="rounded-full hover:bg-primary/10 hover:text-primary">
                                <ChevronRight className="h-4 w-4" />
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

        <div className="lg:col-span-4 space-y-8">
           <Card className="border-none shadow-sm bg-white overflow-hidden">
             <CardHeader className="pb-3 border-b border-gray-50 flex flex-row items-center justify-between">
               <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                 <Bell className="h-3.5 w-3.5 text-accent" />
                 <span>Notifiche</span>
               </CardTitle>
               <Link href="/teacher/notifications" className="text-[10px] font-bold text-primary hover:underline">
                  TUTTE →
               </Link>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-gray-50">
                   {notifications?.map((n) => (
                     <div key={n.id} className="p-5 hover:bg-gray-50/50 transition-colors group">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">{n.title}</p>
                        <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{n.message}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-widest">
                           <Calendar className="h-3 w-3" />
                           {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: it })}
                        </div>
                     </div>
                   ))}
                   {notifications?.length === 0 && (
                     <div className="p-10 text-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">Nessuna notifica</div>
                   )}
                </div>
             </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-gray-900 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                <Sparkles className="h-20 w-20" />
              </div>
              <CardContent className="p-8 relative z-10">
                <h4 className="text-xl font-display font-bold mb-2">Compiti IA</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">Genera esercizi personalizzati per i tuoi studenti basati sui loro errori comuni.</p>
                <Button className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl">
                   Vai ai Compiti
                </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
