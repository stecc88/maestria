"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FileText, History } from "lucide-react"

interface InlineCorrection {
  original: string
  corrected: string
  explanation: string
  error_type: 'gramatica' | 'vocabulario' | 'ortografia' | 'registro' | string
}

interface AnnotatedTextProps {
  originalText: string
  correctedText: string
  corrections: InlineCorrection[]
}

export function AnnotatedText({ originalText, correctedText, corrections }: AnnotatedTextProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  const renderAnnotatedText = () => {
    if (showOriginal) {
      return (
        <div className="font-mono text-lg leading-[2.2] text-gray-700 whitespace-pre-wrap">
          {originalText}
        </div>
      )
    }

    // Sort corrections by length (descending) to minimize overlapping issues during replacement
    const sortedCorrections = [...corrections].sort((a, b) => b.corrected.length - a.corrected.length)

    // Build the text parts
    let parts: (string | React.ReactNode)[] = [correctedText]

    sortedCorrections.forEach((corr) => {
      const newParts: (string | React.ReactNode)[] = []

      parts.forEach((part) => {
        if (typeof part !== 'string') {
          newParts.push(part)
          return
        }

        const segments = part.split(corr.corrected)
        segments.forEach((segment, index) => {
          newParts.push(segment)
          if (index < segments.length - 1) {
            const isGrammar = corr.error_type === 'grammatica' || corr.error_type === 'gramatica'
            const isVocabulary = corr.error_type === 'lessico' || corr.error_type === 'vocabulario'
            const isSpelling = corr.error_type === 'ortografia'

            const underlineColor =
              isGrammar ? 'border-secondary/40 decoration-secondary/50' :
              isVocabulary ? 'border-accent/40 decoration-accent/50' :
              isSpelling ? 'border-blue-400/40 decoration-blue-400/50' :
              'border-purple-400/40 decoration-purple-400/50'

            const textColor =
              isGrammar ? 'text-secondary' :
              isVocabulary ? 'text-accent-dark' :
              isSpelling ? 'text-blue-600' :
              'text-purple-600'

            newParts.push(
              <Tooltip key={`${corr.corrected}-${index}`}>
                <TooltipTrigger>
                   <span className={cn(
                    "cursor-help border-b-2 font-bold transition-all hover:bg-gray-50 px-0.5 rounded-sm",
                    underlineColor,
                    textColor
                  )}>
                    {corr.corrected}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="p-4 max-w-xs space-y-3 bg-gray-900 border-none text-white rounded-2xl shadow-2xl z-50">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {corr.error_type}
                    </span>
                    <span className="text-xs font-bold text-secondary line-through">{corr.original}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{corr.explanation}</p>
                </TooltipContent>
              </Tooltip>
            )
          }
        })
      })
      parts = newParts
    })

    return (
      <div className="font-mono text-lg leading-[2.2] text-gray-800 whitespace-pre-wrap">
        {parts}
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      <div className="relative">
        {renderAnnotatedText()}
      </div>
    </div>
  )
}
