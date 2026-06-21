"use client"

import React, { useState, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Mail,
  MessageSquare,
  BookText,
  Image as ImageIcon,
  Lightbulb,
  AlertCircle,
  PenTool,
  FileEdit,
  Sparkles,
  Info,
  Clock,
  CheckCircle2
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ContextualGuide } from "@/components/student/ContextualGuide"
import toast from "react-hot-toast"
import { ALL_ACHIEVEMENTS } from "@/lib/constants/achievements"

const TEXT_TYPES = [
  { id: "email_formal", label: "Email formale", icon: Mail },
  { id: "email_informal", label: "Email informale", icon: MessageSquare },
  { id: "narrativo", label: "Narrativo", icon: BookText },
  { id: "descriptivo", label: "Descrittivo", icon: ImageIcon },
  { id: "argumentativo", label: "Argomentativo", icon: Lightbulb },
  { id: "reclamo", label: "Reclamo", icon: AlertCircle },
  { id: "articulo", label: "Articolo", icon: PenTool },
  { id: "libre", label: "Libero", icon: FileEdit },
] as const

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const

const WORD_RANGES: Record<string, string> = {
  A1: "30-50",
  A2: "50-80",
  B1: "80-120",
  B2: "120-180",
  C1: "180-250",
  C2: "250+",
}

const LOADING_MESSAGES = [
  "Analizzando il testo...",
  "Valutando la coerenza...",
  "Revisionando la grammatica...",
  "Rilevando il livello...",
  "Quasi pronto...",
]

function WriteForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [textType, setTextType] = useState(searchParams.get("type") || "email_formal")
  const [level, setLevel] = useState(searchParams.get("level") || "B1")
  const [prompt, setPrompt] = useState("")
  const [content, setContent] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }, [content])

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("maestria_draft") : null
    if (saved) {
      try {
        const draft = JSON.parse(saved)
        if (draft.textType) setTextType(draft.textType)
        if (draft.level) setLevel(draft.level)
        if (draft.prompt) setPrompt(draft.prompt)
        if (draft.content) setContent(draft.content)
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (content.length > 10) {
        localStorage.setItem("maestria_draft", JSON.stringify({
          textType, level, prompt, content
        }))
        setLastSaved(new Date())
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [textType, level, prompt, content])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isSubmitting])

  useEffect(() => {
    const typeParam = searchParams.get("type")
    const levelParam = searchParams.get("level")
    const schemaParam = searchParams.get("schema")

    if (typeParam) setTextType(typeParam)
    if (levelParam) setLevel(levelParam)
    if (schemaParam) setContent(decodeURIComponent(schemaParam))
  }, [searchParams])

  const handleSubmit = useCallback(async () => {
    if (wordCount < 10) {
      toast.error("Testo troppo breve (minimo 10 parole)")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textType, level, prompt, content }),
      })

      const data = await response.json()
      const correctionId = data.correctionId || data.id

      if (correctionId) {
        localStorage.removeItem("maestria_draft")

        if (Array.isArray(data.newAchievements) && data.newAchievements.length > 0) {
          data.newAchievements.forEach((achId: string) => {
            const achievement = ALL_ACHIEVEMENTS.find((a) => a.id === achId)
            if (achievement) {
              toast.success(`${achievement.icon} Traguardo sbloccato: ${achievement.title}!`, { duration: 4000 })
            }
          })
        }

        router.push(`/student/corrections/${correctionId}`)
      } else {
        throw new Error(data.error || "Errore di correzione")
      }
    } catch (error: any) {
      toast.error(error.message)
      setIsSubmitting(false)
    }
  }, [content, level, prompt, router, textType, wordCount])

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* App-like Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground tracking-tight mb-2">Nuova Scrittura</h1>
          <p className="text-muted-foreground font-medium">Affina il tuo italiano con feedback istantaneo dell&apos;IA.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-lg border border-border shadow-sm text-[10px] font-black uppercase tracking-widest text-muted-foreground">
             {lastSaved ? (
               <><CheckCircle2 className="h-3 w-3 text-primary" /> Salvato {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
             ) : (
               <><Clock className="h-3 w-3" /> Auto-salvataggio attivo</>
             )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Editor Main Area */}
        <div className="lg:col-span-8 space-y-10">
          {/* Step 1: Type Selection */}
          <div className="space-y-4">
             <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">1. Tipo di testo</Label>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TEXT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setTextType(type.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all group",
                      textType === type.id
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-border"
                    )}
                  >
                    <type.icon className={cn("h-4 w-4 shrink-0", textType === type.id ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-[11px] font-bold truncate tracking-tight">{type.label}</span>
                  </button>
                ))}
             </div>
          </div>

          {/* Step 2: Level Selection */}
          <div className="space-y-4">
             <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">2. Livello obiettivo</Label>
             <div className="flex flex-wrap gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={cn(
                      "h-10 px-6 rounded-full font-bold text-xs transition-all",
                      level === l
                        ? "bg-gray-900 text-white shadow-lg shadow-black/10"
                        : "bg-card border border-border text-muted-foreground hover:border-gray-300"
                    )}
                  >
                    {l}
                  </button>
                ))}
             </div>
          </div>

          {/* Step 3: Prompt & Editor */}
          <div className="space-y-6 pt-4">
             <div className="space-y-3">
               <div className="flex items-center justify-between px-1">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">3. Istruzioni (opzionale)</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3.5 w-3.5 text-gray-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>Includi la traccia per una valutazione più precisa</TooltipContent>
                  </Tooltip>
               </div>
               <Textarea
                 placeholder="Cosa devi scrivere? Es: 'Scrivi un'email per prenotare un hotel...'"
                 value={prompt}
                 onChange={(e) => setPrompt(e.target.value)}
                 className="bg-gray-50/50 border-border min-h-[60px] text-sm focus:bg-card transition-colors rounded-xl"
               />
             </div>

             <div className="space-y-3">
               <div className="flex items-center justify-between px-1">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">4. Il tuo testo</Label>
                  <div className="text-right">
                    <p className={cn("text-[10px] font-black uppercase tracking-widest", wordCount > 0 ? "text-primary" : "text-gray-300")}>
                      {wordCount} Parole
                    </p>
                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Target: {WORD_RANGES[level]} parole</p>
                  </div>
               </div>
               <Card className="border-none shadow-sm overflow-hidden ring-1 ring-gray-100">
                  <Textarea
                    placeholder="Scrivi qui..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] border-none focus:ring-0 p-8 text-lg font-body leading-relaxed bg-card scrollbar-hide"
                  />
                  <div className="bg-gray-50/50 border-t border-border p-4 flex justify-end">
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={isSubmitting || wordCount < 5}
                      className="bg-primary hover:bg-primary-dark text-white font-bold h-12 px-10 rounded-xl shadow-lg shadow-primary/20"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2 animate-pulse">
                          {LOADING_MESSAGES[loadingMessageIndex]}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Analizza testo <Sparkles className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
               </Card>
             </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
           <ContextualGuide type={textType} level={level} />
        </div>
      </div>
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-muted-foreground font-bold uppercase tracking-widest animate-pulse">Caricamento...</div>}>
      <WriteForm />
    </Suspense>
  )
}
