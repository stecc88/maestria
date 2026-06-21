import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"
import {
  ChevronLeft,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  MessageSquare,
  FileText,
  AlertCircle,
  Info
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date"
import { cn } from "@/lib/utils"
import ReactMarkdown from 'react-markdown'
import { DeleteTaskButton } from "../../components/DeleteTaskButton"

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

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'In attesa', color: 'bg-muted text-foreground/90' },
    started: { label: 'In corso', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'In corso', color: 'bg-blue-100 text-blue-700' },
    completed: { label: 'Completato', color: 'bg-green-100 text-green-700' },
  }

  const exerciseTypeMap: Record<string, string> = {
    completamento: 'Completamento',
    trasformazione: 'Trasformazione',
    riscrittura: 'Riscrittura',
    scrittura: 'Scrittura',
  }

  const renderStudentResponse = () => {
    if (!submission) return null;

    const type = task.exercise_type;
    const content = submission.content;

    try {
      if (type === 'completamento' || type === 'trasformazione') {
        const answers = typeof content === 'string' && content.startsWith('{') ? JSON.parse(content) : content;
        const items = task.exercise_content?.items || [];

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item: any) => {
              const studentAns = answers[item.id.toString()]?.trim();
              const isCorrect = studentAns?.toLowerCase() === item.correct_answer.trim().toLowerCase();

              return (
                <div key={item.id} className="p-4 bg-card rounded-2xl border border-border shadow-sm flex flex-col gap-2 transition-all hover:shadow-md">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                    <span>Quesito {item.id}</span>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-700 border-none flex items-center gap-1 text-[10px] px-2 py-0">
                        <CheckCircle2 className="h-3 w-3" /> Corretto
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 border-none flex items-center gap-1 text-[10px] px-2 py-0">
                        <XCircle className="h-3 w-3" /> Errato
                      </Badge>
                    )}
                  </div>

                  <div className="flex-grow">
                    {type === 'completamento' ? (
                      <p className="text-gray-800 leading-snug">
                        {item.sentence_before} <span className={cn("font-bold px-1 rounded", isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700 underline decoration-2")}>{studentAns || '(vuoto)'}</span> {item.sentence_after}
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 bg-gray-50/50 p-2 rounded-lg border border-border/50">
                          <Info className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground italic">{item.original_sentence}</p>
                        </div>
                        <p className="text-gray-800 font-medium pl-1">
                          <span className={cn(isCorrect ? "text-green-600" : "text-red-600")}>{studentAns || '(vuoto)'}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {!isCorrect && (
                    <div className="mt-1 pt-2 border-t border-border">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter mb-0.5">Risposta corretta:</p>
                      <p className="text-sm font-bold text-green-700">{item.correct_answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      }
    } catch (e) {
      console.error("Error parsing submission content", e);
    }

    return (
      <div className="p-6 bg-muted rounded-2xl border border-border text-lg leading-relaxed text-gray-800 italic prose prose-slate max-w-none font-body">
         <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      <header className="space-y-4">
        <Link href="/teacher/tasks">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1 -ml-2">
            <ChevronLeft className="h-4 w-4" /> Torna ai compiti
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
               <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-primary" /> {studentProfile?.full_name}</span>
               <div className="h-1 w-1 rounded-full bg-gray-300" />
               <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Assegnato il {formatDate(task.created_at, "d MMMM yyyy")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
             {isCompleted && (
               <div className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20">
                  <Trophy className="h-5 w-5" />
                  <span className="text-xl">{submission?.ai_score}/100</span>
               </div>
             )}
             <Badge className={cn(
               "px-4 py-2 rounded-xl text-xs font-bold border-none",
               statusMap[task.status]?.color || "bg-muted text-foreground/90"
             )}>
                {statusMap[task.status]?.label || task.status}
             </Badge>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Theory Section */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
             <CardHeader className="bg-gray-50/50 border-b border-border">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                   <AlertCircle className="h-4 w-4 text-primary" />
                   Spiegazione Teorica Assegnata
                </CardTitle>
             </CardHeader>
             <CardContent className="p-8 prose prose-slate max-w-none font-body">
                <ReactMarkdown>{task.theory_explanation}</ReactMarkdown>
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
               <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-primary/60">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-black uppercase tracking-widest">Dettaglio Risposte</span>
                       </div>
                    </div>
                    {renderStudentResponse()}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-border">
                     <div className="flex items-center gap-2 text-primary">
                        <MessageSquare className="h-5 w-5" />
                        <h4 className="font-bold">Feedback dell&apos;IA</h4>
                     </div>
                     <div className="text-muted-foreground leading-relaxed bg-card p-6 rounded-2xl border border-border shadow-sm prose prose-slate max-w-none font-body">
                        <ReactMarkdown>{submission.ai_feedback}</ReactMarkdown>
                     </div>
                  </div>
               </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-2 bg-transparent">
              <CardContent className="p-12 text-center text-muted-foreground font-medium">
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
                      <p className="font-bold text-foreground">{studentProfile?.full_name}</p>
                      <p className="text-xs text-muted-foreground">{studentProfile?.email}</p>
                   </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Livello Obiettivo</p>
                      <Badge variant="outline" className="font-bold">{task.students?.target_level}</Badge>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Tipo di Esercizio</p>
                      <Badge className="bg-secondary text-white border-none">{exerciseTypeMap[task.exercise_type] || task.exercise_type}</Badge>
                   </div>
                   {task.corrections?.writings && (
                     <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Basato sullo scritto</p>
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
