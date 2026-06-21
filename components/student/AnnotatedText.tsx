"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, Pencil, CheckCircle2 } from "lucide-react"

interface InlineCorrection {
  original: string
  corrected: string
  explanation: string
  error_type: string
}

interface AnnotatedTextProps {
  originalText: string
  correctedText: string
  corrections: InlineCorrection[]
}

const getCategoryStyle = (type: string) => {
  const t = (type || "").toLowerCase()
  if (t.includes("gramm")) return { text: "text-secondary", underline: "border-secondary/40", dot: "bg-secondary", label: "Grammatica" }
  if (t.includes("lessic")) return { text: "text-accent-dark", underline: "border-accent/40", dot: "bg-accent", label: "Lessico" }
  if (t.includes("ortograf")) return { text: "text-blue-600", underline: "border-blue-400/40", dot: "bg-blue-400", label: "Ortografia" }
  if (t.includes("registro")) return { text: "text-purple-600", underline: "border-purple-400/40", dot: "bg-purple-400", label: "Registro" }
  return { text: "text-muted-foreground", underline: "border-gray-300", dot: "bg-gray-400", label: type || "Altro" }
}

/**
 * Modalità "Pratica" (default): mostra il testo originale dello studente
 * con gli errori segnati ma SENZA rivelare la correzione. Lo studente deve
 * toccare ogni parola per scoprire la forma corretta — questo attiva il
 * "retrieval practice": notare l'errore da solo, prima di vedere la
 * risposta, migliora la ritenzione rispetto a leggere subito il testo
 * già corretto.
 *
 * Modalità "Testo corretto": il testo finale completo, per chi vuole
 * vedere subito la versione pulita.
 */
export function AnnotatedText({ originalText, correctedText, corrections }: AnnotatedTextProps) {
  const [mode, setMode] = useState<"practice" | "corrected">("practice")
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const usedCategories = Array.from(new Set(corrections.map(c => c.error_type))).filter(Boolean)
  const allRevealed = corrections.length > 0 && revealed.size === corrections.length

  const toggleReveal = (idx: number) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const revealAll = () => setRevealed(new Set(corrections.map((_, i) => i)))

  const buildPracticeParts = () => {
    const sorted = corrections
      .map((c, i) => ({ ...c, _i: i }))
      .sort((a, b) => b.original.length - a.original.length)

    let parts: (string | React.ReactNode)[] = [originalText]

    sorted.forEach((corr) => {
      if (!corr.original) return
      const newParts: (string | React.ReactNode)[] = []

      parts.forEach((part) => {
        if (typeof part !== "string") {
          newParts.push(part)
          return
        }

        const segments = part.split(corr.original)
        segments.forEach((segment, segIndex) => {
          newParts.push(segment)
          if (segIndex < segments.length - 1) {
            const style = getCategoryStyle(corr.error_type)
            const isRevealed = revealed.has(corr._i)

            newParts.push(
              <button
                key={`${corr._i}-${segIndex}`}
                type="button"
                onClick={() => toggleReveal(corr._i)}
                className={cn(
                  "font-bold px-0.5 rounded-sm border-b-2 transition-all cursor-pointer outline-none",
                  isRevealed
                    ? "border-primary/40 text-primary bg-primary/5"
                    : cn(style.underline, style.text, "line-through opacity-70 hover:bg-muted")
                )}
                title={isRevealed ? "Tocca per nascondere" : "Tocca per scoprire la correzione"}
              >
                {isRevealed ? corr.corrected : corr.original}
              </button>
            )
          }
        })
      })
      parts = newParts
    })

    return parts
  }

  const buildCorrectedParts = () => {
    const sorted = [...corrections].sort((a, b) => b.corrected.length - a.corrected.length)
    let parts: (string | React.ReactNode)[] = [correctedText]

    sorted.forEach((corr, idx) => {
      if (!corr.corrected) return
      const newParts: (string | React.ReactNode)[] = []

      parts.forEach((part) => {
        if (typeof part !== "string") {
          newParts.push(part)
          return
        }
        const segments = part.split(corr.corrected)
        segments.forEach((segment, segIndex) => {
          newParts.push(segment)
          if (segIndex < segments.length - 1) {
            const style = getCategoryStyle(corr.error_type)
            newParts.push(
              <span
                key={`${idx}-${segIndex}`}
                className={cn("font-bold px-0.5 rounded-sm border-b-2", style.underline, style.text)}
              >
                {corr.corrected}
              </span>
            )
          }
        })
      })
      parts = newParts
    })

    return parts
  }

  const parts = mode === "practice" ? buildPracticeParts() : buildCorrectedParts()

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-muted border border-border p-1 rounded-2xl w-fit">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-xl gap-2 font-bold text-xs px-4 h-9 transition-all",
              mode === "practice" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-muted-foreground"
            )}
            onClick={() => setMode("practice")}
          >
            <Pencil className="h-3.5 w-3.5" />
            Pratica
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-xl gap-2 font-bold text-xs px-4 h-9 transition-all",
              mode === "corrected" ? "bg-card text-primary shadow-sm" : "text-muted-foreground hover:text-muted-foreground"
            )}
            onClick={() => setMode("corrected")}
          >
            <FileText className="h-3.5 w-3.5" />
            Testo corretto
          </Button>
        </div>

        {usedCategories.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground">
            {usedCategories.map((cat) => {
              const style = getCategoryStyle(cat)
              return (
                <div key={cat} className="flex items-center gap-1.5">
                  <span className={cn("w-2 h-2 rounded-full", style.dot)} />
                  <span className="font-semibold">{style.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {mode === "practice" ? (
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-muted-foreground italic">
            Tocca una parola sottolineata per scoprire la forma corretta
          </p>
          {corrections.length > 0 && (
            <button
              onClick={allRevealed ? () => setRevealed(new Set()) : revealAll}
              className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <CheckCircle2 className="h-3 w-3" />
              {allRevealed ? "Nascondi tutte" : "Mostra tutte"}
            </button>
          )}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground italic px-1">
          Le parole sottolineate corrispondono alle correzioni elencate qui sotto →
        </p>
      )}

      <div className="font-mono text-base md:text-lg leading-[2.1] text-gray-800 whitespace-pre-wrap">
        {parts}
      </div>
    </div>
  )
}
