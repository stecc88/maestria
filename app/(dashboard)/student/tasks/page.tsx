import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  PenLine,
  FileText,
  RefreshCw,
  ClipboardList,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  User,
  ExternalLink,
  Sparkles,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils/date"

export default async function StudentTasksPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch all tasks for the student
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select(`
      *,
      teachers:teacher_id(profiles(full_name)),
      corrections:correction_id(created_at, writing_id)
    `)
    .eq("student_id", user.id)
    .order("created_at", { ascending: false })

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || []
  const inProgressTasks = tasks?.filter(t => t.status === 'started' || t.status === 'in_progress') || []
  const completedTasks = tasks?.filter(t => t.status === 'completed') || []

  const TaskIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'escritura': return <PenLine className="h-6 w-6" />
      case 'completar': return <ClipboardList className="h-6 w-6" />
      case 'transformacion': return <RefreshCw className="h-6 w-6" />
      case 'reescritura': return <FileText className="h-6 w-6" />
      default: return <ClipboardList className="h-6 w-6" />
    }
  }

  const TYPE_CONFIG: Record<string, { color: string, gradient: string }> = {
    "escritura": { color: "text-emerald-500", gradient: "from-emerald-400 to-emerald-600" },
    "completar": { color: "text-blue-500", gradient: "from-blue-400 to-blue-600" },
    "transformacion": { color: "text-purple-500", gradient: "from-purple-400 to-purple-600" },
    "reescritura": { color: "text-orange-500", gradient: "from-orange-400 to-orange-600" },
  }

  const TaskCard = ({ task }: { task: any }) => {
    const config = TYPE_CONFIG[task.exercise_type] || TYPE_CONFIG["escritura"]

    return (
      <Card className="group relative overflow-hidden border-none shadow-xl shadow-gray-200/50 bg-white rounded-[2rem] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className={cn("absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity", config.gradient)} />

        <CardContent className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className={cn(
              "p-4 rounded-2xl transition-all duration-500 group-hover:rotate-6 shadow-sm bg-white border border-gray-100",
              config.color
            )}>
              <TaskIcon type={task.exercise_type} />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={cn(
                "capitalize text-[10px] tracking-[0.2em] font-black border shadow-sm px-3 py-1 rounded-full",
                task.status === 'completed' ? "bg-primary/5 text-primary border-primary/10" : "bg-gray-50 text-gray-500 border-gray-200"
              )}>
                {task.exercise_type}
              </Badge>
              {task.due_date && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1.5 font-black uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md">
                  <Clock className="h-3 w-3" />
                  {formatDate(task.due_date, 'd MMM')}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight group-hover:text-primary transition-colors">
                {task.title}
              </h3>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mt-2 flex items-center gap-1.5">
                <User className="h-3 w-3" />
                {task.teachers?.profiles?.full_name} · {formatDate(task.created_at)}
              </p>
            </div>

            {task.corrections && (
              <div className="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-between group/basis">
                 <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Basata sul tuo testo</span>
                 </div>
                 <Link href={`/student/corrections/${task.correction_id}`} className="text-[10px] text-primary hover:text-primary-dark flex items-center gap-1 font-black uppercase tracking-widest">
                   VEDI <ExternalLink className="h-3 w-3" />
                 </Link>
              </div>
            )}

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                 {task.status === 'completed' ? (
                   <div className="flex items-center gap-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/20">
                     <CheckCircle2 className="h-3.5 w-3.5" /> Fatto
                   </div>
                 ) : (
                   <div className={cn(
                     "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-sm",
                     task.status === 'pending' ? "bg-secondary/10 text-secondary border-secondary/20" : "bg-accent/10 text-accent border-accent/20"
                   )}>
                     <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", task.status === 'pending' ? "bg-secondary" : "bg-accent")} />
                     {task.status === 'pending' ? 'In sospeso' : 'In corso'}
                   </div>
                 )}
              </div>

              <Link href={`/student/tasks/${task.id}`} className="flex-1">
                <Button className={cn(
                  "w-full rounded-2xl font-black gap-2 transition-all shadow-lg text-xs tracking-widest uppercase py-6",
                  task.status === 'completed' ? "bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-none border-2 border-gray-200/50" : "bg-gray-900 text-white hover:shadow-xl hover:shadow-primary/20 group-hover:bg-primary"
                )}>
                  {task.status === 'completed' ? 'RISULTATO' : task.status === 'pending' ? 'INIZIA' : 'CONTINUA'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const EmptyState = () => (
    <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 shadow-inner">
      <div className="bg-gray-50 w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
        <ClipboardList className="h-12 w-12 text-gray-200" />
      </div>
      <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Tutto tranquillo qui! 🏝️</h3>
      <p className="text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
        Non hai compiti in sospeso. Ottimo lavoro! Se vuoi nuove sfide, invia un testo libero al tuo insegnante.
      </p>
      <Link href="/student/write" className="inline-block mt-10">
        <Button className="bg-primary hover:bg-primary-dark font-black px-12 py-8 rounded-[1.5rem] text-lg shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 gap-3">
          SCRIVI ORA <PenLine className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 bg-primary/10 text-primary px-4 py-2 rounded-2xl border border-primary/20">
            <Sparkles className="h-5 w-5" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Learning Hub</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Le Tue Attività 🎯</h1>
          <p className="text-gray-500 font-bold text-lg max-w-2xl">
            Esercizi su misura basati sui tuoi progressi. Completa i compiti per guadagnare XP e salire di livello.
          </p>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-white/50 backdrop-blur border border-gray-200 p-2 h-16 rounded-[1.5rem] w-full md:w-fit justify-start gap-3 px-3 shadow-sm">
          <TabsTrigger value="pending" className="rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-black text-xs tracking-widest uppercase gap-3 px-8 transition-all">
            IN SOSPESO
            <Badge className={cn("bg-secondary text-white font-black h-6 min-w-[24px] px-1.5 rounded-lg border-none shadow-lg shadow-secondary/20", pendingTasks.length === 0 && "opacity-50")}>
              {pendingTasks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-black text-xs tracking-widest uppercase gap-3 px-8 transition-all">
            IN CORSO
            <Badge className={cn("bg-accent text-white font-black h-6 min-w-[24px] px-1.5 rounded-lg border-none shadow-lg shadow-accent/20", inProgressTasks.length === 0 && "opacity-50")}>
              {inProgressTasks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-gray-900 data-[state=active]:text-white font-black text-xs tracking-widest uppercase gap-3 px-8 transition-all">
            COMPLETATE
            <Badge className={cn("bg-primary text-white font-black h-6 min-w-[24px] px-1.5 rounded-lg border-none shadow-lg shadow-primary/20", completedTasks.length === 0 && "opacity-50")}>
              {completedTasks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-10 outline-none">
          {pendingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : <EmptyState />}
        </TabsContent>

        <TabsContent value="in_progress" className="mt-10 outline-none">
          {inProgressTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/50 border-4 border-dashed border-gray-100 rounded-[3rem]">
              <div className="bg-accent/10 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                <Clock className="h-10 w-10 text-accent" />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest">Nessun compito avviato</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-10 outline-none">
          {completedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-24 bg-white/50 border-4 border-dashed border-gray-100 rounded-[3rem]">
              <div className="bg-primary/10 w-20 h-20 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest">Inizia a studiare!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
