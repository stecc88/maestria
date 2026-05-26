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
  ExternalLink
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

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

  if (error) {
    console.error("Error fetching tasks:", error)
  }

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || []
  const inProgressTasks = tasks?.filter(t => t.status === 'started' || t.status === 'in_progress') || []
  const completedTasks = tasks?.filter(t => t.status === 'completed') || []

  const TaskIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'escritura': return <PenLine className="h-5 w-5" />
      case 'completar': return <ClipboardList className="h-5 w-5" />
      case 'transformacion': return <RefreshCw className="h-5 w-5" />
      case 'reescritura': return <FileText className="h-5 w-5" />
      default: return <ClipboardList className="h-5 w-5" />
    }
  }

  const TaskCard = ({ task }: { task: any }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-gray-100 overflow-hidden group">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "p-3 rounded-2xl",
            task.status === 'completed' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
          )}>
            <TaskIcon type={task.exercise_type} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="capitalize text-[10px] tracking-widest font-bold bg-gray-50">
              {task.exercise_type}
            </Badge>
            {task.due_date && (
              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3" />
                Vence: {format(new Date(task.due_date), 'd MMM', { locale: es })}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {task.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <User className="h-3 w-3" />
              Creada por {task.teachers?.profiles?.full_name} · {format(new Date(task.created_at), 'd MMM yyyy', { locale: es })}
            </p>
          </div>

          {task.corrections && (
            <div className="p-3 bg-cream rounded-xl border border-primary/5 flex items-center justify-between">
               <span className="text-[10px] font-bold text-primary/60 uppercase">Basada en tu texto</span>
               <Link href={`/student/corrections/${task.correction_id}`} className="text-[10px] text-primary hover:underline flex items-center gap-1 font-bold">
                 Ver corrección <ExternalLink className="h-3 w-3" />
               </Link>
            </div>
          )}

          <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
               {task.status === 'completed' ? (
                 <Badge className="bg-primary text-white border-none gap-1 py-1">
                   <CheckCircle2 className="h-3 w-3" /> Completada
                 </Badge>
               ) : task.status === 'pending' ? (
                 <Badge variant="outline" className="text-gray-400 border-gray-200">Pendiente</Badge>
               ) : (
                 <Badge className="bg-accent text-white border-none">En progreso</Badge>
               )}
            </div>

            <Link href={task.status === 'completed' ? `/student/tasks/${task.id}` : `/student/tasks/${task.id}`}>
              <Button size="sm" className={cn(
                "rounded-xl font-bold gap-2",
                task.status === 'completed' ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-primary text-white"
              )}>
                {task.status === 'completed' ? 'Ver resultado' : task.status === 'pending' ? 'Comenzar' : 'Continuar'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const EmptyState = () => (
    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
      <div className="bg-cream w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
        <ClipboardList className="h-10 w-10 text-gray-300" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">Sin tareas pendientes</h3>
      <p className="text-gray-500 max-w-sm mx-auto">
        Tu profesor aún no generó tareas para vos. Seguí enviando textos para que pueda ver tus errores y crear ejercicios.
      </p>
      <Link href="/student/write" className="inline-block mt-8">
        <Button className="bg-primary hover:bg-primary-dark font-bold px-8">
          Enviar nuevo texto ✍️
        </Button>
      </Link>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Le mie Attività 📝</h1>
        <p className="text-gray-500 mt-1">Ejercicios personalizados creados por tu profesor para mejorar tus puntos débiles.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="bg-white border border-gray-100 p-1 h-14 rounded-2xl w-full md:w-fit justify-start gap-2 px-2">
          <TabsTrigger value="pending" className="rounded-xl data-[state=active]:bg-secondary/5 data-[state=active]:text-secondary font-bold gap-2 px-6">
            Pendientes
            <Badge variant="destructive" className={cn("h-5 min-w-[20px] px-1", pendingTasks.length === 0 && "opacity-20")}>
              {pendingTasks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="rounded-xl data-[state=active]:bg-accent/5 data-[state=active]:text-accent font-bold gap-2 px-6">
            En progreso
            <Badge className={cn("bg-accent text-white h-5 min-w-[20px] px-1", inProgressTasks.length === 0 && "opacity-20")}>
              {inProgressTasks.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-bold gap-2 px-6">
            Completadas
            <Badge className={cn("bg-primary text-white h-5 min-w-[20px] px-1", completedTasks.length === 0 && "opacity-20")}>
              {completedTasks.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-8">
          {pendingTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : <EmptyState />}
        </TabsContent>

        <TabsContent value="in_progress" className="mt-8">
          {inProgressTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 italic">No tenés tareas iniciadas actualmente.</div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-8">
          {completedTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 italic">Aún no completaste ninguna tarea. ¡A darle! 💪</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
