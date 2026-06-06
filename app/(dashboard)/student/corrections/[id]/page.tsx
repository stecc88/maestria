import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import {
  CheckCircle2,
  ChevronRight,
  Star,
  ArrowRight,
  FileSearch,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Target
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CorrectionHeader } from "@/components/student/CorrectionHeader"
import { ExaminerCard } from "@/components/student/ExaminerCard"
import { AnnotatedText } from "@/components/student/AnnotatedText"
import { RadarChart } from "@/components/student/RadarChart"
import Link from "next/link"

export default async function CorrectionResultPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // 1. Fetch data
  const { data: correction } = await supabase
    .from("corrections")
    .select("*, writings(*)")
    .eq("id", params.id)
    .single()

  if (!correction) notFound()

  const radarData = [
    { subject: 'COERENZA', A: correction.score_coherence, fullMark: 25 },
    { subject: 'LESSICO', A: correction.score_vocabulary, fullMark: 25 },
    { subject: 'GRAMMATICA', A: correction.score_grammar, fullMark: 25 },
    { subject: 'COMPITI', A: correction.score_task_completion, fullMark: 25 },
  ]

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000 px-4 md:px-0">
      {/* Header Section */}
      <CorrectionHeader
        level={correction.detected_level}
        targetLevel={correction.writings.target_level}
        score={correction.overall_score}
        examCompliant={correction.exam_compliant}
        xpEarned={correction.xp_earned}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Analysis Column */}
        <div className="lg:col-span-2 space-y-12">
          <ExaminerCard comment={correction.examiner_comment} />

          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="bg-white border border-gray-100 p-1.5 h-14 rounded-2xl w-fit flex gap-2 shadow-sm">
              <TabsTrigger
                value="strengths"
                className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all"
              >
                Punti di forza ✅
              </TabsTrigger>
              <TabsTrigger
                value="to_improve"
                className="rounded-xl px-6 data-[state=active]:bg-secondary data-[state=active]:text-white font-bold transition-all"
              >
                Aree da migliorare ⚠️
              </TabsTrigger>
              <TabsTrigger
                value="suggestions"
                className="rounded-xl px-6 data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all"
              >
                Suggerimenti 💡
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strengths" className="mt-8 space-y-4">
              {correction.pros.map((pro: string, i: number) => (
                <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/30 group-hover:w-2 transition-all" />
                  <CardContent className="p-8 flex items-start gap-5">
                    <div className="p-2.5 bg-primary/10 rounded-xl shrink-0 mt-1">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-gray-800 leading-[1.8] text-lg font-medium">{pro}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="to_improve" className="mt-8 space-y-4">
              {correction.cons.map((con: string, i: number) => (
                <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary/30 group-hover:w-2 transition-all" />
                  <CardContent className="p-8 flex items-start gap-5">
                    <div className="p-2.5 bg-secondary/10 rounded-xl shrink-0 mt-1">
                      <Target className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-gray-800 leading-[1.8] text-lg font-medium">{con}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="suggestions" className="mt-8 space-y-6">
              {correction.suggestions.map((sug: any, i: number) => (
                <Card key={i} className="border-none shadow-sm bg-white">
                  <CardContent className="p-8 space-y-5">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-accent/10 text-accent-dark hover:bg-accent/20 border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                        {sug.category}
                      </Badge>
                    </div>
                    <p className="font-display font-bold text-xl text-gray-900 leading-tight">{sug.tip}</p>
                    <div className="p-5 bg-cream rounded-2xl border border-gray-100/50 text-base italic leading-relaxed">
                      <span className="text-primary font-black uppercase text-[10px] tracking-widest mr-3 not-italic">Esempio:</span>
                      &ldquo;{sug.example}&rdquo;
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <section className="space-y-8 pt-10">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <FileSearch className="h-6 w-6 text-primary" />
               </div>
               <div>
                  <h3 className="text-3xl font-display font-bold text-gray-900">Analisi del Testo</h3>
                  <p className="text-gray-500 text-sm">Revisione parola per parola e correzioni suggerite.</p>
               </div>
            </div>
            <AnnotatedText
              originalText={correction.writings.content}
              correctedText={correction.corrected_text}
              corrections={correction.inline_corrections}
            />
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-10">
          <RadarChart data={radarData} />

          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-8 space-y-8">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Progresso per livelli</h4>
              <div className="space-y-5">
                {levels.map((l) => {
                  const isMet = correction.meets_level_requirements[l]
                  const isCurrent = correction.detected_level === l
                  return (
                    <div key={l} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all",
                          isMet ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-400 border-gray-100"
                        )}>
                          {l}
                        </div>
                        {isCurrent && <Badge className="text-[10px] bg-accent font-black tracking-widest px-2 py-0">ATTUALE</Badge>}
                      </div>
                      {isMet ? (
                        <div className="p-1.5 bg-primary/10 rounded-full">
                           <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-100 mr-2" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-[#1a1a1a] text-white shadow-2xl rounded-3xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
               <Sparkles className="h-24 w-24" />
            </div>
            <CardContent className="p-8 space-y-8 relative z-10">
              <h4 className="font-display font-bold text-2xl flex items-center gap-3">
                <Star className="h-6 w-6 text-accent fill-accent" />
                Prossimi passi
              </h4>
              <ul className="space-y-6">
                {correction.next_steps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-4 text-gray-300">
                    <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black text-white">
                      {i + 1}
                    </div>
                    <span className="text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6 space-y-4">
                <Link href="/student/write" className="block">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-7 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
                    Invia un altro testo
                  </Button>
                </Link>
                <Link href="/student/tasks" className="block">
                  <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold py-7 rounded-2xl transition-all active:scale-[0.98]">
                    Vai ai compiti
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
