import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"
import {
  ChevronLeft,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  Trophy,
  MessageSquare,
  FileText,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date"
import { cn } from "@/lib/utils"

export default async function TeacherTaskDetailPage({ params }: { params: { id: string } }) {
  const adminSupabase = createAdminClient()

  // Fetch Task with Student profiles and Submissions
  const { data: task, error } = await adminSupabase
    .from("tasks")
    .select(`
      *,
      students (
        id,
        target_level,
        profiles (
          full_name,
          avatar_url,
          email
        )
      ),
      task_submissions (
        *,
        students (
          profiles (
            full_name
          )
        )
      ),
      corrections (
        error_categories,
        writings (
          title,
          content
        )
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !task) notFound()

  const submission = Array.isArray(task.task_submissions) ? task.task_submissions[0] : task.task_submissions
  const studentProfile = task.students?.profiles
  const isCompleted = task.status === 'completed'

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="space-y-4">
        <Link href="/teacher/tasks">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary gap-1 -ml-2">
            <ChevronLeft className="h-4 w-4" /> Torna ai compiti
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500 font-medium">
               <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-primary" /> {studentProfile?.full_name}</span>
               <div className="h-1 w-1 rounded-full bg-gray-300" />
               <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Assegnato il {formatDate(task.created_at, "d MMMM yyyy")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {isCompleted && (
               <div className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20">
                  <Trophy className="h-5 w-5" />
                  <span className="text-xl">{submission?.ai_score}/100</span>
               </div>
             )}
             <Badge className={cn(
               "px-4 py-2 rounded-xl text-xs font-bold border-none capitalize",
               task.status === 'completed' ? "bg-green-100 text-green-700" :
               task.status === 'in_progress' ? "bg-blue-100 text-blue-700" :
               "bg-gray-100 text-gray-700"
             )}>
                {task.status}
             </Badge>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Theory Section */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
             <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                   <AlertCircle className="h-4 w-4 text-primary" />
                   Spiegazione Teorica Assegnata
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: task.theory_explanation.replace(/\n/g, '<br/>') }} />
             </CardContent>
          </Card>

          {/* Submission Section */}
          {isCompleted && submission ? (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden ring-2 ring-primary/5">
               <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                     <FileText className="h-4 w-4" />
                     Risposta dello Studente
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-lg leading-relaxed text-gray-800 italic">
                     &ldquo;{submission.content}&rdquo;
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-primary">
                        <MessageSquare className="h-5 w-5" />
                        <h4 className="font-bold">Feedback dell&apos;IA</h4>
                     </div>
                     <p className="text-gray-600 leading-relaxed bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
                        {submission.ai_feedback}
                     </p>
                  </div>
               </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 bg-transparent">
              <CardContent className="p-12 text-center text-gray-400 font-medium">
                 <Clock className="h-10 w-10 mx-auto mb-4 opacity-20" />
                 Il compito non è ancora stato completato dallo studente.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
             <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12">
                      <AvatarImage src={studentProfile?.avatar_url} />
                      <AvatarFallback className="bg-primary text-white font-bold">
                         {studentProfile?.full_name?.split(' ').map((n:any) => n[0]).join('')}
                      </AvatarFallback>
                   </Avatar>
                   <div>
                      <p className="font-bold text-gray-900">{studentProfile?.full_name}</p>
                      <p className="text-xs text-gray-500">{studentProfile?.email}</p>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Livello Obiettivo</p>
                      <Badge variant="outline" className="font-bold">{task.students?.target_level}</Badge>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tipo di Esercizio</p>
                      <Badge className="bg-secondary text-white border-none capitalize">{task.exercise_type}</Badge>
                   </div>
                   {task.corrections?.writings && (
                     <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Basato sullo scritto</p>
                        <p className="text-xs font-bold text-primary underline">{task.corrections.writings.title}</p>
                     </div>
                   )}
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
