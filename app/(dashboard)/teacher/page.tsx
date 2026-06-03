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
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, subDays } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export default async function TeacherDashboard() {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 1. Fetch Teacher Data
  const { data: teacher } = await adminSupabase
    .from("teachers")
    .select("*, profiles(*)")
    .eq("id", user.id)
    .single()

  if (!teacher) return <div>Cargando panel docente...</div>

  // 2. Fetch Students Stats
  const { data: students } = await adminSupabase
    .from("students")
    .select("*, profiles(*)")
    .eq("teacher_id", user.id)

  const activeThisWeek = students?.filter(s => s.last_activity && new Date(s.last_activity) > subDays(new Date(), 7)).length || 0

  // 3. Mock Activity Data (Last 14 days)
  const activityData = Array.from({ length: 14 }).map((_, i) => ({
    date: subDays(new Date(), 13 - i).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    escritos: Math.floor(Math.random() * 5),
    tareas: Math.floor(Math.random() * 3)
  }))

  // 4. Notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-3xl font-display font-bold text-gray-900">
          Bienvenido, Prof. {teacher.profiles.full_name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Gestioná a tus alumnos y genera tareas personalizadas con IA.</p>
      </header>

      <TeacherStats
        stats={{
          activeStudents: activeThisWeek,
          writingsThisWeek: 12, // Mock
          tasksCompletedMonth: 8, // Mock
          avgScore: 74 // Mock
        }}
        teacherCode={teacher.teacher_code}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ActivityBarChart data={activityData} />

          <Card className="border-gray-100 overflow-hidden shadow-sm">
            <CardHeader className="bg-white border-b border-gray-50 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">Actividad reciente de alumnos</CardTitle>
              <Link href="/teacher/students">
                <Button variant="ghost" size="sm" className="text-primary font-bold">Ver todos</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="px-6 py-4">Alumno</th>
                      <th className="px-6 py-4">Nivel</th>
                      <th className="px-6 py-4">Último ingreso</th>
                      <th className="px-6 py-4">Acción</th>
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
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={student.profiles.avatar_url} />
                                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                  {student.profiles.full_name.split(' ').map((n:any) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                {student.profiles.full_name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none">
                              {student.current_level || student.target_level}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                diffDays < 3 ? "bg-green-500" : diffDays < 7 ? "bg-yellow-500" : "bg-red-500"
                              )} />
                              <span className="text-xs text-gray-500">
                                {lastSeen ? formatDistanceToNow(lastSeen, { addSuffix: true, locale: es }) : 'Nunca'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/teacher/students/${student.id}`}>
                              <Button size="icon" variant="ghost" className="rounded-full">
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

        <div className="space-y-8">
           <Card className="border-gray-100 shadow-sm">
             <CardHeader className="border-b border-gray-50">
               <CardTitle className="text-lg font-bold flex items-center gap-2">
                 <Bell className="h-5 w-5 text-accent" />
                 <span>Notificaciones recientes</span>
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
                <div className="divide-y divide-gray-50">
                   {notifications?.map((n) => (
                     <div key={n.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <p className="text-sm font-bold text-gray-900">{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-2 font-medium">
                           <Clock className="h-3 w-3" />
                           {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: es })}
                        </div>
                     </div>
                   ))}
                   {notifications?.length === 0 && (
                     <div className="p-8 text-center text-gray-400 italic">Sin notificaciones.</div>
                   )}
                </div>
                <div className="p-4 border-t border-gray-50 text-center">
                   <Link href="/teacher/notifications" className="text-xs font-bold text-primary hover:underline">
                      Ver todas las notificaciones
                   </Link>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
