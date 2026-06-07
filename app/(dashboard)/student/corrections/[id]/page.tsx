import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import {
  CheckCircle2, Star, ArrowRight, FileSearch,
  Sparkles, Target, ShieldCheck, Quote
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { CorrectionHeader } from "@/components/student/CorrectionHeader"
import { AnnotatedText } from "@/components/student/AnnotatedText"
import { RadarChart } from "@/components/student/RadarChart"
import Link from "next/link"

export default async function CorrectionResultPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const adminSupabase = createAdminClient()
  const { data: correction } = await adminSupabase
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
  const pros = Array.isArray(correction.pros) ? correction.pros : []
  const cons = Array.isArray(correction.cons) ? correction.cons : []
  const suggestions = Array.isArray(correction.suggestions) ? correction.suggestions : []
  const nextSteps = Array.isArray(correction.next_steps) ? correction.next_steps : []
  const inlineCorrections = Array.isArray(correction.inline_corrections) ? correction.inline_corrections : []

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24 px-4 md:px-0">

      {/* HEADER */}
      <CorrectionHeader
        level={correction.detected_level}
        targetLevel={correction.writings?.target_level}
        score={correction.overall_score}
        examCompliant={correction.exam_compliant}
        xpEarned={correction.xp_earned}
      />

      {/* ESAMINATORE + RADAR */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Esaminatore */}
        <Card className="lg:col-span-3 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-accent via-accent/60 to-transparent" />
          <CardContent className="p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Rapporto dell&apos;Esaminatore</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Maestria AI Assessment</p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm italic">
              {correction.examiner_comment}
            </p>
            <div className="pt-2 border-t border-gray-50 flex justify-end">
              <div className="text-right">
                <p className="font-bold text-gray-800 text-sm">Maestria AI</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Valutazione Professionale</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Radar */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Il tuo profilo</p>
            <RadarChart data={radarData} />
          </CardContent>
        </Card>

      </div>

      {/* TABS: PUNTI DI FORZA / AREE / SUGGERIMENTI */}
      <Card className="border-none shadow-sm rounded-3xl bg-white overflow-hidden">
        <CardContent className="p-6 md:p-8">
          <Tabs defaultValue="strengths" className="w-full">
            <TabsList className="bg-gray-50 p-1 h-11 rounded-xl w-full flex gap-1 mb-6">
              <TabsTrigger
                value="strengths"
                className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all"
              >
                ✅ Punti di forza
              </TabsTrigger>
              <TabsTrigger
                value="to_improve"
                className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-secondary data-[state=active]:text-white transition-all"
              >
                ⚠️ Aree da migliorare
              </TabsTrigger>
              <TabsTrigger
                value="suggestions"
                className="flex-1 rounded-lg text-xs font-bold data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all"
              >
                💡 Suggerimenti
              </TabsTrigger>
            </TabsList>

            {/* Punti di forza */}
            <TabsContent value="strengths">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pros.map((pro: string, i: number) => (
                  <div key={i} className="bg-green-50 border border-green-100 rounded-2xl p-5 flex items-start gap-3">
                    <div className="p-1.5 bg-green-100 rounded-lg shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{pro}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Aree da migliorare */}
            <TabsContent value="to_improve">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cons.map((con: string, i: number) => (
                  <div key={i} className="bg-red-50 border border-red-100 rounded-2xl p-5 flex items-start gap-3">
                    <div className="p-1.5 bg-red-100 rounded-lg shrink-0 mt-0.5">
                      <Target className="h-4 w-4 text-red-500" />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{con}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Suggerimenti */}
            <TabsContent value="suggestions">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((sug: any, i: number) => (
                  <div key={i} className="bg-amber-50 border border-amber-100 rounded-2xl p-5 space-y-3">
                    <Badge className="bg-amber-100 text-amber-700 border-none text-[10px] font-black uppercase tracking-wider">
                      {sug.category}
                    </Badge>
                    <p className="font-bold text-gray-900 text-sm leading-snug">{sug.tip}</p>
                    <div className="bg-white rounded-xl p-3 border border-amber-100">
                      <p className="text-xs text-gray-500 italic">&ldquo;{sug.example}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ANALISI DEL TESTO */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <FileSearch className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-xl">Analisi del Testo</h3>
            <p className="text-gray-400 text-xs">Revisione e correzioni suggerite</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Testo corretto */}
          <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <AnnotatedText
                originalText={correction.writings?.content}
                correctedText={correction.corrected_text}
                corrections={inlineCorrections}
              />
            </CardContent>
          </Card>

          {/* Errori dettagliati */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="font-bold text-gray-900 text-sm">Errori rilevati</h4>
              <Badge className="bg-gray-100 text-gray-500 border-none text-xs font-bold rounded-full">
                {inlineCorrections.length}
              </Badge>
            </div>

            {inlineCorrections.length === 0 ? (
              <div className="text-center py-10 bg-green-50 rounded-2xl border border-dashed border-green-200">
                <Sparkles className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <p className="font-bold text-green-700 text-sm">Nessun errore!</p>
                <p className="text-xs text-green-500 mt-1">Ottimo lavoro 🎉</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {inlineCorrections.map((c: any, i: number) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                        c.error_type === 'gramatica' ? 'bg-red-100 text-red-600' :
                        c.error_type === 'vocabulario' ? 'bg-amber-100 text-amber-600' :
                        c.error_type === 'ortografia' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      )}>
                        {c.error_type}
                      </span>
                      <span className="text-xs text-gray-400 line-through">{c.original}</span>
                      <span className="text-xs">→</span>
                      <span className="text-xs font-bold text-gray-800">{c.corrected}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{c.explanation}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER: PROGRESSO + PROSSIMI PASSI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Progresso livelli */}
        <Card className="border-none shadow-sm rounded-3xl bg-white">
          <CardContent className="p-6 space-y-5">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Progresso per livelli</h4>
            <div className="space-y-3">
              {levels.map((l) => {
                const isMet = correction.meets_level_requirements?.[l]
                const isCurrent = correction.detected_level === l
                return (
                  <div key={l} className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all",
                      isMet ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                    )}>
                      {l}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn(
                        "h-full rounded-full transition-all",
                        isMet ? "bg-primary" : "bg-transparent"
                      )} style={{ width: isMet ? '100%' : '0%' }} />
                    </div>
                    {isCurrent && (
                      <Badge className="text-[10px] bg-accent/20 text-accent border-none font-black tracking-wider shrink-0">
                        ATTUALE
                      </Badge>
                    )}
                    {isMet && !isCurrent && (
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Prossimi passi */}
        <Card className="border-none bg-gray-900 text-white shadow-xl rounded-3xl overflow-hidden">
          <CardContent className="p-6 space-y-5">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-accent fill-accent" />
              Prossimi passi
            </h4>
            <ul className="space-y-4">
              {nextSteps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                    {i + 1}
                  </div>
                  <span className="text-sm leading-relaxed text-gray-300">{step}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4 space-y-3">
              <Link href="/student/write" className="block">
                <Button className="w-full bg-primary hover:bg-primary-dark font-bold rounded-xl py-6">
                  Invia un altro testo <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/student/tasks" className="block">
                <Button variant="outline" className="w-full border-white/20 hover:bg-white/10 text-white font-bold rounded-xl py-6">
                  Vai ai compiti
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
