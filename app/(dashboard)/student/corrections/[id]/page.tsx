import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import {
  CheckCircle2,
  FileSearch,
  Sparkles,
  Target,
  Star,
  ArrowRight
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
    <div className="max-w-5xl mx-auto space-y-12 pb-24 animate-in fade-in duration-1000 px-4 md:px-0">
      {/* Header Section */}
      <CorrectionHeader
        level={correction.detected_level}
        targetLevel={correction.writings.target_level}
        score={correction.overall_score}
        examCompliant={correction.exam_compliant}
        xpEarned={correction.xp_earned}
      />

      {/* Examiner & Performance Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
            <ExaminerCard comment={correction.examiner_comment} />
        </div>
        <div className="lg:col-span-4">
            <RadarChart data={radarData} />
        </div>
      </div>

      {/* Main Text Analysis Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <FileSearch className="h-5 w-5 text-primary" />
            </div>
            <div>
                <h3 className="text-2xl font-display font-bold text-gray-900">Analisi del Testo</h3>
                <p className="text-gray-500 text-xs font-medium">Revisione parola per parola e correzioni suggerite.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <Card className="lg:col-span-8 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardContent className="p-8 md:p-10">
                    <AnnotatedText
                        originalText={correction.writings.content}
                        correctedText={correction.corrected_text}
                        corrections={correction.inline_corrections}
                    />
                </CardContent>
            </Card>

            <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h3 className="font-display font-bold text-lg text-gray-900">Analisi dettagliata</h3>
                    <Badge className="bg-gray-100 text-gray-500 border-none font-bold rounded-full text-[10px]">
                        {correction.inline_corrections.length} error{correction.inline_corrections.length === 1 ? 'e' : 'i'}
                    </Badge>
                </div>
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {correction.inline_corrections.map((c: any, i: number) => (
                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 items-start group hover:border-primary/20 transition-all shadow-sm">
                        <div className={cn(
                        "shrink-0 w-1 h-10 rounded-full mt-1",
                    (c.error_type === 'grammatica' || c.error_type === 'gramatica' || c.error_type === 'Grammatica') ? 'bg-secondary' :
                    (c.error_type === 'lessico' || c.error_type === 'vocabulario' || c.error_type === 'Lessico') ? 'bg-accent' :
                    (c.error_type === 'ortografia' || c.error_type === 'Ortografia') ? 'bg-blue-400' :
                        'bg-purple-400'
                        )} />
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{c.error_type}</span>
                            <span className="text-[10px] font-bold text-secondary/60 line-through truncate ml-2">{c.original}</span>
                        </div>
                        <p className="font-bold text-gray-900 text-base leading-tight">{c.corrected}</p>
                        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">{c.explanation}</p>
                        </div>
                    </div>
                    ))}
                    {correction.inline_corrections.length === 0 && (
                        <div className="text-center py-10 px-6 bg-primary/5 rounded-3xl border border-dashed border-primary/20">
                            <Sparkles className="h-6 w-6 text-primary mx-auto mb-3" />
                            <p className="font-bold text-primary text-sm">Nessun errore rilevato!</p>
                            <p className="text-[10px] text-primary/60 mt-1">Ottimo lavoro, il testo è eccellente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Pros/Cons/Suggestions Tabs */}
      <section className="space-y-6">
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="bg-gray-100/50 border border-gray-100 p-1 rounded-2xl w-full flex gap-1 shadow-sm mb-6 h-auto">
              <TabsTrigger
                value="strengths"
                className="flex-1 rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-white font-bold transition-all text-xs h-full"
              >
                Punti di forza ✅
              </TabsTrigger>
              <TabsTrigger
                value="to_improve"
                className="flex-1 rounded-xl px-6 data-[state=active]:bg-secondary data-[state=active]:text-white font-bold transition-all text-xs h-full"
              >
                Aree da migliorare ⚠️
              </TabsTrigger>
              <TabsTrigger
                value="suggestions"
                className="flex-1 rounded-xl px-6 data-[state=active]:bg-accent data-[state=active]:text-white font-bold transition-all text-xs h-full"
              >
                Suggerimenti 💡
              </TabsTrigger>
            </TabsList>

            <TabsContent value="strengths" className="space-y-4 outline-none">
              <div className="flex flex-col gap-4">
                {correction.pros.map((pro: string, i: number) => (
                    <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary group-hover:w-1.5 transition-all" />
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <div className="w-full">
                        <p className="text-gray-800 leading-relaxed text-sm font-medium">{pro}</p>
                        </div>
                    </CardContent>
                    </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="to_improve" className="space-y-4 outline-none">
              <div className="flex flex-col gap-4">
                {correction.cons.map((con: string, i: number) => (
                    <Card key={i} className="border-none shadow-sm bg-white overflow-hidden group w-full">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary group-hover:w-1.5 transition-all" />
                    <CardContent className="p-6 flex items-start gap-4">
                        <div className="p-2 bg-secondary/10 rounded-xl shrink-0">
                        <Target className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="w-full">
                        <p className="text-gray-800 leading-relaxed text-sm font-medium">{con}</p>
                        </div>
                    </CardContent>
                    </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4 outline-none">
              <div className="flex flex-col gap-4">
                {correction.suggestions.map((sug: any, i: number) => (
                    <Card key={i} className="border-none shadow-sm bg-white group w-full">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-2">
                        <Badge className="bg-accent/10 text-accent-dark hover:bg-accent/20 border-none px-3 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
                            {sug.category}
                        </Badge>
                        </div>
                        <div className="space-y-3 w-full">
                        <p className="font-display font-bold text-base text-gray-900 leading-snug">{sug.tip}</p>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100/50 text-xs italic leading-relaxed text-gray-600">
                            <span className="text-primary font-bold uppercase text-[9px] tracking-widest mr-2 not-italic">Esempio:</span>
                            &ldquo;{sug.example}&rdquo;
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
      </section>

      {/* Footer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-8 space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progresso per livelli</h4>
              <div className="grid grid-cols-1 gap-2">
                {levels.map((l) => {
                  const isMet = correction.meets_level_requirements[l]
                  const isCurrent = correction.detected_level === l
                  return (
                    <div key={l} className={cn(
                        "flex items-center justify-between p-3 rounded-2xl transition-all border",
                        isCurrent ? "bg-primary/5 border-primary/10 shadow-sm" : "border-transparent"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border transition-all",
                          isMet ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-400 border-gray-100"
                        )}>
                          {l}
                        </div>
                        {isCurrent && <Badge className="text-[9px] bg-accent font-black tracking-widest px-2 py-0 border-none">ATTUALE</Badge>}
                      </div>
                      {isMet ? (
                        <div className="p-1 bg-primary/10 rounded-full">
                           <CheckCircle2 className="h-3 w-3 text-primary" />
                        </div>
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-200 mr-2" />
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-gray-900 text-white shadow-xl rounded-3xl overflow-hidden relative group w-full">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform">
               <Sparkles className="h-32 w-32" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10 flex flex-col">
              <h4 className="font-display font-bold text-xl flex items-center gap-2">
                <Star className="h-5 w-5 text-accent fill-accent" />
                Prossimi passi
              </h4>
              <ul className="space-y-4">
                {correction.next_steps.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-white">
                      {i + 1}
                    </div>
                    <span className="text-xs leading-relaxed font-medium">{step}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/student/write">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white font-bold h-12 rounded-xl text-xs transition-all active:scale-[0.98]">
                    Nuovo testo
                  </Button>
                </Link>
                <Link href="/student/tasks">
                  <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold h-12 rounded-xl text-xs transition-all active:scale-[0.98]">
                    Compiti
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
