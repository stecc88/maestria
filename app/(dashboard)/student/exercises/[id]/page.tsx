"use client"

import React, { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Sparkles,
  BookOpen,
  ChevronDown,
  Star,
  RotateCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

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

  const totalItems = useMemo(() => {
    if (!exercise?.content) return 0
    return exercise.exercise_type === "situazionale"
      ? exercise.content.items?.length || 0
      : exercise.content.blanks?.length || 0
  }, [exercise])

  const answeredCount = useMemo(() => {
    return Object.keys(answers).filter(k => answers[k] !== undefined && answers[k].trim() !== "").length
  }, [answers])

  const progressPercentage = useMemo(() => {
    if (totalItems === 0) return 0
    return (answeredCount / totalItems) * 100
  }, [answeredCount, totalItems])

  const handleInputChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async () => {
    if (answeredCount < totalItems) {
      toast.error(`Per favore, rispondi a tutte le domande (${answeredCount}/${totalItems}) prima di correggere.`)
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
      toast.success("Esercizio corretto!")

      if (data.score >= 80) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#22c55e", "#eab308", "#ef4444"]
        })
      }

      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sparkles className="h-6 w-6 text-accent" />
          </motion.div>
        </div>
        <p className="text-muted-foreground font-bold text-xl animate-pulse">Caricamento esercizio...</p>
      </div>
    )
  }

  const renderTextWithPlaceholders = () => {
    if (!exercise?.content?.text_with_placeholders) return null

    const parts = exercise.content.text_with_placeholders.split(/(\{\{\s*\d+\s*\}\})/)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card p-6 md:p-10 rounded-3xl border-2 border-border shadow-xl shadow-gray-200/50 leading-[3] text-lg md:text-xl text-gray-800 font-medium"
      >
        {parts.map((part: string, i: number) => {
          const match = part.match(/\{\{\s*(\d+)\s*\}\}/)
          if (match) {
            const id = match[1]
            const blank = exercise.content.blanks?.find((b: any) => b.id.toString() === id)
            const feedback = result?.blank_feedback?.find((f: any) => f.id.toString() === id)

            if (!blank) return <span key={i} className="text-red-400">[{id}]</span>

            return (
              <span key={i} className="inline-block mx-1 relative group align-middle">
                {blank.options ? (
                  <select
                    value={answers[id] || ""}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    disabled={!!result}
                    className={cn(
                      "min-w-[140px] h-10 px-4 rounded-xl border-2 text-base font-bold appearance-none cursor-pointer transition-all outline-none",
                      !result && "border-primary/20 bg-primary/5 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10",
                      result && feedback?.isCorrect && "border-green-500 bg-green-50 text-green-700",
                      result && !feedback?.isCorrect && "border-red-500 bg-red-50 text-red-700"
                    )}
                  >
                    <option value="">...</option>
                    {Object.entries(blank.options).map(([key, val]) => (
                      <option key={key} value={key}>{val as string}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={answers[id] || ""}
                    onChange={(e) => handleInputChange(id, e.target.value)}
                    disabled={!!result}
                    placeholder={blank.hint || "..."}
                    className={cn(
                      "w-36 h-10 px-4 rounded-xl border-2 text-base font-bold text-center transition-all outline-none",
                      !result && "border-primary/20 bg-primary/5 hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/10",
                      result && feedback?.isCorrect && "border-green-500 bg-green-50 text-green-700",
                      result && !feedback?.isCorrect && "border-red-500 bg-red-50 text-red-700"
                    )}
                  />
                )}
                <AnimatePresence>
                  {result && feedback && !feedback.isCorrect && (
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl"
                    >
                      Corretto: {feedback.correctAnswer}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            )
          }
          return <span key={i}>{part}</span>
        })}
      </motion.div>
    )
  }

  const renderSituationalItems = () => {
    return (
      <div className="space-y-6">
        {exercise.content.items.map((item: any, idx: number) => {
          const feedback = result?.blank_feedback?.find((f: any) => f.id.toString() === item.id.toString())
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={cn(
                "relative overflow-hidden border-4 transition-all duration-300",
                !result && "border-border hover:border-primary/20 hover:shadow-xl shadow-gray-200/50",
                result && feedback?.isCorrect && "border-green-500 bg-green-50/30",
                result && !feedback?.isCorrect && "border-red-500 bg-red-50/30"
              )}>
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-muted rounded-full flex items-end justify-start p-6 text-4xl font-black text-gray-100 -z-0">
                  {item.id}
                </div>

                <CardContent className="p-6 md:p-8 space-y-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <p className="text-xl md:text-2xl font-black text-foreground leading-tight italic">
                      &quot;{item.statement}&quot;
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(item.options).map(([key, val]: [string, any]) => {
                      const isSelected = answers[item.id.toString()] === key
                      const isCorrect = key === feedback?.correctAnswer
                      const isWrong = isSelected && !isCorrect && !!result

                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={!!result}
                          onClick={() => handleInputChange(item.id.toString(), key)}
                          className={cn(
                            "group relative flex items-center p-5 rounded-2xl border-2 transition-all text-left font-bold",
                            !result && isSelected && "border-primary bg-primary text-white shadow-lg shadow-primary/20",
                            !result && !isSelected && "border-border bg-gray-50/50 text-muted-foreground hover:border-primary/30 hover:bg-card",
                            result && isCorrect && "border-green-500 bg-green-500 text-white shadow-lg",
                            result && isWrong && "border-red-500 bg-red-500 text-white shadow-lg",
                            result && !isCorrect && !isWrong && "border-border bg-muted opacity-50"
                          )}
                        >
                          <span className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg mr-4 text-sm font-black transition-colors",
                            isSelected || (result && isCorrect) ? "bg-white/20 text-white" : "bg-gray-200 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                          )}>
                            {key.toUpperCase()}
                          </span>
                          <span className="flex-1">{val as string}</span>
                          {isSelected && !result && (
                            <motion.div layoutId={`check-${item.id}`} className="ml-2">
                              <CheckCircle2 className="h-6 w-6 text-white" />
                            </motion.div>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <AnimatePresence>
                    {result && feedback && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className={cn(
                          "p-5 rounded-2xl text-sm font-bold flex gap-3 items-start",
                          feedback.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}
                      >
                        {feedback.isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                        <p>{feedback.explanation}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-border -mx-4 px-4 py-4 md:rounded-b-[2rem] md:mx-0 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link href="/student/exercises">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-1 font-bold">
              <ChevronLeft className="h-4 w-4" /> Esci
            </Button>
          </Link>

          <div className="flex-1 text-center truncate px-4">
            <h1 className="text-lg md:text-xl font-black text-foreground truncate">{exercise.title}</h1>
          </div>

          <div className={cn(
            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg",
            exercise.level === "A2" ? "bg-emerald-500" :
            exercise.level === "B1" ? "bg-blue-500" :
            exercise.level === "B2" ? "bg-purple-500" : "bg-orange-500"
          )}>
            {exercise.level}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-3 w-full bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result ? 100 : progressPercentage}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className={cn(
              "h-full rounded-full transition-colors",
              result ? "bg-green-500" : "bg-primary"
            )}
          />
        </div>
      </header>

      {/* Result Screen */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
          >
            <Card className="bg-gray-900 border-none text-white shadow-2xl overflow-hidden relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -right-20 -bottom-20 opacity-10"
              >
                <Star className="h-64 w-64 fill-white" />
              </motion.div>

              <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* SVG Progress Circle */}
                <div className="relative w-40 h-40 shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-white/10 stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                    <motion.circle
                      className={cn(
                        "stroke-current transition-colors duration-1000",
                        result.score >= 80 ? "text-green-400" : result.score >= 60 ? "text-yellow-400" : "text-red-400"
                      )}
                      strokeWidth="10"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      initial={{ strokeDasharray: "0 251" }}
                      animate={{ strokeDasharray: `${(result.score * 251) / 100} 251` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-4xl font-black"
                    >
                      {result.score}%
                    </motion.span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-3xl md:text-4xl font-black"
                  >
                    {result.score >= 80 ? "Eccellente! 🎉" : result.score >= 60 ? "Buon lavoro! 💪" : "Continua a esercitarti! 📚"}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-gray-300 text-lg leading-relaxed font-medium"
                  >
                    {result.general_feedback}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Link href="/student/exercises">
                      <Button className="bg-card text-foreground hover:bg-muted font-black px-8 py-6 rounded-2xl gap-2 text-lg shadow-xl shadow-white/10 group">
                        <RotateCcw className="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
                        PROVA UN ALTRO ESERCIZIO
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8 px-1 md:px-0">
        {/* Theory Section */}
        <Card className="border-2 border-accent/20 bg-accent/5 rounded-3xl overflow-hidden">
           <button
             onClick={() => setShowTheory(!showTheory)}
             className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-accent/10 transition-colors"
           >
             <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-2xl">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-black text-foreground">Prima di iniziare</h2>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-wider">Ripasso grammaticale</p>
                </div>
             </div>
             <motion.div
               animate={{ rotate: showTheory ? 0 : 180 }}
               className="p-2 bg-card rounded-full shadow-sm"
             >
               <ChevronDown className="h-6 w-6 text-accent" />
             </motion.div>
           </button>
           <AnimatePresence>
             {showTheory && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                 <CardContent className="p-8 pt-0 border-t border-accent/10 bg-white/50">
                   <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed font-medium mt-6 prose-p:mb-4 prose-strong:text-accent prose-headings:text-foreground prose-headings:font-black">
                     <ReactMarkdown>{exercise.theory}</ReactMarkdown>
                   </div>
                 </CardContent>
               </motion.div>
             )}
           </AnimatePresence>
        </Card>

        {/* Exercise Body */}
        <section className="space-y-6">
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-xl font-black text-foreground flex items-center gap-3">
               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                 <Sparkles className="h-6 w-6 text-primary" />
               </div>
               Esercizio
            </h2>
            {!result && (
              <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">
                {answeredCount}/{totalItems} completati
              </span>
            )}
          </div>

          {exercise.exercise_type === "situazionale"
            ? renderSituationalItems()
            : renderTextWithPlaceholders()
          }

          {/* Detailed explanations for fill-in-the-blanks */}
          {result && exercise.exercise_type !== "situazionale" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-black text-foreground mt-12 mb-6 px-2">Analisi degli errori 🧐</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.blank_feedback.map((f: any, idx: number) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "p-6 rounded-3xl border-2 shadow-sm flex gap-4",
                      f.isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-white shadow-lg",
                      f.isCorrect ? "bg-green-500" : "bg-red-500"
                    )}>
                      {f.id}
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-foreground text-lg">
                        {f.isCorrect ? "Ottimo! ✅" : `Risposta: ${f.correctAnswer} ❌`}
                      </p>
                      <p className="text-muted-foreground leading-relaxed font-medium text-sm italic">
                        &quot;{f.explanation}&quot;
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        {!result && (
          <footer className={cn(
            "pt-10 flex flex-col items-center gap-4",
            "fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border z-40 md:relative md:bg-transparent md:border-none md:p-0"
          )}>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount < totalItems}
              className={cn(
                "w-full md:w-auto h-16 md:h-20 px-12 md:px-16 rounded-2xl md:rounded-3xl text-xl font-black gap-3 shadow-2xl transition-all",
                answeredCount === totalItems
                  ? "bg-primary hover:scale-105 active:scale-95 shadow-primary/30"
                  : "bg-gray-200 text-muted-foreground cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  CORREZIONE...
                </>
              ) : (
                <>
                  CORREGGI ORA ✅
                </>
              )}
            </Button>
            <p className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-[0.2em] hidden md:block">
               Verifica le tue risposte prima di procedere
            </p>
          </footer>
        )}
      </div>
    </div>
  )
}
