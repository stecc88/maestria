"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TheoryCard } from "@/components/student/TheoryCard"
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

export default function ExerciseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [exercise, setExercise] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showTheory, setShowTheory] = useState(true)

  useEffect(() => {
    const fetchExercise = async () => {
      const { data, error } = await supabase
        .from("structure_exercises")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error || !data) {
        toast.error("Esercizio non trovato")
        router.push("/student/exercises")
        return
      }

      setExercise(data)
      setIsLoading(false)
    }

    fetchExercise()
  }, [params.id, router, supabase])

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    // Check if all fields are filled
    const totalItems = exercise.exercise_type === "situazionale"
      ? exercise.content.items.length
      : exercise.content.blanks.length

    if (Object.keys(answers).length < totalItems) {
      toast.error("Per favore, rispondi a tutte le domande prima di correggere.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/check-structure-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId: exercise.id, answers })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore nella correzione")

      setResult(data)
      setShowTheory(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="text-gray-500 font-medium font-display">Caricamento esercizio...</p>
      </div>
    )
  }

  // Render text with placeholders
  const renderTextWithPlaceholders = () => {
    const parts = exercise.content.text_with_placeholders.split(/(\{\{\d+\}\})/)
    return (
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm leading-[3] text-lg text-gray-800 font-body">
        {parts.map((part: string, i: number) => {
          const match = part.match(/\{\{(\d+)\}\}/)
          if (match) {
            const id = match[1]
            const blank = exercise.content.blanks.find((b: any) => b.id.toString() === id)
            const isCorrected = result?.blank_feedback?.find((f: any) => f.id.toString() === id)

            return (
              <span key={i} className="inline-block mx-1 relative group">
                {blank.options ? (
                  <select
                    value={answers[id] || ""}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    disabled={!!result}
                    className={cn(
                      "min-w-[120px] px-3 py-1 rounded-lg border-2 text-sm font-bold appearance-none cursor-pointer transition-all outline-none",
                      !result && "border-primary/20 bg-primary/5 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10",
                      result && isCorrected?.isCorrect && "border-green-500 bg-green-50 text-green-700",
                      result && !isCorrected?.isCorrect && "border-red-500 bg-red-50 text-red-700"
                    )}
                  >
                    <option value="">...</option>
                    {Object.entries(blank.options).map(([key, val]) => (
                      <option key={key} value={key}>{val as string}</option>
                    ))}
                  </select>
                ) : (
                  <div className="inline-flex flex-col">
                    <input
                      type="text"
                      value={answers[id] || ""}
                      onChange={(e) => handleInputChange(id, e.target.value)}
                      disabled={!!result}
                      placeholder={blank.hint || "..."}
                      className={cn(
                        "w-32 px-3 py-1 rounded-lg border-2 text-sm font-bold text-center transition-all outline-none",
                        !result && "border-primary/20 bg-primary/5 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10",
                        result && isCorrected?.isCorrect && "border-green-500 bg-green-50 text-green-700",
                        result && !isCorrected?.isCorrect && "border-red-500 bg-red-50 text-red-700"
                      )}
                    />
                  </div>
                )}
                {result && !isCorrected?.isCorrect && (
                   <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10">
                     Corretto: {isCorrected.correctAnswer}
                   </span>
                )}
              </span>
            )
          }
          return <span key={i}>{part}</span>
        })}
      </div>
    )
  }

  // Render situational items
  const renderSituationalItems = () => {
    return (
      <div className="space-y-6">
        {exercise.content.items.map((item: any) => {
          const isCorrected = result?.blank_feedback?.find((f: any) => f.id.toString() === item.id.toString())
          return (
            <Card key={item.id} className={cn(
              "overflow-hidden border-2 transition-all",
              !result && "border-gray-100",
              result && isCorrected?.isCorrect && "border-green-500 bg-green-50/30",
              result && !isCorrected?.isCorrect && "border-red-500 bg-red-50/30"
            )}>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold shrink-0 mt-1">
                    {item.id}
                  </span>
                  <p className="text-lg font-medium text-gray-900 leading-relaxed italic">
                    &quot;{item.statement}&quot;
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-9">
                  {Object.entries(item.options).map(([key, val]) => (
                    <button
                      key={key}
                      disabled={!!result}
                      onClick={() => handleInputChange(item.id.toString(), key)}
                      className={cn(
                        "text-left p-3 rounded-xl border-2 text-sm transition-all",
                        answers[item.id.toString()] === key
                          ? "border-primary bg-primary text-white font-bold"
                          : "border-gray-50 bg-gray-50/50 text-gray-600 hover:border-primary/20",
                        result && key === isCorrected?.correctAnswer && "border-green-500 bg-green-500 text-white shadow-sm",
                        result && answers[item.id.toString()] === key && key !== isCorrected?.correctAnswer && "border-red-500 bg-red-500 text-white"
                      )}
                    >
                      <span className="mr-2 uppercase opacity-60">{key}.</span> {val as string}
                    </button>
                  ))}
                </div>

                {result && (
                  <div className={cn(
                    "mt-4 p-3 rounded-lg text-xs flex gap-2 items-start",
                    isCorrected.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>
                    {isCorrected.isCorrect ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                    <p>{isCorrected.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="space-y-4">
        <Link href="/student/exercises">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-primary gap-1 -ml-2">
            <ChevronLeft className="h-4 w-4" /> Altri esercizi
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
              <GraduationCap className="h-3 w-3" /> CILS {exercise.level} — {exercise.exercise_type.replace('_', ' ')}
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900">{exercise.title}</h1>
          </div>
          {result && (
            <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl border-2 border-primary shadow-sm">
               <div className="text-center">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Punteggio</p>
                 <p className="text-2xl font-display font-bold text-primary">{result.score}%</p>
               </div>
            </div>
          )}
        </div>
      </header>

      {result && (
        <Card className="bg-primary border-none text-white shadow-xl shadow-primary/20 overflow-hidden relative">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Sparkles className="h-32 w-32" />
          </div>
          <CardContent className="p-8 space-y-4 relative z-10">
            <h2 className="text-xl font-display font-bold flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6" /> Feedback dell&apos;insegnante
            </h2>
            <p className="text-lg leading-relaxed font-medium">
              {result.general_feedback}
            </p>
            <Button
               variant="secondary"
               className="bg-white text-primary hover:bg-gray-100 font-bold"
               onClick={() => router.push("/student/exercises")}
            >
              Genera un altro esercizio
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {/* Theory Section */}
        <Card className="border-accent/20 bg-accent/5 overflow-hidden">
           <button
             onClick={() => setShowTheory(!showTheory)}
             className="w-full flex items-center justify-between p-6 hover:bg-accent/10 transition-colors"
           >
             <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-gray-900 font-display">📖 Prima di iniziare: Ripasso grammaticale</h2>
             </div>
             {showTheory ? "Nascondi" : "Mostra"}
           </button>
           <AnimatePresence>
             {showTheory && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                 <CardContent className="p-8 pt-0 border-t border-accent/10">
                   <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed font-body mt-6">
                     <ReactMarkdown>{exercise.theory}</ReactMarkdown>
                   </div>
                 </CardContent>
               </motion.div>
             )}
           </AnimatePresence>
        </Card>

        {/* Exercise Body */}
        <section className="space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
             <PenTool className="h-4 w-4" /> Esercizio
          </h2>

          {exercise.exercise_type === "situazionale"
            ? renderSituationalItems()
            : renderTextWithPlaceholders()
          }

          {/* Detailed explanations for fill-in-the-blanks */}
          {result && exercise.exercise_type !== "situazionale" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 font-display mt-10">Analisi degli errori</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.blank_feedback.map((f: any) => (
                  <div key={f.id} className={cn(
                    "p-4 rounded-xl border-l-4 text-sm flex gap-3",
                    f.isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
                  )}>
                    <span className="font-bold shrink-0">{f.id}.</span>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900">
                        {f.isCorrect ? "Corretto! ✅" : `Sbagliato. Corretto: ${f.correctAnswer} ❌`}
                      </p>
                      <p className="text-gray-600 leading-relaxed text-xs">{f.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {!result && (
          <footer className="pt-10 flex justify-center">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-16 px-12 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Correzione in corso...
                </>
              ) : (
                <>
                  Correggi esercizio ✅
                </>
              )}
            </Button>
          </footer>
        )}
      </div>
    </div>
  )
}

function PenTool({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l1.5 1.5" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  )
}
