"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Sparkles,
  Book,
  PenTool,
  CheckSquare,
  MessageSquare,
  ArrowRight,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const LEVELS = ["A2", "B1", "B2", "C1"] as const
const EXERCISE_TYPES = [
  {
    id: "aggettivi_pronomi",
    label: "Aggettivi e pronomi",
    description: "Completa il testo con la forma corretta",
    icon: Book,
    color: "bg-blue-500"
  },
  {
    id: "verbi",
    label: "Forme verbali",
    description: "Completa il testo con i verbi tra parentesi",
    icon: PenTool,
    color: "bg-green-500"
  },
  {
    id: "scelta_multipla",
    label: "Scelta multipla nel testo",
    description: "Scegli la parola corretta tra le opzioni",
    icon: CheckSquare,
    color: "bg-purple-500"
  },
  {
    id: "situazionale",
    label: "Situazioni comunicative",
    description: "Riconosci il contesto comunicativo giusto",
    icon: MessageSquare,
    color: "bg-orange-500"
  }
] as const

export default function ExercisesSelectionPage() {
  const router = useRouter()
  const [level, setLevel] = useState<typeof LEVELS[number]>("B1")
  const [type, setType] = useState<string>("aggettivi_pronomi")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
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
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-in fade-in duration-500">
      <header className="space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Esercizi CILS
          </h1>
        </div>
        <p className="text-gray-500 text-lg">
          Analisi delle strutture di comunicazione — Pratica per l&apos;esame CILS
        </p>
      </header>

      {/* Level Selection */}
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">
          1. Seleziona il tuo livello
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={cn(
                "py-4 rounded-2xl font-bold text-xl transition-all border-2",
                level === l
                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                  : "bg-white border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </section>

      {/* Type Selection */}
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400 ml-1">
          2. Scegli il tipo di prova
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EXERCISE_TYPES.map((t) => (
            <Card
              key={t.id}
              className={cn(
                "relative overflow-hidden cursor-pointer transition-all duration-300 border-2",
                type === t.id
                  ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                  : "border-gray-100 hover:border-primary/20 hover:bg-gray-50"
              )}
              onClick={() => setType(t.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-xl text-white", t.color)}>
                    <t.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-lg text-gray-900">{t.label}</h3>
                    <p className="text-sm text-gray-500">{t.description}</p>
                  </div>
                  {type === t.id && (
                    <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                      <ArrowRight className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Action */}
      <footer className="pt-6 flex justify-center">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="h-16 px-12 rounded-2xl text-lg font-bold gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              Generazione in corso...
            </>
          ) : (
            <>
              Genera esercizio <Sparkles className="h-6 w-6 fill-white" />
            </>
          )}
        </Button>
      </footer>
    </div>
  )
}
