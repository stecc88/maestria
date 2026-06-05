"use client"

import React, { useState, useEffect, Suspense } from "react"
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
  Info
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ContextualGuide } from "@/components/student/ContextualGuide"
import toast from "react-hot-toast"

const TEXT_TYPES = [
  { id: "email_formal", label: "Email formal", icon: Mail },
  { id: "email_informal", label: "Email informal", icon: MessageSquare },
  { id: "narrativo", label: "Narrativo", icon: BookText },
  { id: "descriptivo", label: "Descriptivo", icon: ImageIcon },
  { id: "argumentativo", label: "Argumentativo", icon: Lightbulb },
  { id: "reclamo", label: "Reclamo", icon: AlertCircle },
  { id: "articulo", label: "Artículo de opinión", icon: PenTool },
  { id: "libre", label: "Libre", icon: FileEdit },
]

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

const WORD_RANGES: Record<string, string> = {
  A1: "30-50 palabras",
  A2: "50-80 palabras",
  B1: "80-120 palabras",
  B2: "120-180 palabras",
  C1: "180-250 palabras",
  C2: "250+ palabras",
}

const LOADING_MESSAGES = [
  "Analizando tu escritura...",
  "Evaluando coherencia y cohesión...",
  "Revisando gramática y vocabulario...",
  "Detectando tu nivel...",
  "Preparando tu feedback...",
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

  // Word count logic
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(w => w.length > 0)
    setWordCount(words.length)
  }, [content])

  // Auto-save logic
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("maestria_draft") : null
    if (saved) {
      try {
        const draft = JSON.parse(saved)
        setTextType(draft.textType || "email_formal")
        setLevel(draft.level || "B1")
        setPrompt(draft.prompt || "")
        setContent(draft.content || "")
      } catch (e) {
        console.error("Error loading draft", e)
      }
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
    }, 30000)
    return () => clearInterval(interval)
  }, [textType, level, prompt, content])

  // Loading message rotation
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isSubmitting) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
      }, 2000)
    }
    return () => clearInterval(interval)
  }, [isSubmitting])

  // Update state if query params change (e.g. navigation from guides)
  useEffect(() => {
    const typeParam = searchParams.get("type")
    const levelParam = searchParams.get("level")
    const schemaParam = searchParams.get("schema")

    if (typeParam) setTextType(typeParam)
    if (levelParam) setLevel(levelParam)
    if (schemaParam) {
      setContent(decodeURIComponent(schemaParam))
    }
  }, [searchParams])

  const handleSubmit = async () => {
    if (wordCount < 10) {
      toast.error("El texto es muy corto para ser evaluado (mínimo 10 palabras)")
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
      console.log("Respuesta de /api/correct:", JSON.stringify(data))

      const correctionId = data.correctionId || data.id

      if (correctionId) {
        localStorage.removeItem("maestria_draft")
        router.push(`/student/corrections/${correctionId}`)
      } else {
        throw new Error(data.error || "Error al corregir")
      }
    } catch (error: any) {
      toast.error(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Nuova Scrittura</h1>
          <p className="text-gray-500 mt-1">
            {"Practic\u00e1 tu italiano con feedback en tiempo real por IA."}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400 font-medium">
          {lastSaved && (
            <span className="flex items-center gap-1 text-primary">
              {"Borrador guardado \u2713 "}
              {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <Label className="text-base font-bold mb-4 block">{"1. Eleg\u00ed el tipo de texto"}</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TEXT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setTextType(type.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2",
                    textType === type.id
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-gray-100 bg-white text-gray-400 hover:border-primary/20 hover:text-gray-600"
                  )}
                >
                  <type.icon className="h-6 w-6" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-bold">2. Nivel del ejercicio</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={cn(
                    "px-6 py-2 rounded-full font-bold text-sm transition-all",
                    level === l
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <Label className="text-base font-bold">3. Consigna / Instrucciones</Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  Ayuda a la IA a evaluar si cumpliste con lo pedido
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              placeholder={"Copi\u00e1 aqu\u00ed la consigna o instrucci\u00f3n del ejercicio (si ten\u00e9s)..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-white border-gray-200 min-h-[80px] focus:ring-primary"
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-bold">4. Tu texto en italiano</Label>
              <div className="flex flex-col items-end">
                <span className={cn(
                  "text-xs font-bold",
                  wordCount > 0 ? "text-primary" : "text-gray-400"
                )}>
                  {wordCount} {"palabras"}
                </span>
                <span className="text-[10px] text-gray-400">
                  {"Rango recomendado: "} {WORD_RANGES[level]}
                </span>
              </div>
            </div>
            <Textarea
              placeholder="Scrivi qui il tuo testo in italiano..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-white border-gray-200 min-h-[350px] text-lg font-body leading-relaxed focus:ring-primary"
            />
          </section>

          <Button
            size="lg"
            className="w-full py-8 text-xl font-bold bg-primary hover:bg-primary-dark shadow-xl shadow-primary/20 group"
            onClick={handleSubmit}
            disabled={isSubmitting || wordCount < 5}
          >
            {isSubmitting ? (
              <div className="flex flex-col items-center animate-pulse">
                <span>{LOADING_MESSAGES[loadingMessageIndex]}</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">
                {"Enviar para correcci\u00f3n"} <Sparkles className="h-6 w-6 group-hover:animate-spin" />
              </span>
            )}
          </Button>
        </div>

        {/* Guide Column */}
        <div className="sticky top-24">
          <ContextualGuide type={textType} level={level} />
        </div>
      </div>
    </div>
  )
}

export default function WritePage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <WriteForm />
    </Suspense>
  )
}
