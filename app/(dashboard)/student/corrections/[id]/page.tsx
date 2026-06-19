import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import {
  CheckCircle2, FileSearch, Sparkles, Target, Star,
  TrendingUp
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
    { subject: 'COMPITO', A: correction.score_task_completion, fullMark: 25 },
  ]

  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"]
  const pros = correction.pros || []
  const cons = correction.cons || []
  const suggestions = correction.suggestions || []
  const nextSteps = correction.next_steps || []
  const inlineCorrections = correction.inline_corrections || []

  const groupedErrors = inlineCorrections.reduce((acc: any, c: any) => {
    const key = c.error_type || "altro"
    if (!acc[key]) acc[key] = []
    acc[key].push(c)
    return acc
  }, {})
  const errorCategories = Object.keys(groupedErrors)

  const getCategoryDot = (cat: string) => cn(
    "w-1.5 h-1.5 rounded-full",
    cat.toLowerCase().includes('gramm') ? 'bg-secondary' :
    cat.toLowerCase().includes('lessic') ? 'bg-accent' :
    cat.toLowerCase().includes('ortograf') ? 'bg-blue-400' :
    cat.toLowerCase().includes('registro') ? 'bg-purple-400' :
    'bg-gray-400'
  )

  const getCategoryChip = (cat: string) => cn(
    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold",
    cat.toLowerCase().includes('gramm') ? 'bg-secondary/10 text-secondary' :
    cat.toLowerCase().includes('lessic') ? 'bg-accent/10 text-accent-dark' :
    cat.toLowerCase().includes('ortograf') ? 'bg-blue-50 text-blue-600' :
    cat.toLowerCase().includes('registro') ? 'bg-purple-50 text-purple-600' :
    'bg-gray-100 text-gray-600'
  )

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 animate-in fade-in duration-700 px-4 md:px-0">

      <CorrectionHeader
        level={correction.detected_level}
        targetLevel={correction.writings.target_level}
        score={correction.overall_score}
        examCompliant={correction.exam_compliant}
        xpEarned={correction.xp_earned}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 h-full">
          <ExaminerCard comment={correction.examiner_comment} />
        </div>
        <div className="lg:col-span-4 h-full">
          <RadarChart data={radarData} />
        </div>
      </div>

      <section className="space-y-5">
        <div className="flex items-center gap-3 px-1">
          <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-lg font-display font-bold text-gray-900">Analisi qualitativa</h3>
        </div>

        <Card className="relative border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-5 md:p-7">
            <Tabs defaultValue="strengths" className="w-full">
              <TabsList className="bg-gray-50 p-1 h-11 rounded-xl w-full flex gap-1 mb-6">
                <TabsTrigger value="strengths" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                  ✅ Punti di forza
                </TabsTrigger>
                <TabsTrigger value="to_improve" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-secondary data-[state=active]:text-white transition-all">
                  ⚠️ Aree da migliorare
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-accent data-[state=active]:text-white transition-all">
                  💡 Suggerimenti
                </TabsTrigger>
              </TabsList>

              <TabsContent value="strengths">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pros.map((pro: string, i: number) => (
                    <div
                      key={i}
                      className="relative bg-green-50/60 border border-green-100 rounded-2xl p-5 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="p-1.5 bg-green-100 rounded-lg shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-gray-700 text-[14px] leading-[1.7] font-medium">{pro}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="to_improve">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cons.map((con: string, i: number) => (
                    <div
                      key={i}
                      className="relative bg-red-50/60 border border-red-100 rounded-2xl p-5 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="p-1.5 bg-red-100 rounded-lg shrink-0 mt-0.5">
                        <Target className="h-4 w-4 text-red-500" />
                      </div>
                      <p className="text-gray-700 text-[14px] leading-[1.7] font-medium">{con}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="suggestions">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {suggestions.map((sug: any, i: number) => (
                    <div
                      key={i}
                      className="bg-amber-50/60 border border-amber-100 rounded-2xl p-5 space-y-3 animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black uppercase tracking-wider">
                        {sug.category}
                      </Badge>
                      <p className="font-bold text-gray-900 text-[14px] leading-snug">{sug.tip}</p>
                      <div className="bg-white rounded-xl p-3 border border-amber-100">
                        <p className="text-xs text-gray-500 italic leading-relaxed">&ldquo;{sug.example}&rdquo;</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <Card className="lg:col-span-5 h-full border-none shadow-sm rounded-3xl bg-white">
          <CardContent className="p-7 space-y-5 h-full flex flex-col">
            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest text-center">
              Progresso per livelli
            </h4>
            <div className="space-y-2.5 flex-1">
              {levels.map((l) => {
                const isMet = correction.meets_level_requirements?.[l]
                const isCurrent = correction.detected_level === l
                return (
                  <div key={l} className={cn(
                    "flex items-center gap-3 p-2.5 rounded-xl transition-all",
                    isCurrent && "bg-primary/5"
                  )}>
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all",
                      isMet ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                    )}>
                      {l}
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", isMet ? "bg-primary" : "bg-transparent")}
                        style={{ width: isMet ? '100%' : '0%' }}
                      />
                    </div>
                    {isCurrent ? (
                      <Badge className="text-[9px] bg-accent text-white border-none font-black tracking-wider shrink-0">
                        ATTUALE
                      </Badge>
                    ) : isMet ? (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <div className="h-4 w-4 shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 h-full border-none bg-gray-900 text-white shadow-xl rounded-3xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles className="h-28 w-28" />
          </div>
          <CardContent className="p-7 space-y-5 relative z-10 h-full flex flex-col">
            <h4 className="font-display font-bold text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-accent fill-accent" />
              Prossimi passi
            </h4>
            <ul className="space-y-4 flex-1">
              {nextSteps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                    {i + 1}
                  </div>
                  <span className="text-sm leading-relaxed text-gray-300">{step}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 grid grid-cols-2 gap-3">
              <Link href="/student/write">
                <Button className="w-full bg-primary hover:bg-primary-dark font-bold rounded-xl h-11 text-xs transition-all active:scale-[0.98]">
                  Nuovo testo
                </Button>
              </Link>
              <Link href="/student/tasks">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold rounded-xl h-11 text-xs transition-all active:scale-[0.98]">
                  Compiti
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3 px-1">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <FileSearch className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-gray-900">Analisi del Testo</h3>
              <p className="text-gray-400 text-xs">Dove hai sbagliato e come migliorare</p>
            </div>
          </div>
          <Badge className="bg-primary/5 text-primary border-primary/10 font-bold px-4 py-1.5 rounded-full">
            {inlineCorrections.length} correzioni
          </Badge>
        </div>

        {errorCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 px-1">
            {errorCategories.map((cat) => (
              <div key={cat} className={getCategoryChip(cat)}>
                <span className={getCategoryDot(cat)} />
                {cat} × {groupedErrors[cat].length}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <Card className="lg:col-span-7 h-full border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 md:p-9">
              <AnnotatedText
                originalText={correction.writings.content}
                correctedText={correction.corrected_text}
                corrections={inlineCorrections}
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-5 h-full border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 space-y-4 h-full">
              <h4 className="font-bold text-gray-900 text-sm px-1">Correzioni nel dettaglio</h4>

              {inlineCorrections.length === 0 ? (
                <div className="text-center py-12 px-6 bg-primary/5 rounded-2xl border border-dashed border-primary/20 h-full flex flex-col items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="font-bold text-primary text-sm">Nessun errore rilevato!</p>
                  <p className="text-[11px] text-primary/60 mt-1">Testo grammaticalmente perfetto.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {inlineCorrections.map((c: any, i: number) => (
                    <div key={i} className="rounded-2xl bg-gray-50/60 border border-gray-100 overflow-hidden">
                      <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center gap-2">
                        <span className={getCategoryDot(c.error_type || "altro")} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {c.error_type}
                        </span>
                      </div>

                      <div className="p-4 space-y-3">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Hai scritto</p>
                          <p className="text-sm text-gray-500 line-through leading-relaxed">{c.original}</p>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1">Forma corretta</p>
                          <p className="text-sm font-bold text-gray-900 leading-relaxed">{c.corrected}</p>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500 leading-relaxed italic">{c.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
