import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import {
  CheckCircle2,
  ChevronRight,
  Star,
  ArrowRight,
  FileText,
  Plus,
  BookOpen
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
    { subject: 'Coherencia', A: correction.score_coherence, fullMark: 25 },
    { subject: 'Léxico', A: correction.score_vocabulary, fullMark: 25 },
    { subject: 'Gramática', A: correction.score_grammar, fullMark: 25 },
    { subject: 'Tarea', A: correction.score_task_completion, fullMark: 25 },
  ]

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in duration-1000">
      {/* Header Section */}
      <CorrectionHeader
        level={correction.detected_level}
        targetLevel={correction.writings.target_level}
        score={correction.overall_score}
        examCompliant={correction.exam_compliant}
        xpEarned={correction.xp_earned}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analysis Column */}
        <div className="lg:col-span-2 space-y-12">
          <ExaminerCard comment={correction.examiner_comment} />

          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="bg-white border border-gray-100 p-1 h-14 rounded-2xl w-full justify-start gap-2 px-2">
              <TabsTrigger value="strengths" className="rounded-xl data-[state=active]:bg-primary/5 data-[state=active]:text-primary font-bold">
                Fortalezas ✅
              </TabsTrigger>
              <TabsTrigger value="to_improve" className="rounded-xl data-[state=active]:bg-secondary/5 data-[state=active]:text-secondary font-bold">
                Áreas a mejorar ⚠️
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="rounded-xl data-[state=active]:bg-accent/5 data-[state=active]:text-accent font-bold">
                Sugerencias 💡
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strengths" className="mt-6 space-y-4">
              {correction.pros.map((pro: string, i: number) => (
                <Card key={i} className="border-gray-100 shadow-sm">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{pro}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="to_improve" className="mt-6 space-y-4">
              {correction.cons.map((con: string, i: number) => (
                <Card key={i} className="border-gray-100 shadow-sm">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="p-2 bg-secondary/10 rounded-lg shrink-0">
                      <ChevronRight className="h-5 w-5 text-secondary" />
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{con}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="suggestions" className="mt-6 space-y-4">
              {correction.suggestions.map((sug: any, i: number) => (
                <Card key={i} className="border-gray-100 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-accent border-accent/20 bg-accent/5">
                        {sug.category}
                      </Badge>
                    </div>
                    <p className="font-bold text-gray-900 mb-2">{sug.tip}</p>
                    <div className="p-3 bg-cream rounded-lg border border-gray-100 text-sm italic">
                      <span className="text-primary font-bold mr-2">Esempio:</span>
                      {sug.example}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

          <section className="space-y-6">
            <h3 className="text-2xl font-display font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Análisis del texto
            </h3>
            <AnnotatedText
              originalText={correction.writings.content}
              correctedText={correction.corrected_text}
              corrections={correction.inline_corrections}
            />
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <RadarChart data={radarData} />

          <Card className="border-gray-100">
            <CardContent className="p-6 space-y-6">
              <h4 className="font-bold text-gray-900">Progreso por niveles</h4>
              <div className="space-y-4">
                {levels.map((l) => {
                  const isMet = correction.meets_level_requirements[l]
                  const isCurrent = correction.detected_level === l
                  return (
                    <div key={l} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border",
                          isMet ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-400 border-gray-100"
                        )}>
                          {l}
                        </div>
                        {isCurrent && <Badge className="text-[10px] bg-accent">Nivel Actual</Badge>}
                      </div>
                      {isMet ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-100" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-100 bg-gray-900 text-white shadow-xl">
            <CardContent className="p-6 space-y-6">
              <h4 className="font-bold flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" />
                Próximos pasos
              </h4>
              <ul className="space-y-4">
                {correction.next_steps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      {i + 1}
                    </div>
                    {step}
                  </li>
                ))}
              </ul>
              <div className="pt-4 space-y-3">
                <Link href="/student/write" className="block">
                  <Button className="w-full bg-primary hover:bg-primary-dark font-bold gap-2">
                    Enviar otro texto <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/student/tasks" className="block">
                  <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold gap-2">
                    Ver mis tareas <BookOpen className="h-4 w-4" />
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
