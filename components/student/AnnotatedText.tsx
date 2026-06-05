"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FileText, History, Info, Sparkles } from "lucide-react"

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
        <div className="font-mono text-lg leading-[2] text-gray-700 whitespace-pre-wrap">
          {originalText}
        </div>
      )
    }

    // Sort corrections by length (descending) to minimize overlapping issues
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
            const underlineColor =
              corr.error_type === 'gramatica' ? 'border-secondary/40 decoration-secondary/50' :
              corr.error_type === 'vocabulario' ? 'border-accent/40 decoration-accent/50' :
              corr.error_type === 'ortografia' ? 'border-blue-400/40 decoration-blue-400/50' :
              'border-purple-400/40 decoration-purple-400/50'

            const textColor =
              corr.error_type === 'gramatica' ? 'text-secondary' :
              corr.error_type === 'vocabulario' ? 'text-accent-dark' :
              corr.error_type === 'ortografia' ? 'text-blue-600' :
              'text-purple-600'

            newParts.push(
              <Tooltip key={`${corr.corrected}-${index}`}>
                <TooltipTrigger>
                   <span className={cn(
                    "cursor-help border-b-2 font-bold transition-all hover:bg-gray-50 px-0.5",
                    underlineColor,
                    textColor
                  )}>
                    {corr.corrected}
                  </span>
                </TooltipTrigger>
                <TooltipContent className="p-4 max-w-xs space-y-3 bg-gray-900 border-none text-white rounded-2xl shadow-2xl">
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
    <div className="space-y-8">
      <div className="flex items-center gap-2 bg-white border border-gray-100 p-1.5 rounded-2xl w-fit shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-xl gap-2 font-bold text-sm px-6 h-10 transition-all",
            !showOriginal ? "bg-primary text-white shadow-md hover:bg-primary hover:text-white" : "text-gray-400 hover:bg-gray-50"
          )}
          onClick={() => setShowOriginal(false)}
        >
          <FileText className="h-4 w-4" />
          Testo corretto
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "rounded-xl gap-2 font-bold text-sm px-6 h-10 transition-all",
            showOriginal ? "bg-primary text-white shadow-md hover:bg-primary hover:text-white" : "text-gray-400 hover:bg-gray-50"
          )}
          onClick={() => setShowOriginal(true)}
        >
          <History className="h-4 w-4" />
          Testo originale
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl bg-white overflow-hidden">
          <CardContent className="p-8 md:p-12">
            {renderAnnotatedText()}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-gray-900">Analisi dettagliata</h3>
            <Badge className="bg-gray-100 text-gray-500 border-none font-bold rounded-full">
              {corrections.length} error{corrections.length === 1 ? 'e' : 'i'}
            </Badge>
          </div>
          <div className="space-y-4">
            {corrections.map((c, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 items-start group hover:border-primary/20 transition-all shadow-sm">
                 <div className={cn(
                   "shrink-0 w-1 h-12 rounded-full",
                   c.error_type === 'gramatica' ? 'bg-secondary/40' :
                   c.error_type === 'vocabulario' ? 'bg-accent/40' :
                   c.error_type === 'ortografia' ? 'bg-blue-400/40' :
                   'bg-purple-400/40'
                 )} />
                 <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-1.5">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{c.error_type}</span>
                     <span className="text-xs font-bold text-secondary/60 line-through truncate ml-2">{c.original}</span>
                   </div>
                   <p className="font-bold text-gray-900 text-lg leading-tight">{c.corrected}</p>
                   <p className="text-xs text-gray-500 mt-2 leading-relaxed">{c.explanation}</p>
                 </div>
              </div>
            ))}
            {corrections.length === 0 && (
                <div className="text-center py-12 px-6 bg-primary/5 rounded-3xl border border-dashed border-primary/20">
                    <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
                    <p className="font-bold text-primary">Nessun errore rilevato!</p>
                    <p className="text-xs text-primary/60 mt-1">Ottimo lavoro, il testo è eccellente.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
