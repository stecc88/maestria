"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Sparkles,
  Type,
  Repeat,
  ListChecks,
  MessageCircle,
  Flame,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

const LEVELS = [
  { id: "A2", gradient: "from-emerald-400 to-emerald-600", flames: 1 },
  { id: "B1", gradient: "from-blue-400 to-blue-600", flames: 2 },
  { id: "B2", gradient: "from-purple-400 to-purple-600", flames: 3 },
  { id: "C1", gradient: "from-orange-400 to-orange-600", flames: 4 },
] as const

const EXERCISE_TYPES = [
  {
    id: "aggettivi_pronomi",
    label: "Aggettivi e pronomi",
    description: "Completa il testo con la parola giusta",
    icon: Type,
  },
  {
    id: "verbi",
    label: "Forme verbali",
    description: "Coniuga i verbi al tempo corretto",
    icon: Repeat,
  },
  {
    id: "scelta_multipla",
    label: "Scelta multipla",
    description: "Scegli tra 4 opzioni",
    icon: ListChecks,
  },
  {
    id: "situazionale",
    label: "Situazioni comunicative",
    description: "Riconosci il contesto giusto",
    icon: MessageCircle,
  },
] as const

const LOADING_MESSAGES = [
  "Sto preparando il tuo esercizio... 🎨",
  "Creo un testo perfetto per te... ✨",
  "Quasi pronto... 🚀",
  "Analizzando le strutture... 📚",
  "Aggiungendo un tocco di magia... 🪄"
]

export default function ExercisesSelectionPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [level, setLevel] = useState<typeof LEVELS[number]["id"] | null>(null)
  const [type, setType] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0)

  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  const handleLevelSelect = (lvl: typeof LEVELS[number]["id"]) => {
    setLevel(lvl)
    if (step === 1) setStep(2)
  }

  const handleGenerate = async () => {
    if (!level || !type) return
    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-structure-exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level, exercise_type: type })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore nella generazione")

      toast.success("Esercizio generato con successo!")
      router.push(`/student/exercises/${data.exerciseId}`)
    } catch (error: any) {
      toast.error(error.message)
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-12 pb-20">
      {/* Header */}
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex p-3 bg-primary/10 rounded-2xl mb-2"
        >
          <GraduationCap className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Esercizi CILS 🎯
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Allena le tue competenze linguistiche con esercizi su misura per te
        </motion.p>

        {/* Progress Indicator */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: step === s ? 1.2 : 1,
                  backgroundColor: step >= s ? "var(--primary)" : "#e5e7eb"
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-colors",
                  step >= s ? "bg-primary" : "bg-gray-200"
                )}
              >
                {step > s ? <Check className="h-5 w-5" /> : s}
              </motion.div>
              <span className={cn(
                "text-sm font-bold",
                step === s ? "text-primary" : "text-muted-foreground"
              )}>
                Passo {s}
              </span>
              {s === 1 && (
                <div className="w-12 h-1 bg-muted rounded-full mx-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: step > 1 ? "100%" : "0%" }}
                    className="h-full bg-primary"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </header>

      {/* STEP 1: Level Selection */}
      <section className="space-y-6">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-foreground flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
          Seleziona il tuo livello
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LEVELS.map((l) => (
            <motion.button
              key={l.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLevelSelect(l.id)}
              className={cn(
                "relative group overflow-hidden rounded-3xl p-6 h-40 flex flex-col items-center justify-center gap-3 transition-all border-4",
                level === l.id
                  ? "border-primary shadow-xl shadow-primary/20"
                  : "border-transparent hover:shadow-lg"
              )}
            >
              <div className={cn("absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity bg-gradient-to-br", l.gradient)} />

              <span className="relative z-10 text-4xl font-black text-white drop-shadow-md">{l.id}</span>

              <div className="relative z-10 flex gap-0.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={cn(
                      "h-4 w-4 transition-colors",
                      i < l.flames ? "text-white fill-white" : "text-white/30"
                    )}
                  />
                ))}
              </div>

              {level === l.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute top-2 right-2 bg-card rounded-full p-1 shadow-lg"
                >
                  <Check className="h-4 w-4 text-primary" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </section>

      {/* STEP 2: Exercise Type */}
      <AnimatePresence>
        {level && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <motion.h2
              className="text-xl font-bold text-foreground flex items-center gap-2"
            >
              <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
              Scegli il tipo di esercizio
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXERCISE_TYPES.map((t) => (
                <motion.div
                  key={t.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all duration-300 border-2 h-full",
                      type === t.id
                        ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                        : "border-border hover:border-primary/20 hover:bg-gray-50/50 shadow-sm hover:shadow-md"
                    )}
                    onClick={() => setType(t.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-4 rounded-2xl transition-colors",
                          type === t.id ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}>
                          <t.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-black text-lg text-foreground">{t.label}</h3>
                          <p className="text-sm text-muted-foreground font-medium">{t.description}</p>
                        </div>
                        {type === t.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-8 w-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Check className="h-5 w-5 text-white" />
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Generate Button */}
      <AnimatePresence>
        {level && type && (
          <motion.footer
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pt-10 flex flex-col items-center gap-6"
          >
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn(
                "relative h-20 px-16 rounded-3xl text-xl font-black gap-4 shadow-2xl transition-all overflow-hidden",
                !isGenerating && "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] hover:scale-105 active:scale-95"
              )}
            >
              {!isGenerating && (
                <motion.div
                  className="absolute inset-0"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  style={{
                    background: "linear-gradient(90deg, rgba(var(--primary-rgb), 0), rgba(255, 255, 255, 0.2), rgba(var(--primary-rgb), 0))",
                    backgroundSize: "200% 100%"
                  }}
                />
              )}

              {isGenerating ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={loadingMsgIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm md:text-base"
                      >
                        {LOADING_MESSAGES[loadingMsgIndex]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <>
                  GENERA ESERCIZIO
                  <motion.div
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="h-8 w-8 fill-white" />
                  </motion.div>
                </>
              )}
            </Button>
            <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest animate-pulse">
              Pronto a sfidare te stesso? 🚀
            </p>
          </motion.footer>
        )}
      </AnimatePresence>
    </div>
  )
}
