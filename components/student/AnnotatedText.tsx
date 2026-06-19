"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, History } from "lucide-react"

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
  return { text: "text-gray-600", underline: "border-gray-300", dot: "bg-gray-400", label: type || "Altro" }
}

export function AnnotatedText({ originalText, correctedText, corrections }: AnnotatedTextProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  const usedCategories = Array.from(new Set(corrections.map(c => c.error_type))).filter(Boolean)

  const buildParts = (sourceText: string, mode: "corrected" | "original") => {
    const sorted = [...corrections].sort((a, b) =>
      mode === "corrected" ? b.corrected.length - a.corrected.length : b.original.length - a.original.length
    )

    let parts: (string | React.ReactNode)[] = [sourceText]

    sorted.forEach((corr, idx) => {
      const target = mode === "corrected" ? corr.corrected : corr.original
      if (!target) return

      const newParts: (string | React.ReactNode)[] = []

      parts.forEach((part) => {
        if (typeof part !== "string") {
          newParts.push(part)
          return
        }

        const segments = part.split(target)
        segments.forEach((segment, segIndex) => {
          newParts.push(segment)
          if (segIndex < segments.length - 1) {
            const style = getCategoryStyle(corr.error_type)
            newParts.push(
              <span
                key={`${idx}-${segIndex}-${mode}`}
                className={cn(
                  "font-bold px-0.5 rounded-sm border-b-2",
                  style.underline,
                  style.text,
                  mode === "original" && "line-through opacity-70"
                )}
              >
                {target}
              </span>
            )
          }
        })
      })
      parts = newParts
    })

    return parts
  }

  const parts = buildParts(showOriginal ? originalText : correctedText, showOriginal ? "original" : "corrected")

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 p-1 rounded-2xl w-fit">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-xl gap-2 font-bold text-xs px-4 h-9 transition-all",
              !showOriginal ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
            onClick={() => setShowOriginal(false)}
          >
            <FileText className="h-3.5 w-3.5" />
            Testo corretto
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "rounded-xl gap-2 font-bold text-xs px-4 h-9 transition-all",
              showOriginal ? "bg-white text-primary shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
            onClick={() => setShowOriginal(true)}
          >
            <History className="h-3.5 w-3.5" />
            Testo originale
          </Button>
        </div>

        {usedCategories.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap text-[11px] text-gray-500">
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

      <p className="text-[11px] text-gray-400 italic px-1">
        Le parole sottolineate corrispondono alle correzioni elencate qui sotto →
      </p>

      <div className="font-mono text-base md:text-lg leading-[2.1] text-gray-800 whitespace-pre-wrap">
        {parts}
      </div>
    </div>
  )
}
