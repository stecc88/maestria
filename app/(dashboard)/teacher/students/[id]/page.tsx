import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { notFound, redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  Calendar,
  Clock,
  Mail,
  TrendingUp,
  Target,
  FileText
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { it } from "date-fns/locale"
import { EvolutionChart } from "@/components/student/EvolutionChart"
import { RadarChart } from "@/components/student/RadarChart"
import { ErrorAnalysis } from "@/components/teacher/ErrorAnalysis"
import { StudentWritingHistory } from "@/components/teacher/StudentWritingHistory"
import { GenerateTaskIA } from "@/components/teacher/GenerateTaskIA"

const formatDate = (date: string | null | undefined) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  return format(d, 'MMMM yyyy', { locale: it })
}

const formatLastActivity = (date: string | null | undefined) => {
  if (!date) return 'Nessuna attività'
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Nessuna attività'
  return formatDistanceToNow(d, { addSuffix: true, locale: it })
}

export default async function StudentDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // 1. Fetch Student Data (with verification)
  const { data: student } = await adminSupabase
    .from("students")
    .select("*, profiles(*)")
    .eq("id", params.id)
    .eq("teacher_id", user.id) // Ensure student belongs to this teacher
    .single()

  if (!student) notFound()

  // Handle potential array response for profiles (Supabase join behavior)
  const studentProfile = Array.isArray(student.profiles) ? student.profiles[0] : student.profiles;
  if (!studentProfile) notFound();

  // 2. Fetch Writing & Correction History
  const { data: writings } = await adminSupabase
    .from("writings")
    .select("*, corrections(*)")
    .eq("student_id", params.id)
    .order("submitted_at", { ascending: false })

  // 3. Process data for charts
  const evolutionData = writings?.filter(w => w.corrections?.[0]).map(w => ({
    date: w.submitted_at,
    writing_score: w.corrections[0].overall_score,
    detected_level: w.corrections[0].detected_level
  })).reverse() || []

  const last5Corrections = writings?.slice(0, 5).filter(w => w.corrections?.[0]).map(w => w.corrections[0]) || []

  const radarData = last5Corrections.length > 0 ? [
    { subject: 'Coerenza', A: Math.round(last5Corrections.reduce((a, b) => a + (b.score_coherence || 0), 0) / last5Corrections.length), fullMark: 25 },
    { subject: 'Lessico', A: Math.round(last5Corrections.reduce((a, b) => a + (b.score_vocabulary || 0), 0) / last5Corrections.length), fullMark: 25 },
    { subject: 'Grammatica', A: Math.round(last5Corrections.reduce((a, b) => a + (b.score_grammar || 0), 0) / last5Corrections.length), fullMark: 25 },
    { subject: 'Compito', A: Math.round(last5Corrections.reduce((a, b) => a + (b.score_task_completion || 0), 0) / last5Corrections.length), fullMark: 25 },
  ] : []

  // 4. Error Analysis
  const errorStats: Record<string, number> = {}
  const errorExamples: any[] = []

  writings?.forEach(w => {
    if (w.corrections?.[0]?.error_categories) {
       Object.entries(w.corrections[0].error_categories).forEach(([cat, desc]) => {
         errorStats[cat] = (errorStats[cat] || 0) + 1
       })
    }
    if (w.corrections?.[0]?.inline_corrections) {
       (w.corrections[0].inline_corrections as any[]).forEach(corr => {
         errorExamples.push({ ...corr, type: corr.error_type })
       })
    }
  })

  const mostFrequentError = Object.entries(errorStats).sort((a, b) => b[1] - a[1])[0]?.[0] || ""

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-500">
      <header className="space-y-6">
        <Link href="/teacher/students">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary gap-1 -ml-2">
            <ChevronLeft className="h-4 w-4" /> Torna agli studenti
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
           <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-primary/10">
                 <AvatarImage src={studentProfile.avatar_url} />
                 <AvatarFallback className="bg-primary/5 text-primary text-3xl font-black">
                    {studentProfile.full_name.split(' ').map((n:any) => n[0]).join('')}
                 </AvatarFallback>
              </Avatar>
              <div>
                 <h1 className="text-4xl font-display font-bold text-gray-900">{studentProfile.full_name}</h1>
                 <div className="flex items-center gap-3 mt-2 text-gray-500">
                    <span className="flex items-center gap-1.5 text-sm">
                       <Mail className="h-4 w-4" /> {studentProfile.email}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1.5 text-sm">
                       <Calendar className="h-4 w-4" /> Studente da {formatDate(student.created_at)}
                    </span>
                 </div>
                 <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="bg-gray-50 border-gray-200 text-gray-500 font-bold px-3 py-1">OBIETTIVO: {student.target_level}</Badge>
                    <Badge className="bg-primary text-white border-none px-3 py-1">ATTUALE: {student.current_level || 'A1'}</Badge>
                 </div>
              </div>
           </div>
           <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ultima attività</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                 {formatLastActivity(student.last_activity)}
              </p>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <EvolutionChart data={evolutionData} />
               <RadarChart data={radarData} />
            </section>

            <GenerateTaskIA
              student={student}
              recentWritings={writings?.slice(0, 5) || []}
              mostFrequentError={mostFrequentError}
            />

            <StudentWritingHistory writings={writings || []} />
         </div>

         <div className="space-y-8">
            <ErrorAnalysis errors={errorStats} examples={errorExamples} />
         </div>
      </div>
    </div>
  )
}
